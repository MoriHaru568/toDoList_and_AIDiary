from flask import  redirect, render_template,request,Blueprint,jsonify, session, url_for
from jinja2 import TemplateNotFound
import openai
import datetime,pytz
from datetime import date

from utils import database_setting,config
DIARY_MESSAGE="あなたは日記について感想を伝えるbotです。できるだけ日記に対して、優しく友達のように語りかけてください。頑張りましたね、のような励みのような言葉があるとよりいいです"
ROBOT_MESSAGE="どんな一日でしたか？"
FUNCTION_NAME="diary"

diary=Blueprint(FUNCTION_NAME,__name__,url_prefix="/"+FUNCTION_NAME,template_folder="templates",static_folder="./static")

@diary.route("/",methods=["GET"])
def index():
    return render_template(FUNCTION_NAME+"/calender.html")


@diary.route("/select_day",methods=['POST','GET'])
def select_day():
    if request.method == "POST":    
        data = request.json
        print(data)
        username=session["user_name"]
        formatted_date=data["formatted_date"]
    
        chats = database_setting.Diary.query.filter_by(username=username,date=formatted_date).all()
        print(chats)

        if not chats:
            chats=[{"role":"robot","content":ROBOT_MESSAGE}]
            return render_template(FUNCTION_NAME+"/chat.html",date=formatted_date,chats=chats) 
        else:
            return render_template(FUNCTION_NAME+"/chat.html",date=formatted_date,chats=chats) 
    elif request.method == "GET":
        username=session["user_name"]
        formatted_date=session["formatted_date"]
        chats = database_setting.Diary.query.filter_by(username=username,date=formatted_date).all()
        return render_template(FUNCTION_NAME+"/chat.html",date=formatted_date,chats=chats) 





@diary.route("/chat",methods=['POST'])
def chat():
    data = request.json
    openai.api_key = config.API_KEY
    print(int(data["diary_year"]))
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": DIARY_MESSAGE},
            {"role": "user", "content": data["diarycomment"]}
        ]   
    )
    res=response.choices[0].message.content
    print(int(data["diary_year"]))
    print(int(data["diary_month"]))
    print(int(data["diary_day"]))

    print(res)  
    #specific_date = datetime.date(int(data["diary_year"]), int(data["diary_month"]), int(data["diary_day"]))
    specific_date = date(int(data["diary_year"]), int(data["diary_month"]), int(data["diary_day"]))
    session["specific_date"]=specific_date
    
    diary_comment_user = database_setting.Diary(
            username=session["user_name"],
            title=specific_date.strftime("%Y-%m-%d"),
            register_datetime=datetime.datetime.now(pytz.timezone('Asia/Tokyo')),
            date=specific_date,
            role="user",
            content= data["diarycomment"]                                      
        )
    diary_comment_robot = database_setting.Diary(
        username=session["user_name"],
        title=specific_date.strftime("%Y-%m-%d"),
        register_datetime=datetime.datetime.now(pytz.timezone('Asia/Tokyo')),
        date=specific_date,
        role="robot",
        content= res                        
        )
    database_setting.db.session.add(diary_comment_user)
    database_setting.db.session.add(diary_comment_robot)
    database_setting.db.session.commit()

    #日付の設定
    session["formatted_date"]=data["formatted_date"]

    return redirect(url_for('diary.select_day'))
   


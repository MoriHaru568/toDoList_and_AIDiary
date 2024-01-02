from flask import render_template,request,Blueprint, session

from utils import database_setting




FUNCTION_NAME="todolist"
todolist=Blueprint(FUNCTION_NAME,__name__,url_prefix="/"+FUNCTION_NAME,template_folder="templates",static_folder="./static")

@todolist.route("/task",methods=['GET','POST'])
def addTask():
    if request.method == "POST":       
        data = request.json
        if "selectedTabId" in data:
            category=data["selectedTabId"]
        else:
            category=data["category"]
            task = database_setting.Task(
                username=session["user_name"],
                title=data["taskName"],
                taskContent=data["taskContent"],
                category=category
            )
            database_setting.db.session.add(task)
            database_setting.db.session.commit()
        #タスクの一覧を取得
        tasks = database_setting.Task.query.filter_by(username=session["user_name"],category=category).all()
        return render_template(FUNCTION_NAME+"/task_list.html",tasks=tasks) 
    elif request.method == "GET":
        #デフォルトとして仕事タスクの一覧を表示
        tasks=database_setting.Task.query.filter_by(username=session["user_name"],category="job").all()
        return render_template(FUNCTION_NAME+"/todolist.html",tasks=tasks)
    
@todolist.route("/delete_task",methods=['POST'])
def deleteTask():
    data = request.json
    deleteTask=database_setting.Task.query.filter_by(username=session["user_name"],title=data["taskName"],category=data["category"]).first()
    database_setting.db.session.delete(deleteTask)
    database_setting.db.session.commit()
    #タスクの表示
    tasks = database_setting.Task.query.filter_by(username=session["user_name"],category=data["category"]).all()
    return render_template(FUNCTION_NAME+"/task_list.html",tasks=tasks)
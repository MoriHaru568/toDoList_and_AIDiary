from flask import  render_template,request,Blueprint,jsonify, session, url_for
from jinja2 import TemplateNotFound


#DBライブラリ
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

from utils import database_setting

FUNCTION_NAME="login"
user=Blueprint(FUNCTION_NAME,__name__,url_prefix="/"+FUNCTION_NAME,template_folder="templates",static_folder="./static")

@user.route("/",methods=["GET"])
def index():
    return render_template(FUNCTION_NAME+"/login.html",message="")


@user.route("/login",methods=['POST'])
def login():
    data = request.json
    print(data)
    username=data["login_username"]
    password=data["login_Password"]    
    user = database_setting.User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        # ユーザー名とパスワードが一致する場合、ログイン成功
        session['user_name'] = username
        response_data = {
        "redirect_url": url_for("todolist.addTask")
        }
        
        return jsonify(response_data)
    else:
        return render_template(FUNCTION_NAME+"/login.html",message="ログイン失敗")


@user.route("/createuser",methods=['POST'])
def createUser():
    data = request.json
    print(data)
    print("test")
    # パスワードをハッシュ化
    password=data["create_Password"]
    hashed_password = generate_password_hash(password, method='pbkdf2:sha1', salt_length=8)
    user = database_setting.User(
            username=data["create_username"],
            password=hashed_password,                
        )
    database_setting.db.session.add(user)
    database_setting.db.session.commit()
    session['user_name'] = user.username
    response_data = {
        "redirect_url": url_for("todolist.addTask")
    }
    
    return jsonify(response_data)
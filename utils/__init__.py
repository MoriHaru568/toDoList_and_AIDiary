from flask import Flask
from .database_setting import db

def create_app():
    app = Flask(__name__)
    
    # データベース設定をアプリケーションに読み込む
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///toDoList.db"
    db.init_app(app)

    return app
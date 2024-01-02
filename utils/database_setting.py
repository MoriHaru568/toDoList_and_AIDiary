from flask import Flask


#DBライブラリ
from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///toDoList.db"
app.config["SECRET_KEY"] = "9c1c9ac6-4525-4cf4-8708-f66887ae7641"
db=SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

class Task(db.Model):
    taskid = db.Column(db.Integer, primary_key=True)
    username =db.Column(db.String(20), nullable=False)
    title =db.Column(db.String(30), nullable=False)
    taskContent= db.Column(db.String(300),  nullable=False)
    category=db.Column(db.String(50),  nullable=False)

class Diary(db.Model):
    diaryid = db.Column(db.Integer, primary_key=True)
    username =db.Column(db.String(20), nullable=False)
    title =db.Column(db.String(30), nullable=False)
    register_datetime= db.Column(db.DateTime,  nullable=False)
    date= db.Column(db.Date,  nullable=False)
    role=db.Column(db.String(20),  nullable=False)
    content=db.Column(db.String(20),  nullable=False)
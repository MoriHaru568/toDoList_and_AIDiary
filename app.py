from flask import render_template,redirect, url_for


#DBライブラリ
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

from utils import create_app
from blueprints.login.views import user
from blueprints.todolist.views import todolist
from blueprints.diary.views import diary


app = create_app()
app.config["SECRET_KEY"] = "9c1c9ac6-4525-4cf4-8708-f66887ae7641"

app.register_blueprint(user)
app.register_blueprint(todolist)
app.register_blueprint(diary)
    

@app.route("/")
def index():
    return redirect(url_for('login.index'))

if __name__ == "__main__":
    app.run(debug=True)


        
        

        


        


     

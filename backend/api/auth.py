from flask import Blueprint, request as req, jsonify
from classes.auth_class import Login, Signup

auth = Blueprint("auth", __name__, url_prefix="/auth")

@auth.post("/login")
def login():
    data = req.json
    print(data)
    user_login = Login(data.get("user_id"), data.get("user_password"))
    return user_login.activity()


@auth.post("/signup")
def signup():
    data = req.json
    user_signup = Signup(data)
    return user_signup.activity()
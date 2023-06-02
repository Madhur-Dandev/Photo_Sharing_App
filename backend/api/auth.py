from flask import Blueprint, request as req, jsonify
from classes.auth_class import Login, Signup, JWT, Auth_Changes

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


@auth.post("/request_pass_change")
def request_pass_change():
    data = Auth_Changes()
    return data.send_pass_mail(req.json.get("user_email"))


@auth.post("/change_pass")
def change_pass():
    data = Auth_Changes()
    return data.reset_pass(req.args.get("token"), req.json.get("new_password"))


@auth.get("/verify")
def verify_user():
    data = req.args
    jwt = JWT()
    return jwt.verify_user(data.get("token"))

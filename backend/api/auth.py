from flask import (
    Blueprint,
    request as req,
    jsonify,
    make_response as res,
    render_template,
    url_for,
)
from classes.auth_class import Login, Signup, JWT, Auth_Changes, Logout

from utility.googleLoginConfig import oauth

auth = Blueprint("auth", __name__, url_prefix="/auth")


@auth.post("/login")
def login():
    data = req.json
    google = req.args.get("google")
    g_id = req.args.get("g_id")
    user_login = Login(
        data.get("user_id"),
        data.get("user_password"),
        is_google=True if google else False,
        g_id=g_id,
    )
    return user_login.activity()


@auth.post("/signup")
def signup():
    data = req.json
    args = req.args
    user_signup = Signup(data, args)
    return user_signup.activity()


@auth.get("/googleSignup")
def googleSignup():
    return oauth.Ushare.authorize_redirect(
        redirect_uri=url_for("api.auth.callback", _external=True)
    )


@auth.get("/callback")
def callback():
    token = oauth.Ushare.authorize_access_token()
    # print(token)
    user_signup = Signup(
        {
            "user_name": token.get("userinfo").get("name"),
            "user_email": token.get("userinfo").get("email"),
            "g_id": token.get("userinfo").get("sub"),
        }
    )
    return user_signup.google_signup()
    # return "Done"


@auth.post("/request_pass_change")
def request_pass_change():
    data = Auth_Changes()
    return data.send_pass_mail(req.json.get("user_email"))


@auth.get("/passChangePage/<string:token>")
def passChangePage(token):
    return render_template("pass_change.html", token=token, title="Change Pass")


@auth.post("/change_pass")
def change_pass():
    data = Auth_Changes()
    return data.reset_pass(req.args.get("token"), req.json.get("new_password"))


@auth.get("/verify")
def verify_user():
    data = req.args
    jwt = JWT()
    return jwt.verify_user(data.get("token"))


@auth.get("/check_loggedin/<string:token>")
def check_loggedin(token):
    refresh_token = req.cookies.get("refresh_token")
    print(refresh_token)
    jwt = JWT()
    result = jwt.check_token(token, refresh_token)
    print(result, "47")
    return (
        jsonify({k: v for k, v in result.items() if k != "user_id"}),
        200 if result.get("success") else 401,
    )


@auth.get("/logout/<string:token>")
def logout(token):
    lgot = Logout()
    return lgot.activity(token)

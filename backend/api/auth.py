from flask import (
    Blueprint,
    request as req,
    jsonify,
    make_response as res,
    render_template,
    url_for,
)

# from classes.auth_class import Login, Signup, JWT, Auth_Changes, Logout
from classes.JWT import JWT
from classes.Login import Login
from classes.Logout import Logout
from classes.Signup import Signup
from classes.AuthChanges import AuthChanges
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from json import loads
from utility.googleLoginConfig import oauth

auth = Blueprint("auth", __name__, url_prefix="/auth")  # Making auth route.


@auth.post("/login")
def login():
    """
    This route will authenticate user based on their email and password provided by user.
    This route will also authenticate user using their google id. (Only by using login with google)
    It'll also provide access and refresh token to end user to requested for it.
    """
    data = req.json
    google = req.args.get("google")
    g_id = req.args.get("g_id")
    print(data, google, g_id)

    # making a object of Login class to perform login operation.
    user_login = Login(
        data.get("user_id"),
        data.get("user_password", ""),
        is_google=True if google else False,
        g_id=g_id,
    )
    return user_login.activity()  # will return the final output to end user.


@auth.post("/signup")
def signup():
    """
    This route will register new user by taking required information.
    Without information or if the user email is already register this route will give throw 403 error with message.
    """
    data = req.json
    user_signup = Signup(data)
    return user_signup.activity()


@auth.post("/google_signup")
def google_signup():
    """
    This route will register new user if he use google signup feature.
    It required a user access token to get all information such as email, name, id, verification status, etc to store that in database.
    If any error occured or if provided token is expired or not valid then this will return a error code.
    """
    access_token = req.json.get("access_token")
    try:
        # This is make a request object first
        req_obj = Request(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        with urlopen(req_obj) as res:
            data = loads(res.read())

    except (HTTPError, URLError) as e:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Error in accessing user info from google",
                }
            ),
            503,
        )
    user_signup = Signup(
        {
            "user_name": data.get("name"),
            "user_email": data.get("email"),
            "g_id": data.get("id"),
        }
    )
    return user_signup.google_signup_json()


@auth.get("/googleSignup")
def googleSignup():
    """
    This route is also to use for registering user via google but this is cumbersome method.
    This route will be removed in future as this is not a convenient method.
    """
    return oauth.Ushare.authorize_redirect(
        redirect_uri=url_for("api.auth.callback", _external=True)
    )


@auth.get("/callback")
def callback():
    """
    It is a callback route for google signup activity for '/googleSignup' route.
    This route will remove with the '/googleSignup' route.
    """
    token = oauth.Ushare.authorize_access_token()

    # After making a object of Signup class we can perform the google signup process.
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
    """
    This route will check if the email of requested user is valid. If it is then it will send a verification mail.
    In case if the mail is not present in database then error will generate and message will return back to user.
    """
    data = AuthChanges()
    return data.send_pass_mail(req.json.get("user_email"))


@auth.get("/passChangePage/<string:token>")
def passChangePage(token):
    """
    This route will require a jwt token generated pass to user by link in the email. When user click that link he redirected to here and token it then use to change pass of verified user.
    """
    return render_template("pass_change.html", token=token, title="Change Pass")


@auth.post("/change_pass")
def change_pass():
    """
    This route will take the token that was pass in the email that will use to identify the user and proceed for further process of reseting the password. In case if the token is not valid or expired then it will throw error and message will return back to user.
    """
    data = AuthChanges()
    return data.reset_pass(
        req.args.get("token"), req.json.get("new_password")
    )  # this method require token pass by user and a new password


@auth.get("/verify")
def verify_user():
    """
    This route will verify user if he is not register via google because to ensure the users privacy and not any misuse of someone's email address. When a user submit required information and ask to register he will get a mail for verification in the submit email's mailbox. This route will then decode information user and proceed further. NOTE - the token will expire in 2 minutes and immediatly after use.
    """
    data = req.args
    jwt = JWT()
    return jwt.verify_user(data.get("token"))


@auth.get("/check_loggedin/<string:token>")
def check_loggedin(token):
    """
    This route ensures that the user is still logged in. In other word, the access token pass to user will check if it's valid or not. In case after the expiry of token and refresh token can be use to generate a new token and send it back to user who requested. NOTE - if user do not provide any refresh token then it is not possible to generate a new access token.
    """
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
    """
    This simple route ensures that when hit the access_token provided by user will become invalid and the refresh token also.
    """
    lgot = Logout()
    return lgot.activity(token)

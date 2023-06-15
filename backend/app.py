from flask import Flask, request as req, render_template, jsonify, g, make_response
from classes.JWT import JWT

# from Google import service
from api import api
from utility.mailConfig import mail
from os import getenv
from flask_cors import CORS
from dotenv import load_dotenv
from utility.googleLoginConfig import oauth

load_dotenv()  # to load all evn variable from local env

app = Flask(__name__)  # create a app object
CORS(app, supports_credentials=True)  # allowing cors request for this api
app.config["SECRET_KEY"] = getenv("JWT_KEY")  # setting a secret key for the app
app.config["SESSION_COOKIE_SECURE"] = True  # allow secure cookie
app.register_blueprint(api)

# mail configuration for mail operation
app.config.update(
    MAIL_SERVER="smtp.gmail.com",
    MAIL_USERNAME=getenv("EMAIL_USER"),
    MAIL_PASSWORD=getenv("EMAIL_PASS"),
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
)

# Mail configuration. Only for testing on local server.
# app.config.update(
#     MAIL_SERVER="localhost",
#     MAIL_PORT=255,  # any port number excluding reserved ports
# )

# initializing app to both objects
mail.init_app(app)
oauth.init_app(app)


def check_token():
    if req.json.get("access_token") and req.cookies.get("refresh_token"):
        jwt = JWT()
        data = jwt.check_token(
            req.json.get("access_token"), req.cookies.get("refresh_token")
        )
        if not data.get("success"):
            return jsonify({"success": False, "message": "Invalid Token"}), 401
        g.user_data = data
    else:
        return jsonify({"success": False, "message": "Unauthorized"}), 401


def check_user_profile_token():
    if not req.args.get("token"):
        return {"success": False, "message": "Unauthorized"}, 401

    jwt = JWT()
    data = jwt.decode_token(req.args.get("token"))
    print(data)
    if not data.get("success"):
        return {"success": False, "message": data.get("message")}, data.get(
            "status_code"
        )
    g.user_id = data.get("data").get("id")


@app.before_request
def before_request():
    print(req.path)
    if req.path[:19] == "/api/profile/token/":
        return check_token()
    elif req.path[:16] == "/api/profile/set":
        return check_user_profile_token()


@app.before_request
def cors_preflight():
    """
    Allow only origin : "http://localhost:5500" and "http://localhost:5173" with credential.
    """
    if req.method == "OPTIONS":
        origin = req.headers.get("origin")
        response = make_response()
        if origin == "http://localhost:5500" or "http://localhost:5173":
            response.headers.add(
                "Access-Control-Allow-Origin",
                origin,
            )
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type, Authorization"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"
        )
        response.headers["Access-Control-Allow-Credentials"] = "true"
        print("")
        return response


@app.route("/", methods=["GET"])
def index():
    """
    Temporary route for testing
    """
    # print(service.albums().list().execute())
    # return "<h1>Home</h1>"
    # print(req.headers.get("referer"))
    return "<h1 style='text-align: center'>Home</h1>"


@app.get("/check")
def check():
    """
    route to test if secured cookies are received or not.
    """
    print(req.cookies)
    return "Done"


@app.get("/display")
def display():
    """
    Testing route for rendering page
    """
    return render_template("pass_change.html", data=15, data2=15, title="Change Pass")


@app.errorhandler(404)
def page_not_found(error):
    """
    If any route not matched, then these will be invoked
    """
    return jsonify({"success": False, "message": "Requesting url path not found!"}), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")

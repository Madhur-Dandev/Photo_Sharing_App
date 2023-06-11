from flask import Flask, request as req, render_template, jsonify

# from Google import service
from api import api
from utility.mailConfig import mail
from os import getenv
from flask_cors import CORS
from dotenv import load_dotenv
from utility.googleLoginConfig import oauth

load_dotenv()  # to load all evn variable from local env

app = Flask(__name__)  # create a app object
CORS(app, supports_credentials=True)  # allowing cors request to this api
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


@app.route("/", methods=["GET"])
def index():
    """
    Temporary route for testing
    """
    # print(service.albums().list().execute())
    # return "<h1>Home</h1>"
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

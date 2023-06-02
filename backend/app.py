from flask import Flask, request as req, make_response as res
from Google import service
from api import api
from utility.mailConfig import mail
from os import getenv
from datetime import datetime, timedelta
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.register_blueprint(api)
app.config["SECRET_KEY"] = getenv("JWT_KEY")
app.config["SESSION_COOKIE_SECURE"] = True
app.config.update(
    MAIL_SERVER="smtp.gmail.com",
    MAIL_USERNAME=getenv("EMAIL_USER"),
    MAIL_PASSWORD=getenv("EMAIL_PASS"),
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
)
# Only for testing.
# app.config.update(
#     MAIL_SERVER="localhost",
#     MAIL_PORT=255,  # any port number excluding reserved ports
# )
mail.init_app(app)


@app.route("/", methods=["GET"])
def index():
    print(service.albums().list().execute())
    return "<h1>Home</h1>"


@app.route("/set_cookie", methods=["GET"])
def set_cookie():
    # Get the client's unique identifier, such as user ID or session ID
    user_id = "11"

    # Create a response object
    response = res("Cookie has been set!")

    # Set the secure cookie with the client's identifier
    response.set_cookie(
        "my_cookie",
        value=user_id,
        secure=True,
        httponly=True,
        samesite=None,
        max_age=(10),
    )

    return response


@app.route("/check_cookie", methods=["GET"])
def check_cookie():
    # Check if the secure cookie is present in the client's request
    user_id = req.cookies.get("my_cookie")
    print(user_id)

    if user_id:
        return f"Hello, user {user_id}!"
    else:
        return "Secure cookie not found!"


@app.route("/delete_cookie", methods=["GET"])
def delete_cookie():
    # Check if the secure cookie is present in the client's request
    resp = res("Cookie deleted")
    resp.delete_cookie("my_cookie", secure=True, httponly=True, samesite=None)

    return resp


@app.errorhandler(404)
def page_not_found(error):
    return "<h1>Page Not Found</h1>"


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")

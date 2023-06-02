from flask import Flask
from Google import service
from api import api
from utility.mailConfig import mail
from os import getenv
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.register_blueprint(api)
app.config.update(
    MAIL_SERVER="smtp.gmail.com",
    MAIL_USERNAME=getenv("EMAIL_USER"),
    MAIL_PASSWORD=getenv("EMAIL_PASS"),
    MAIL_PORT=465,
    MAIL_USE_SSL=True
)
# Only for testing.
# app.config.update(
#     MAIL_SERVER="localhost",
#     MAIL_PORT=255, # any port number excluding reserved ports
# )
mail.init_app(app)


@app.route("/", methods=["GET"])
def index():
    print(service.albums().list().execute())
    return "<h1>Home</h1>"

@app.errorhandler(404)
def page_not_found(error):
    return "<h1>Page Not Found</h1>"

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
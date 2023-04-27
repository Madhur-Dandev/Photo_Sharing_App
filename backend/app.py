from flask import Flask
from Google import service

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    print(service.albums().list().execute())
    return "<h1>Home</h1>"

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
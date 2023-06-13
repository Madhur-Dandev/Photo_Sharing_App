from flask import Blueprint
from classes.auth_class import JWT

profile = Blueprint("profile", __name__, url_prefix="/profile")


@profile.get("/")
def index():
    return "Hi"


@profile.post("/change_picture")
def change_picture():
    pass

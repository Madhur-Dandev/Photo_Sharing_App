from flask import Blueprint
from .auth import auth
from .profile import profile
from .photos import photos

api = Blueprint(
    "api", __name__, url_prefix="/api"
)  # Making a blueprint for api routes. The path preceding with '/api/' keyword
api.register_blueprint(auth)
api.register_blueprint(profile)
api.register_blueprint(photos)

from flask import Blueprint
from .auth import auth

api = Blueprint(
    "api", __name__, url_prefix="/api"
)  # Making a blueprint for api routes. The path preceding with '/api/' keyword
api.register_blueprint(auth)

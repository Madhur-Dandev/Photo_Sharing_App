from flask import Blueprint, request as req
from classes.Photos import Photos

photos = Blueprint("photo", __name__, url_prefix="/photos")


@photos.get("/getPhoto/<string:foldername>/<string:filename>")
def getPhoto(foldername, filename):
    # print(req.args.get("type"))
    # print(foldername, filename)
    return Photos(foldername, filename, req.args.get("type")).getImage()

from flask import Blueprint, g, request as req
from classes.Profile import Profile

profile = Blueprint("profile", __name__, url_prefix="/profile")


@profile.get("/<username>")
def get_profile_by_username(username: str = ""):
    print(username)
    return Profile.get_profile(user_name=username)


@profile.get("/token/<token>")
def get_profile_by_token(token):
    return Profile.get_profile(user_id=g.user_id, new_token=g.token)


@profile.post("/set")
# @profile.put("/update")
def update_profile():
    user_data = dict(req.form)
    user_data.update({"user_picture": req.files.get("user_picture")})
    profile = Profile(user_data)
    print(g.get("user_id"))
    return profile.set_profile_data(g.user_id)
    # return {"success": True}


@profile.patch("/update_picture")
def update_profile_picture():
    return {"success": True}


@profile.post("/delete")
def delete_profile():
    return {"success": False}

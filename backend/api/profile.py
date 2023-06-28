from flask import Blueprint, g, request as req
from classes.Profile import Profile

profile = Blueprint("profile", __name__, url_prefix="/profile")


@profile.get("/<username>")
def get_profile_by_username(username: str = ""):
    # print(username)
    return Profile.get_profile(user_name=username)


@profile.get("/token")
def get_profile_by_token():
    return Profile.get_profile(
        user_id=g.user_data.get("user_id"), new_token=g.user_data.get("g.token")
    )


@profile.post("/set")
# @profile.put("/update")
def update_profile():
    user_data = dict(req.form)
    user_data.update({"user_picture": req.files.get("user_picture")})
    profile = Profile(user_data)
    # print(g.get("user_id"))
    return profile.set_profile_data(g.user_id)
    # return {"success": True}


@profile.patch("/updatePicture")
def update_profile_picture():
    print(req.form)
    print(req.files)
    data = dict(req.form)
    data.update({"image": req.files.get("image")})
    return Profile.setNewPicture(data, g.user_data)


@profile.patch("/removePicture")
def remove_picture():
    return Profile.removePicture(g.user_info)


@profile.post("/delete")
def delete_profile():
    return {"success": False}

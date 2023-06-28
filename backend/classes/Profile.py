from .JWT import JWT
from database import db
from sqlalchemy import text, exc
from .UserDefinedExc import UserDefinedExc
from utility.helping_functions import get_file_size, edit_profile_picture
from os import path, getenv, mkdir, remove
from shutil import rmtree
from dotenv import load_dotenv
from pathlib import Path
from string import ascii_letters, digits
from random import choice
from flask import request as req

load_dotenv()


class Profile(JWT):
    def __init__(self, user_data: dict) -> None:
        super().__init__()
        self.user_name = user_data.get("user_name")
        self.user_picture = user_data.get("user_picture")
        self.user_bio = user_data.get("user_bio", "")

    @staticmethod
    def get_profile(user_name: str = None, user_id: int = None, new_token=""):
        try:
            query = "SELECT user_info.*, users.user_name as name FROM"
            if user_name:
                query += f""" user_info JOIN users ON user_info.user_id = users.user_id WHERE user_info.user_name = '{user_name}'"""
            else:
                query += f""" users JOIN user_info ON users.user_id = user_info.user_id WHERE users.user_id = {user_id}"""

            with db.connect() as conn:
                user_data = conn.execute(text(query)).mappings().first()
                if user_data:
                    user_data = dict(user_data)
                    user_data.update({"success": True})

                    if new_token and new_token != "":
                        user_data.update({"access_token": new_token})

                    return user_data, 200

                raise UserDefinedExc(404, "User Not Found")

        except (Exception, exc.SQLAlchemyError) as e:
            print(e)
            if isinstance(e, UserDefinedExc):
                return {"success": False, "message": e.args[0]}, e.code
            elif isinstance(e, exc.SQLAlchemyError):
                return {
                    "success": False,
                    "message": "Database Error. Please Try again later",
                }, 503
            else:
                return {
                    "success": False,
                    "message": "Server Error. Please Try again later",
                }, 500

    def set_profile_data(self, id):
        try:
            user_picture_location = ""
            if self.user_picture:
                file_size = get_file_size(self.user_picture)

                if self.user_picture.mimetype.find("image") == -1:
                    raise UserDefinedExc(400, "File must be image")
                elif file_size == 0:
                    raise UserDefinedExc(400, "Invalid file or file size")
                elif file_size.get("size") > 100000:
                    raise UserDefinedExc(400, "Image size is greater than 100kb")
                else:
                    user_folder = "".join(
                        [choice(ascii_letters + digits) for _ in range(12)]
                    )
                    if not path.exists(
                        path.join(getenv("USER_PICTURE_FOLDER"), user_folder)
                    ):
                        mkdir(path.join(getenv("USER_PICTURE_FOLDER"), user_folder))
                    user_picture_location = path.join(
                        getenv("USER_PICTURE_FOLDER"),
                        user_folder,
                        f"img.{self.user_picture.filename.rsplit('.', 1)[1]}",
                    )

                    self.user_picture.save(user_picture_location)

            with db.connect() as conn:
                conn.execute(
                    text(
                        f"""INSERT INTO user_info (user_name, user_picture, user_bio, user_id) VALUES ('{self.user_name}', '{user_picture_location}', '{self.user_bio if self.user_bio else ''}', {id})"""
                    )
                )

                conn.execute(
                    text(
                        f"""INSERT INTO restricted_token (token) VALUE ('{req.args.get("token")}')"""
                    )
                )

            return {
                "success": True,
                "message": "User Profile is set. Redirecting you to Ushare",
            }

        except (Exception, exc.SQLAlchemyError) as e:
            print(e)
            if isinstance(e, UserDefinedExc):
                return {"success": False, "message": e.args[0]}, e.code
            return {
                "success": False,
                "message": "Server Error. Please try again later",
            }, 500

    @staticmethod
    def setNewPicture(data, user_data):
        try:
            if not data.get("image"):
                raise UserDefinedExc(403, "An image is needed to be set.")

            with db.connect() as conn:
                user_picture = conn.execute(
                    text(
                        f"""SELECT user_picture FROM user_info WHERE user_id = {user_data.get("user_id")}"""
                    )
                ).first()
                folder_name = ""
                if user_picture[0]:
                    folder_name = user_picture[0].rsplit("/", 2)[1]

                file_size = get_file_size(data.get("image"))

                if data.get("image").mimetype.find("image") == -1:
                    raise UserDefinedExc(400, "File must be image")
                elif file_size == 0:
                    raise UserDefinedExc(400, "Invalid file or file size")
                elif file_size.get("size") > 500000:
                    raise UserDefinedExc(400, "Image size is greater than 100kb")
                else:
                    if not folder_name:
                        folder_name = "".join(
                            [choice(ascii_letters + digits) for _ in range(12)]
                        )
                    if not path.exists(
                        path.join(getenv("USER_PICTURE_FOLDER"), folder_name)
                    ):
                        mkdir(path.join(getenv("USER_PICTURE_FOLDER"), folder_name))
                    user_picture_location = path.join(
                        getenv("USER_PICTURE_FOLDER"),
                        folder_name,
                        f"img.{data.get('image').filename.rsplit('.', 1)[1]}",
                    )

                    if path.exists(user_picture[0]):
                        remove(user_picture[0])

                    data.get("image").save(user_picture_location)
                    data.update({"image": user_picture_location})
                    edit_result = edit_profile_picture(**data)

                    if not edit_result:
                        if path.exists(user_picture_location):
                            # remove(user_picture_location)
                            rmtree(
                                path.join(getenv("USER_PICTURE_FOLDER"), folder_name)
                            )
                            raise UserDefinedExc(500, "Server Error! Try again later.")

                conn.execute(
                    text(
                        f"""UPDATE user_info SET user_picture = \"{user_picture_location}\" WHERE user_id = {user_data.get("user_id")}"""
                    )
                )

                return_dict = {
                    "success": True,
                    "message": "Image changed successfully!",
                }

                if user_data.get("token"):
                    return_dict.update({"token": user_data.get("token")})

                return return_dict

        except (Exception, exc.SQLAlchemyError) as e:
            print(e)
            if isinstance(e, exc.SQLAlchemyError):
                return {"success": False, "message": "Database Error"}, 500
            elif isinstance(e, UserDefinedExc):
                return {"success": False, "message": e.args[0]}, e.code
            else:
                return {"success": False, "message": "Server Error"}, 500

    @staticmethod
    def removePicture(user_data):
        try:
            with db.connect() as conn:
                user_picture = conn.execute(
                    text(
                        f"""SELECT user_picture FROM user_info WHERE user_id = {user_data.get("id")}"""
                    )
                ).first()

                if not user_picture[0]:
                    raise UserDefinedExc(403, "User has no picture to remove!")

                if path.exists(user_picture[0]):
                    rmtree(user_picture[0].rsplit("/", 2)[1])

                    conn.execute(
                        text(
                            f"""UPDATE user_info SET user_picture = '' WHERE user_id = {user_data.get("user_id")}"""
                        )
                    )

                    return_dict = {
                        "success": True,
                        "message": "Picture Removed!",
                    }

                    if user_data.get("token"):
                        return_dict.update({"token": user_data.get("token")})

                    return return_dict, 200

                raise UserDefinedExc(403, "User has no picture to remove!")

        except (Exception, exc.SQLAlchemyError) as e:
            print(e)
            if isinstance(e, exc.SQLAlchemyError):
                return {"success": False, "message": "Database Error"}, 500
            elif isinstance(e, UserDefinedExc):
                return {"success": False, "message": e.args[0]}, e.code
            else:
                return {"success": False, "message": "Server Error"}

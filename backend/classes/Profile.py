from .JWT import JWT
from database import db
from sqlalchemy import text, exc
from .UserDefinedExc import UserDefinedExc
from utility.helping_functions import get_file_size
from os import path, getenv, mkdir
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
            query = "SELECT user_info.*, users.user_name FROM"
            if user_name:
                query += f""" user_info JOIN users ON user_info.user_id = users.user_id WHERE user_name = '{user_name}'"""

            query += f""" users JOIN user_info ON users.user_id = user_info.user_id WHERE user_id = {user_id}"""

            with db.connect() as conn:
                user_data = conn.execute(text(query)).mappings().first()
                if user_data:
                    user_data.update({"success": True})

                    if new_token and new_token != "":
                        user_data.update({"access_token": new_token})

                    return user_data, 200

                raise UserDefinedExc(404, "User Not Found")

        except (Exception, exc.SQLAlchemyError) as e:
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
                print(file_size)

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
                    self.user_picture.stream.seek(0)

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

            return {"success": True}

        except (Exception, exc.SQLAlchemyError) as e:
            print(e)
            return {"success": False}


# from pathlib import Path
# from os import path

# print(Path(__file__).parents[1])

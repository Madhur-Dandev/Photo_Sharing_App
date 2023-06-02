from sqlalchemy import text, exc
from flask import request as req
from database import db
from werkzeug.security import generate_password_hash, check_password_hash
from .UserDefinedExc import UserDefinedExc
from . import Main
from flask import make_response as res, jsonify
from .Mail import Mail
from jwt import encode, decode, exceptions
from datetime import timedelta, datetime
from dotenv import load_dotenv
from os import getenv
import re

load_dotenv()


class Login(Main):
    def __init__(self, user_id, user_password) -> None:
        self.user_id = user_id
        self.user_password = user_password

    def activity(self):
        verify_email = self.verify("email", self.user_id)
        verify_pass = self.verify("password", self.user_password)

        try:
            if verify_email:
                if verify_pass:
                    with db.connect() as conn:
                        existing_user = (
                            conn.execute(
                                text(
                                    f"""SELECT * FROM users WHERE user_email = "{self.user_id}" LIMIT 1"""
                                )
                            )
                            .mappings()
                            .first()
                        )
                        if existing_user:
                            print(existing_user)
                            if check_password_hash(
                                existing_user.get("user_password"), self.user_password
                            ):
                                access_token = encode(
                                    {
                                        "data": {"id": existing_user.get("user_id")},
                                        "exp": datetime.utcnow()
                                        + timedelta(minutes=15),
                                    },
                                    getenv("JWT_KEY"),
                                )
                                refresh_token = encode(
                                    {
                                        "data": {"id": existing_user.get("user_id")},
                                        "exp": datetime.utcnow() + timedelta(days=5),
                                    },
                                    getenv("JWT_KEY"),
                                )
                                resp = res(
                                    jsonify(
                                        {
                                            "success": True,
                                            "message": "Login Successfully",
                                            "access_token": access_token,
                                        }
                                    ),
                                    200,
                                )
                                resp.set_cookie(
                                    "refresh_token",
                                    refresh_token,
                                    secure=True,
                                    httponly=True,
                                    samesite=None,
                                    max_age=(3600 * 24 * 30),
                                )
                                return resp
                            else:
                                raise UserDefinedExc(401, "Password Incorrect!")
                        else:
                            raise UserDefinedExc(401, "User Not Found!")
                else:
                    raise UserDefinedExc(400, "Password Pattern not matched")
            else:
                raise UserDefinedExc(400, "Invalid Email Address")
        except (exc.SQLAlchemyError, UserDefinedExc) as e:
            if isinstance(e, exc.SQLAlchemyError):
                return jsonify({"success": False, "message": "Database Error"}), 503
            elif isinstance(e, UserDefinedExc):
                return jsonify({"success": False, "message": e.args[0]}), e.code
            else:
                return jsonify({"success": False, "message": "Server Error"}), 500


class Signup(Main, Mail):
    def __init__(self, user_data) -> None:
        self.user_name = user_data.get("user_name")
        self.user_email = user_data.get("user_email")
        self.user_password = user_data.get("user_password")

    def activity(self):
        verify_name = self.verify("name", self.user_name)
        verify_email = self.verify("email", self.user_email)
        verify_pass = self.verify("password", self.user_password)

        try:
            if verify_name:
                if verify_email:
                    with db.connect() as conn:
                        existing_user = (
                            conn.execute(
                                text(
                                    f"""SELECT * FROM users WHERE user_email = \"{self.user_email}\" LIMIT 1"""
                                )
                            )
                            .mappings()
                            .all()
                        )
                        print(existing_user)
                        if existing_user:
                            raise UserDefinedExc(403, "User Already Exists!")
                        if verify_pass:
                            data_token = encode(
                                {
                                    "data": {
                                        "user_name": self.user_name,
                                        "user_email": self.user_email,
                                        "user_password": generate_password_hash(
                                            self.user_password
                                        ),
                                    },
                                    "exp": datetime.utcnow() + timedelta(minutes=2),
                                },
                                getenv("JWT_KEY"),
                            )
                            self.send_mail(
                                "UShare Registration Verification",
                                recipients=[self.user_email],
                                token=data_token,
                                type="verify",
                            )

                            return jsonify(
                                {
                                    "success": True,
                                    "message": "Check your mail inbox for verification.",
                                }
                            )
                        else:
                            raise UserDefinedExc(400, "Password Pattern Not Matched!")
                else:
                    raise UserDefinedExc(400, "Invalid Email Address")
            else:
                raise UserDefinedExc(400, "Name length must be greater than 4")

        except UserDefinedExc as e:
            if isinstance(e, UserDefinedExc):
                return jsonify({"success": False, "message": e.args[0]}), e.code
            elif isinstance(e, exc.SQLAlchemyError):
                return jsonify({"success": False, "message": "Database Error"}), 503
            else:
                return jsonify({"success": False, "message": "Server Error"}), 500


class JWT:
    def verify_user(self, token: str):
        try:
            user_data = decode(token, getenv("JWT_KEY"), algorithms=["HS256"])
            print(user_data)
            with db.connect() as conn:
                existing_user = (
                    conn.execute(
                        text(
                            f"""SELECT * FROM users WHERE user_email = \"{user_data.get("data").get("user_email")}\""""
                        )
                    )
                    .mappings()
                    .first()
                )

                print(existing_user)

                if existing_user:
                    raise UserDefinedExc(403, "Session Expired")
                else:
                    id = conn.execute(
                        text(
                            f"""INSERT INTO users (user_name, user_email, user_password) VALUES ("{user_data.get("data").get("user_name")}", "{user_data.get("data").get("user_email")}", "{user_data.get("data").get("user_password")}")"""
                        )
                    )
                    return (
                        jsonify({"success": True, "message": "You are verified"}),
                        200,
                    )
        except (
            exceptions.ExpiredSignatureError,
            exceptions.InvalidSignatureError,
            exceptions.InvalidTokenError,
            Exception,
        ) as e:
            print(e)
            if (
                isinstance(e, exceptions.ExpiredSignatureError)
                or isinstance(e, exceptions.InvalidSignatureError)
                or isinstance(e, exceptions.InvalidTokenError)
            ):
                return jsonify({"success": False, "message": "Invalid Token"}), 401
            elif isinstance(e, UserDefinedExc):
                return jsonify({"success": False, "message": e.args[0]}), e.code
            else:
                return jsonify({"success": False, "message": "Server Error"}), 500

    def check_token(self, token: str):
        return token


class Auth_Changes(Mail, Main):
    def send_pass_mail(self, email):
        try:
            verify_email = self.verify("email", email)
            if verify_email:
                with db.connect() as conn:
                    existing_user = (
                        conn.execute(
                            text(
                                f"""SELECT  * FROM users WHERE user_email = \"{email}\" LIMIT 1"""
                            )
                        )
                        .mappings()
                        .first()
                    )

                    if existing_user:
                        data_token = encode(
                            {
                                "data": {"id": existing_user.get("user_id")},
                                "exp": datetime.utcnow() + timedelta(minutes=2),
                            },
                            getenv("JWT_KEY"),
                        )

                        self.send_mail(
                            "UShare Password Reset",
                            recipients=[email],
                            token=data_token,
                            type="password",
                        )

                        return (
                            jsonify(
                                {
                                    "success": True,
                                    "message": "Reset Link is sent to your email.",
                                }
                            ),
                            200,
                        )

            else:
                raise UserDefinedExc(400, "Email pattern not matched!")
        except (exc.SQLAlchemyError, UserDefinedExc) as e:
            if isinstance(e, UserDefinedExc):
                return jsonify({"success": False, "message": e.args[0]}), e.code
            if isinstance(e, exc.SQLAlchemyError):
                return jsonify({"success": False, "message": "Database Error"}), 503
            else:
                return jsonify({"success": False, "message": "Server Error"}), 500

    def reset_pass(self, token: str, new_pass: str):
        try:
            verify_pass = self.verify("password", new_pass)
            if verify_pass:
                user_id = (
                    decode(token, getenv("JWT_KEY"), algorithms=["HS256"])
                    .get("data")
                    .get("id")
                )
                with db.connect() as conn:
                    conn.execute(
                        text(
                            f"""UPDATE users SET user_password = \"{generate_password_hash(new_pass)}\" WHERE user_id = {user_id}"""
                        )
                    )
                    return (
                        jsonify(
                            {
                                "success": True,
                                "message": "Password has been changed successfully!",
                            }
                        ),
                        200,
                    )
            else:
                raise UserDefinedExc(403, "Password pattern not matched!")
        except (
            exc.SQLAlchemyError,
            exceptions.ExpiredSignatureError,
            exceptions.InvalidSignatureError,
            exceptions.InvalidTokenError,
            Exception,
        ) as e:
            if isinstance(e, UserDefinedExc):
                return (
                    jsonify(
                        {
                            "success": False,
                            "message": e.args[0],
                        }
                    ),
                    e.code,
                )
            elif (
                isinstance(e, exceptions.ExpiredSignatureError)
                or isinstance(e, exceptions.InvalidSignatureError)
                or isinstance(e, exceptions.InvalidTokenError)
            ):
                return jsonify({"success": False, "message": "Invalid Token"}), 401
            else:
                return (
                    jsonify(
                        {
                            "success": False,
                            "message": "Server Error! Cannot change password now.",
                        }
                    ),
                    503,
                )

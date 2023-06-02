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
                            .all()
                        )
                        if existing_user:
                            if check_password_hash(
                                existing_user.get("user_password", self.user_password)
                            ):
                                return jsonify(
                                    {"success": True, "message": "Login Successfully"}
                                )
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
                                html=f"""
                                    <div style="max-width: 600px; margin: 0 auto;">
                                        <h1 style="text-align: center; font-size: 32px; font-weight: bold;">Verify your email address</h1>
                                        <p style="font-size: 18px; line-height: 1.5;">Please click the button below to verify your email address and activate your account:</p>
                                        <div style="text-align: center;">
                                            <a href="{req.root_url}api/auth/verify?token={data_token}" style="background-color: #1e90ff; color: #fff; display: inline-block; padding: 16px 24px; font-size: 18px; text-decoration: none; border-radius: 4px;">Verify Email Address</a>
                                        </div>
                                        <p style="font-size: 18px; line-height: 1.5;">If you did not request to verify your email address, please ignore this message.</p>
                                    </div>
                                    """,
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
                id = conn.execute(
                    text(
                        f"""INSERT INTO users (user_name, user_email, user_password) VALUES ("{user_data.get("data").get("user_name")}", "{user_data.get("data").get("user_email")}", "{user_data.get("data").get("user_password")}")"""
                    )
                )
            return jsonify({"success": True, "message": "You are verified"}), 200
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
            else:
                return jsonify({"success": False, "message": "Server Error"}), 500

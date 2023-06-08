from sqlalchemy import text, exc
from flask import request as req, render_template
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


class JWT:
    def verify_user(self, token: str):
        try:
            user_data = decode(token, getenv("JWT_KEY"), algorithms=["HS256"])
            user_data = self.decode_token(token)
            if not user_data.get("success"):
                raise UserDefinedExc(401, "Invalid Token")
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
        except (Exception,) as e:
            print(e, "203")
            if isinstance(e, UserDefinedExc):
                return jsonify({"success": False, "message": e.args[0]}), e.code
            else:
                return jsonify({"success": False, "message": "Server Error"}), 500

    def check_token(self, token: str, refresh_token: str):
        try:
            token_data = self.decode_token(token)
            print(token_data, "212")
            if not token_data.get("success"):
                if token_data.get("type") == 1:
                    result = self.generate_new_token(refresh_token)
                    print(result, "216")
                    if result.get("success"):
                        result_dict = {"token": result.get("token")}
                        result_dict.update(
                            self.check_token(result.get("token"), refresh_token)
                        )
                        return result_dict

                return {"success": False}

            with db.connect() as conn:
                existing_user = (
                    conn.execute(
                        text(
                            f"""SELECT * FROM users WHERE user_id = {token_data.get("data").get("id")}"""
                        )
                    )
                    .mappings()
                    .first()
                )
                if existing_user:
                    return {
                        "user_id": token_data.get("data").get("id"),
                        "user_name": existing_user.get("user_name"),
                        "success": True,
                    }
                else:
                    return {"success": False}

        except (
            exc.SQLAlchemyError,
            Exception,
        ) as e:
            print(e, "246")

            return {"success": False}

    def generate_new_token(self, token: str):
        try:
            token_data = self.decode_token(token)
            print(token_data, "257")
            if token_data.get("success"):
                return {
                    "success": True,
                    "token": encode(
                        {
                            "data": token_data.get("data"),
                            "exp": datetime.utcnow() + timedelta(minutes=15),
                        },
                        getenv("JWT_KEY"),
                    ),
                }
        except Exception as e:
            print(e, "277")
            return {"success": False}

    def decode_token(self, token):
        try:
            token_data = decode(token, getenv("JWT_KEY"), algorithms=["HS256"])
            print(token_data, "283")
            return {
                "success": True,
                "data": token_data.get("data"),
            }
        except (
            exceptions.ExpiredSignatureError,
            exceptions.InvalidSignatureError,
            exceptions.InvalidTokenError,
            Exception,
        ) as e:
            result_dict = {"success": False}
            print(e, "295")
            if isinstance(e, exceptions.ExpiredSignatureError):
                result_dict.update({"type": 1})
            elif isinstance(e, exceptions.InvalidTokenError):
                result_dict.update({"type": 2})
            else:
                result_dict.update({"type": 3})
            return result_dict

    @staticmethod
    def generate_token(payload: dict = {}, exp: int = 0):
        return encode({"data": payload, "exp": exp}, getenv("JWT_KEY"))


class Auth:
    def __init__(self, user_id: str) -> None:
        self.user_id = user_id

    def check_user(self):
        try:
            with db.connect() as conn:
                user_data = (
                    conn.execute(
                        text(
                            f"""SELECT * FROM users WHERE user_email = "{self.user_id}" LIMIT 1"""
                        )
                    )
                    .mappings()
                    .first()
                )
                result = {"success": True}
                if user_data:
                    result.update(user_data)
                return result

        except (exc.SQLAlchemyError, Exception) as e:
            print(e)
            if isinstance(e, exc.SQLAlchemyError):
                return {
                    "success": False,
                    "message": "Database Error",
                    "status_code": 503,
                }
            else:
                return {"success": False, "message": "Server Error", "status_code": 500}


class Login(Main, JWT, Auth):
    def __init__(
        self, user_id, user_password: str, is_google: bool = False, g_id: int = 0
    ) -> None:
        super().__init__(user_id)
        self.user_id = user_id
        self.user_password = user_password
        self.is_google = is_google
        self.g_id = g_id

    def activity(self):
        verify_email = self.verify("email", self.user_id)
        verify_pass = self.verify("password", self.user_password)

        try:
            if verify_email:
                existing_user = self.check_user()
                print(existing_user)
                if existing_user.get("success"):
                    if existing_user.get("user_id"):
                        if self.user_password != "":
                            if (
                                not check_password_hash(
                                    existing_user.get("user_password"),
                                    self.user_password,
                                )
                                or not verify_pass
                            ):
                                raise UserDefinedExc(401, "Password Incorrect!")
                        else:
                            if (
                                not self.is_google
                                or not existing_user.get("g_id") == self.g_id
                            ):
                                raise UserDefinedExc(401, "Unauthorized")
                        return self.generateResponse(
                            existing_user.get("user_id"), existing_user.get("user_name")
                        )
                    else:
                        raise UserDefinedExc(401, "User Not Found!")
                else:
                    raise UserDefinedExc(
                        existing_user.get("status_code"), existing_user.get("message")
                    )
            else:
                raise UserDefinedExc(400, "Invalid Email Address")
        except UserDefinedExc as e:
            if isinstance(e, UserDefinedExc):
                return jsonify({"success": False, "message": e.args[0]}), e.code
            else:
                return jsonify({"success": False, "message": "Server Error"}), 500

    # def check_user(self):
    #     try:
    #         with db.connect() as conn:
    #             user_data = dict(
    #                 conn.execute(
    #                     text(
    #                         f"""SELECT * FROM users WHERE user_email = "{self.user_id}" LIMIT 1"""
    #                     )
    #                 )
    #                 .mappings()
    #                 .first()
    #             )

    #             print(self.user_id)
    #             user_data.update({"success": True})
    #             return user_data

    #     except (exc.SQLAlchemyError, Exception) as e:
    #         print(e)
    #         if isinstance(e, exc.SQLAlchemyError):
    #             return {"success": False, "message": "Database Error"}
    #         else:
    #             return {"success": False, "message": "Server Error"}

    def generateResponse(self, user_id, user_name):
        try:
            access_token = JWT.generate_token(
                {"id": user_id},
                int((datetime.utcnow() + timedelta(minutes=15)).timestamp()),
            )
            refresh_token = JWT.generate_token(
                {"id": user_id},
                int((datetime.utcnow() + timedelta(days=5)).timestamp()),
            )
            resp = res(
                jsonify(
                    {
                        "success": True,
                        "message": "Login Successfully",
                        "username": user_name,
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
                path="/",
            )
            return resp

        except Exception as e:
            return jsonify({"success": True}), 500


class Signup(Main, Mail, Auth):
    def __init__(self, user_data: dict = {}) -> None:
        super().__init__(user_data.get("user_email"))
        self.user_name = user_data.get("user_name")
        self.user_email = user_data.get("user_email")
        self.user_password = user_data.get("user_password")
        self.g_id = user_data.get("g_id")

    def activity(self):
        verify_name = self.verify("name", self.user_name)
        verify_email = self.verify("email", self.user_email)
        verify_pass = self.verify("password", self.user_password)

        try:
            if verify_name:
                if verify_email:
                    existing_user = self.check_user()
                    if existing_user.get("success"):
                        if not existing_user.get("user_id"):
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
                                raise UserDefinedExc(
                                    400, "Password Pattern Not Matched!"
                                )
                        else:
                            raise UserDefinedExc(403, "User Already Exists!")
                    else:
                        raise UserDefinedExc(
                            existing_user.get("status_code"),
                            existing_user.get("message"),
                        )
                else:
                    raise UserDefinedExc(400, "Invalid Email Address")
            else:
                raise UserDefinedExc(400, "Name length must be greater than 4")

        except UserDefinedExc as e:
            if isinstance(e, UserDefinedExc):
                return jsonify({"success": False, "message": e.args[0]}), e.code
            else:
                return jsonify({"success": False, "message": "Server Error"}), 500

    def google_signup(self):
        try:
            existing_user = self.check_user()
            print(existing_user)
            if not existing_user.get("success"):
                raise UserDefinedExc(
                    existing_user.get("status_code"), existing_user.get("message")
                )
            else:
                if not existing_user.get("user_id"):
                    with db.connect() as conn:
                        conn.execute(
                            text(
                                f"""INSERT INTO users (user_name, user_email, user_password, g_id) VALUES (\"{self.user_name}\", \"{self.user_email}\", \"\", \"{self.g_id}\")"""
                            )
                        )
                    raise UserDefinedExc(
                        200, "Signup Complete! You can close the window and login now."
                    )
                else:
                    print("hi")
                    raise UserDefinedExc(
                        400,
                        "User Already Exists! Go back to signup and try with different account",
                    )

        except (Exception, exc.SQLAlchemyError) as e:
            print(e)
            if isinstance(e, exc.SQLAlchemyError):
                message = "Database Error"
            elif isinstance(e, UserDefinedExc):
                message = e.args[0]
            else:
                message = "Server Error"
            return render_template("signup_message.html", message=message)


class Logout(JWT):
    def activity(self, token):
        try:
            token_data = self.decode_token(token)
            if token_data.get("success"):
                with db.connect() as conn:
                    conn.execute(
                        text(
                            f"""INSERT INTO restricted_token (token) VALUE (\"{token}\")"""
                        )
                    )
            resp = res(
                jsonify({"success": True, "message": "Logout Successfully"}), 200
            )
            resp.delete_cookie(
                "refresh_token", "/", secure=True, httponly=True, samesite=None
            )
            return resp
        except (exc.SQLAlchemyError, Exception) as e:
            print(e)
            return jsonify({"success": False, "message": "Server Error"}), 503


class Auth_Changes(Mail, Main, JWT):
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
                token_data = self.decode_token(token)
                if not token_data.get("success"):
                    if token_data.get("type") == 1:
                        raise UserDefinedExc(401, "Invalid Token or Session Expire")

                with db.connect() as conn:
                    conn.execute(
                        text(
                            f"""UPDATE users SET user_password = \"{generate_password_hash(new_pass)}\" WHERE user_id = {token_data.get("data").get("id")}"""
                        )
                    )
                    return (
                        jsonify(
                            {
                                "success": True,
                                "message": "Password Changed! You can login now.",
                            }
                        ),
                        200,
                    )
            else:
                raise UserDefinedExc(403, "Password pattern not matched!")
        except (
            exc.SQLAlchemyError,
            Exception,
        ) as e:
            print(e)
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

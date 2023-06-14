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

# import re
from utility.helping_functions import username_generator

load_dotenv()


class JWT:
    def verify_user(self, token: str):
        try:
            with db.connect() as conn:
                user_data = self.decode_token(token)
                print(user_data)
                if not user_data.get("success"):
                    raise UserDefinedExc(
                        user_data.get("status_code"), user_data.get("message")
                    )
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
                    conn.execute(
                        text(
                            f"""INSERT INTO users (user_name, user_email, user_password) VALUES ("{user_data.get("data").get("user_name")}", "{user_data.get("data").get("user_email")}", "{user_data.get("data").get("user_password")}")"""
                        )
                    )
                    id = conn.execute(
                        text(f"""SELECT LAST_INSERT_ID() from users""")
                    ).first()[0]
                    conn.execute(
                        text(
                            f"""INSERT INTO restricted_token (token) VALUE ('{token}')"""
                        )
                    )
                    print(id)
                    # return (
                    #     jsonify({"success": True, "message": "You are verified"}),
                    #     200,
                    # )
                    return render_template(
                        "signup_username.html",
                        username=username_generator(
                            user_data.get("data").get("user_name")
                        ),
                        token=self.generate_token(
                            {"id": id},
                            int((datetime.utcnow() + timedelta(days=1)).timestamp()),
                        ),
                    )
        except (Exception,) as e:
            print(e, "67")
            if isinstance(e, UserDefinedExc):
                message = e.args[0]
                # return jsonify({"success": False, "message": e.args[0]}), e.code
            else:
                message = "Server Error"
                # return jsonify({"success": False, "message": "Server Error"}), 500
            return render_template("signup_message.html", message=message)

    def check_token(self, token: str, refresh_token: str):
        try:
            token_data = self.decode_token(token)
            print(token_data, "212")
            if not token_data.get("success"):
                if token_data.get("status_code") == 403:
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
            with db.connect() as conn:
                token_exists = conn.execute(
                    text(
                        f"""SELECT COUNT(token_id) FROM restricted_token WHERE token = '{token}'"""
                    )
                ).first()
                if not token_exists[0]:
                    token_data = decode(token, getenv("JWT_KEY"), algorithms=["HS256"])
                    print(token_data, "283")
                    return {
                        "success": True,
                        "data": token_data.get("data"),
                    }
                raise UserDefinedExc(403, "Session Expired")
        except (
            exceptions.ExpiredSignatureError,
            exceptions.InvalidSignatureError,
            exceptions.InvalidTokenError,
            Exception,
            exc.SQLAlchemyError,
        ) as e:
            result_dict = {"success": False, "status_code": 500}
            print(e, "295")
            if (
                isinstance(e, exceptions.ExpiredSignatureError)
                or isinstance(e, exceptions.InvalidTokenError)
                or isinstance(e, exceptions.InvalidSignatureError)
            ):
                result_dict.update({"message": e, "status_code": 403})
            elif isinstance(e, exc.SQLAlchemyError):
                result_dict.update({"message": "Database Error", "status_code": 503})
            elif isinstance(e, UserDefinedExc):
                result_dict.update({"message": e.args[0], "status_code": e.code})
            else:
                result_dict.update({"message": "Server Error"})
            return result_dict

    @staticmethod
    def generate_token(payload: dict = {}, exp: int = 0):
        print(payload)
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
                                mail_result = self.send_mail(
                                    "UShare Registration Verification",
                                    recipients=[self.user_email],
                                    token=data_token,
                                    type="verify",
                                )

                                if not mail_result.get("success"):
                                    raise UserDefinedExc(
                                        500,
                                        "Cannot proceed for request. Please try again later.",
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
                raise UserDefinedExc(
                    400,
                    "Name should only contain alphanumeric character and length of min 5 and max 25",
                )

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

    def google_signup_json(self):
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
                    # raise UserDefinedExc(
                    #     200, "Signup Complete! You can close the window and login now."
                    # )
                    return (
                        jsonify(
                            {"success": True, "message": "You have been registered!"}
                        ),
                        201,
                    )
                else:
                    raise UserDefinedExc(
                        400,
                        "User Already Exists! Go back to signup and try with different account",
                    )

        except (Exception, exc.SQLAlchemyError) as e:
            print(e)
            if isinstance(e, exc.SQLAlchemyError):
                message = "Database Error"
                code = 503
            elif isinstance(e, UserDefinedExc):
                message = e.args[0]
                code = e.code
            else:
                message = "Server Error"
                code = 500
            return jsonify({"success": True, "message": message}), code


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

                        mail_result = self.send_mail(
                            "UShare Password Reset",
                            recipients=[email],
                            token=data_token,
                            type="password",
                        )

                        if not mail_result.get("success"):
                            raise UserDefinedExc(
                                500,
                                "Cannot proceed for request. Please try again later.",
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
                    raise UserDefinedExc(401, token_data.get("message"))

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

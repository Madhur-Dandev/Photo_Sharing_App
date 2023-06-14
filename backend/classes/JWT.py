from jwt import encode, decode, exceptions
from .UserDefinedExc import UserDefinedExc
from sqlalchemy import text, exc
from flask import render_template
from utility.helping_functions import username_generator
from database import db
from datetime import datetime, timedelta
from dotenv import load_dotenv
from os import getenv

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

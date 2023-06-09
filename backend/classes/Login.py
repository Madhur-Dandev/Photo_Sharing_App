from .JWT import JWT
from werkzeug.security import check_password_hash
from .UserDefinedExc import UserDefinedExc
from flask import jsonify, make_response as res
from datetime import datetime, timedelta
from . import Main
from .Auth import Auth


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
            if not verify_email:
                raise UserDefinedExc(400, "Invalid Email Address")

            existing_user = self.check_user()
            print(existing_user)
            if not existing_user.get("success"):
                raise UserDefinedExc(
                    existing_user.get("status_code"), existing_user.get("message")
                )

            if not existing_user.get("user_id"):
                raise UserDefinedExc(401, "User Not Found!")

            if (self.user_password == "" and not self.is_google) or existing_user.get(
                "g_id"
            ) != self.g_id:
                raise UserDefinedExc(401, "Unauthorized")
            if self.user_password != "":
                if (
                    not check_password_hash(
                        existing_user.get("user_password"), self.user_password
                    )
                    or not verify_pass
                ):
                    raise UserDefinedExc(401, "Password Incorrect!")

            return self.generateResponse(
                existing_user.get("user_id"),
                existing_user.get("user_name"),
                existing_user.get("u_name"),
            )

        except Exception as e:
            if isinstance(e, UserDefinedExc):
                return jsonify({"success": False, "message": e.args[0]}), e.code
            else:
                return jsonify({"success": False, "message": "Server Error"}), 500

    def generateResponse(self, user_id, name, user_name):
        try:
            access_token = JWT.generate_token(
                {"id": user_id}, datetime.utcnow() + timedelta(minutes=15)
            )
            refresh_token = JWT.generate_token(
                {"id": user_id}, datetime.utcnow() + timedelta(days=5)
            )
            resp = res(
                jsonify(
                    {
                        "success": True,
                        "message": "Login Successfully",
                        "name": name,
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

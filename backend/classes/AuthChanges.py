from .Mail import Mail
from . import Main
from .JWT import JWT
from .UserDefinedExc import UserDefinedExc
from datetime import datetime, timedelta
from flask import jsonify
from sqlalchemy import text, exc
from database import db
from werkzeug.security import generate_password_hash


class AuthChanges(Mail, Main, JWT):
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
                        data_token = self.generate_token(
                            {"id": existing_user.get("user_id")},
                            datetime.utcnow() + timedelta(minutes=2),
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

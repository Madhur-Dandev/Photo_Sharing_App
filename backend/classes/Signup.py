from . import Main
from .Mail import Mail
from .Auth import Auth
from flask import jsonify, render_template
from .UserDefinedExc import UserDefinedExc
from database import db
from sqlalchemy import exc, text
from werkzeug.security import generate_password_hash
from .JWT import JWT
from datetime import datetime, timedelta


class Signup(Main, Mail, Auth, JWT):
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
                                data_token = self.generate_token(
                                    {
                                        "user_name": self.user_name,
                                        "user_email": self.user_email,
                                        "user_password": generate_password_hash(
                                            self.user_password
                                        ),
                                    },
                                    int(
                                        (
                                            datetime.utcnow() + timedelta(minutes=2)
                                        ).timestamp()
                                    ),
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

from .JWT import JWT
from database import db
from flask import jsonify, make_response as res
from sqlalchemy import exc, text


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

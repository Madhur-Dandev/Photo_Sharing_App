from sqlalchemy import exc, text
from database import db


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

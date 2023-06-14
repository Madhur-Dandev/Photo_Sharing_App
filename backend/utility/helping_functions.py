from database import db
from sqlalchemy import exc, text
from random import choice
from string import digits
from re import match


def username_generator(name: str):
    try:
        with db.connect() as conn:
            user_names = conn.execute(
                text(f"""SELECT user_name FROM user_info""")
            ).all()
            name_split = [word for item in name.split() for word in item.split("_")]
            if len(name_split[0]) >= 16:
                name = name_split[0][:16]
            elif len(name_split[0]) <= 8 and len(name_split[1]) <= 8:
                name = name_split[1] + name_split[0]
            else:
                name = name_split[0]
            name += "".join([choice(digits) for _ in range(4)])
            print(match(r"^[\w\.]{6,20}$", name))
            print(any([True if item[0] == name else False for item in user_names]))

    except (Exception, exc.SQLAlchemyError) as e:
        print(e)


username_generator("mr.madhur")

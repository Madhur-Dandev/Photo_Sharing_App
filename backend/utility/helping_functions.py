from database import db
from sqlalchemy import exc, text
from random import choice
from string import digits
from cv2 import imread, warpAffine, resize, INTER_AREA, imwrite
import numpy as np

# from re import match


def discard_num(val: str):
    try:
        int(val)
        return False
    except ValueError as e:
        return True


def username_generator(name: str):
    try:
        with db.connect() as conn:
            user_names = conn.execute(
                text(f"""SELECT user_name FROM user_info""")
            ).all()
            name_split = [word for item in name.split() for word in item.split("_")]
            name_split = list(filter(discard_num, name_split))
            if len(name_split[0]) >= 16:
                name = name_split[0][:16]
            elif len(name_split[0]) <= 8 and len(name_split[1]) <= 8:
                name = name_split[1] + name_split[0]
            else:
                name = name_split[0]
            while True:
                temp = name + "".join([choice(digits) for _ in range(4)])
                if not any([True if item[0] == temp else False for item in user_names]):
                    name = temp
                    break

            return name

            # print(match(r"^[\w\.]{6,20}$", name))
            # print(any([True if item[0] == name else False for item in user_names]))

    except (Exception, exc.SQLAlchemyError) as e:
        print(e)


def get_file_size(file: object):
    try:
        if file:
            # method to read size of incoming file over the internet
            size_of_file = 0
            data = file.stream.read(1024)

            while data:
                size_of_file += len(data)
                file.stream.flush()
                data = file.stream.read(1024)

            file.stream.seek(0)
            return {"size": size_of_file}

    except (Exception, IOError) as e:
        print(e)
        return {"size": 0}


def edit_profile_picture(
    image: str, width: int, height: int, translateX: int, translateY: int
):
    try:
        width = int(width) + 8
        height = int(height) + 8
        translateX = float(translateX)
        translateY = float(translateY)

        print(width, height, translateX, translateY)

        init_img = imread(image)
        resize_img = resize(init_img, (width, height), INTER_AREA)

        t_matrix = np.float32(
            [
                [1, 0, translateX],
                [0, 1, translateY],
            ]
        )

        translate_img = warpAffine(resize_img, t_matrix, (width, height))

        crop_img = translate_img[0:300, 0:300]

        imwrite(image, crop_img)

        return True

    except Exception as e:
        print(e)
        return False

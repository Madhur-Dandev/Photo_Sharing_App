from dotenv import load_dotenv
from flask import send_from_directory, send_file
from os import path, getenv

load_dotenv()


class Photos:
    def __init__(self, foldername: str, filename: str, type: str):
        self.foldername = foldername
        self.filename = filename
        self.type = type

    def getImage(self):
        try:
            folder_path = ""
            if self.type == "profile":
                folder_path = getenv("USER_PICTURE_FOLDER")

            # if path.exists(path.join(folder_path, self.foldername, self.filename)):
            return (
                send_file(
                    path.join(folder_path, self.foldername, self.filename),
                ),
                200,
            )

        except Exception as e:
            print(e)
            return "File Not Found", 400

from flask import jsonify

class UserDefinedExc(Exception):
    def __init__(self, code: int, *args: object) -> None:
        super().__init__(*args)
        self.code = code
    
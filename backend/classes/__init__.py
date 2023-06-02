import re

class Main:
    def verify(self, type: str, data: str):
        res = False
        if type == "password":
            res = True if re.search(r"\w{5,}", data) and re.search(r"\d{2,}", data) and re.search(r"\W{1,}", data) and re.search(r"[A-Z]{1,}", data) else False
            # if re.search(r"\w{5,}", data) and re.search(r"\d{2,}", data) and re.search(r"\W{1,}", data) and re.search(r"[A-Z]{1,}", data):
            #     return {"success" : True}
            # else:
            #     return {"success" : False}
        elif type == "email":
            res = True if re.match(r"^\w{3,}@\w{2,}\.\w{2,}", data) else False
            # if re.match(r"^\w{3,}@\w{2,}\.\w{2,}", self.user_id):
            #     return {"success" : True}
            # else:
            #     return {"success" : False}
        else:
            res = True if len(data) > 4 else False
            # if len(data) > 4:
            #     return {"success" : True}
            # else:
            #     return {"success" : False}
            
        return res
import re


class Main:
    """
    This class have some commonly used method across inherited classes.
    """

    def verify(self, type: str, data: str):
        """
        This method will take the type and a data and will check if the pattern of type is match or not. It will return true if matched and false if not matched.
        """
        res = False
        if type == "password":
            res = (
                True
                if re.search(r"\w{5,}", data)
                and re.search(r"\d{2,}", data)
                and re.search(r"\W{1,}", data)
                and re.search(r"[A-Z]{1,}", data)
                else False
            )
        elif type == "email":
            res = True if re.match(r"^\w{3,}@\w{2,}\.\w{2,}", data) else False
        else:
            res = True if len(data) > 4 else False

        return res

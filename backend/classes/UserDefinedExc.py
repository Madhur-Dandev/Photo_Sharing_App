class UserDefinedExc(Exception):
    """
    This class initialize the user defined exception to raise our own exception
    """

    def __init__(self, code: int, *args: object) -> None:
        """
        This constructor will change the actual working of constructor of Exception class and this user defined exception and accept a "code" argument to pass for returning status code in resposne to api request.
        """
        super().__init__(*args)
        self.code = code

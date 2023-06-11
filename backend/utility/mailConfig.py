from flask_mail import Mail

mail = (
    Mail()
)  # making a mail object that will use to perform mail operation. This object requires a app object to be get registered and registration for this object is performed in the app.py file.

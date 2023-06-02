from utility.mailConfig import mail
from dotenv import load_dotenv
from os import getenv

load_dotenv()


class Mail:
    def send_mail(
        self,
        subject: str = "",
        sender: str = getenv("EMAIL_USER"),
        recipients: list = [],
        html: str = "",
    ):
        mail.send_message(
            subject=subject, sender=sender, recipients=recipients, html=html
        )

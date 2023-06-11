from utility.mailConfig import mail
from flask import request as req
from dotenv import load_dotenv
from os import getenv

load_dotenv()


class Mail:
    """
    This mail class is user to perform mail operation by using mail object.
    """

    def send_mail(
        self,
        subject: str = "",
        sender: str = getenv("EMAIL_USER"),
        recipients: list = [],
        token: str = "",
        type: str = "",
    ):
        """
        This method is use to send mail to requested users email address but based on their request type. Such as here are only body template available, first one is for user registration verification and another for reset password request.
        """
        mail.send_message(
            subject=subject,
            sender=sender,
            recipients=recipients,
            html=f"""
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Password Reset</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px; margin: 0;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 5px; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);">
                            {self.verify_body(token) if type == "verify" else self.reset_pass_body(token)}
                        </div>
                    </body>
                </html>
                """,
        )

    def reset_pass_body(self, token):
        """
        This method provide body for reset password email.
        """

        return f"""
                <h1 style="font-size: 24px; margin-bottom: 30px; text-align: center;">Password Reset</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">Dear User,</p>
                <p style="font-size: 16px; margin-bottom: 20px;">We have received a request to reset your password. To proceed with the password reset, please click the button below:</p>
                <p style="text-align: center; margin-bottom: 20px;"><a href="{req.root_url}api/auth/passChangePage/{token}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Reset Password</a></p>
                <p style="font-size: 16px; margin-bottom: 20px;">If you didn't request a password reset, please ignore this email. Your account is still secure.</p>
                <p style="font-size: 16px; margin-bottom: 20px;">Thank you,</p>
                <p style="font-size: 16px; margin-bottom: 20px;">UShare</p>"""

    def verify_body(self, token):
        """
        This method provide body for user verification email.
        """

        return f"""
                <h1 style="font-size: 24px; margin-bottom: 30px; text-align: center;">Verify your email address</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">Dear User,</p>
                <p style="font-size: 16px; margin-bottom: 20px;">Please click the button below to verify your email address and activate your account:</p>
                <p style="text-align: center; margin-bottom: 20px;"><a href="{req.root_url}api/auth/verify?token={token}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Verify Email Address</a></p>
                <p style="font-size: 16px; margin-bottom: 20px;">If you did not request to verify your email address, please ignore this message.</p>
                <p style="font-size: 16px; margin-bottom: 20px;">Thank you,</p>
                <p style="font-size: 16px; margin-bottom: 20px;">UShare</p>"""

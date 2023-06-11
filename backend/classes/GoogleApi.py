from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os


class Google:
    @staticmethod
    def Create_Service(
        client_secrets_file_loc: str,
        api_service_namme: str,
        api_version: str,
        scope: list,
    ):
        """
        This static method will create a service object for api request for google apis and return that object to where it was requested.
        """
        os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"  # only for development phase

        token_file_name = os.path.join(
            Path(__file__).parents[1],
            "credentials",
            f"token_{api_service_namme}_{api_version}.json",
        )

        """Shows basic usage of the People API.
        Prints the name of the first 10 connections.
        """
        creds = None
        # The file token.json stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        if os.path.exists(token_file_name):
            creds = Credentials.from_authorized_user_file(token_file_name, scope)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    client_secrets_file_loc, scope
                )
                creds = flow.run_local_server(port=0)
                print(creds)
            # Save the credentials for the next run
            with open(token_file_name, "w") as token:
                token.write(creds.to_json())

        return build("people", "v1", credentials=creds, static_discovery=False)

    @staticmethod
    def get_poeple_data(id: str):
        """
        This will first ask to create the service object for api request from "Create_Service" class and then get the user data by behalf of their provided google id and return the data.
        """
        try:
            service = Google().Create_Service(
                os.path.join(
                    Path(__file__).parents[1],
                    "credentials",
                    "client_secret.json",
                ),
                "people",
                "v1",
                [
                    "https://www.googleapis.com/auth/contacts.readonly",
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/userinfo.email",
                ],
            )
            return (
                service.people()
                .get(resourceName=f"people/{id}", personFields="names,emailAddresses")
                .execute()
            )  # This will get the information of google user but the only visible information will be shown that means for example, if the user hidden their email information then it api will not get that information about that specific user.
        except (HttpError, Exception) as e:
            if isinstance(e, HttpError):
                return {"found": False, "message": "User Not Found"}
            return {"found": False, "message": "Server Error"}


# print(Google.get_poeple_data("107154271921615923258"))

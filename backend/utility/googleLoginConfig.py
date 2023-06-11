from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth
from os import getenv

load_dotenv()  # load all local env variables.

oauth = OAuth()  # make a new object of OAuth class for google oauth authentication.

# register the app by providing the client's information. NOTE - client id and client secret must be kept under secure means and scope should not exceed tha actual limit set.
oauth.register(
    "Ushare",
    client_id=getenv("CLIENT_ID"),
    client_secret=getenv("CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid profile email"},
)

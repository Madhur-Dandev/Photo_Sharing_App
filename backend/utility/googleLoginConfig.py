from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth
from os import getenv

load_dotenv()

oauth = OAuth()
oauth.register(
    "Ushare",
    client_id=getenv("CLIENT_ID"),
    client_secret=getenv("CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid profile email"},
)

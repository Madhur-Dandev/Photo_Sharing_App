# from googleapiclient.discovery import build
# import pickle
# import os

# def Get_Service(API_SERVICE_NAME, API_VERSION):
#     pickle_file = os.path.join(os.getcwd(), "backend", "token_photoslibrary_v1.pickle")
#     cred = None
#     if os.path.exists(pickle_file):
#         with open(pickle_file, 'rb') as token:
#             cred = pickle.load(token)
#             print(dir(cred))
#             print(cred.expired)
#     try:
#         service = build(API_SERVICE_NAME, API_VERSION, credentials=cred, static_discovery=False)
#         # print(API_SERVICE_NAME, 'service created successfully')
#         return service
#     except Exception as e:
#         print(e)
#     return None

# service = Get_Service("photoslibrary", "v1")

import pickle
import os
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

def Create_Service(client_secret_file, api_name, api_version, *scopes):
    print(client_secret_file, api_name, api_version, scopes, sep='-')
    CLIENT_SECRET_FILE = client_secret_file
    API_SERVICE_NAME = api_name
    API_VERSION = api_version
    SCOPES = [scope for scope in scopes[0]]

    cred = None

    pickle_file = f'token_{API_SERVICE_NAME}_{API_VERSION}.pickle'
    # print(pickle_file)

    if os.path.exists(pickle_file):
        with open(pickle_file, 'rb') as token:
            cred = pickle.load(token)

    if not cred or not cred.valid:
        if cred and cred.expired and cred.refresh_token:
            cred.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            cred = flow.run_local_server()

        with open(pickle_file, 'wb') as token:
            pickle.dump(cred, token)

    try:
        service = build(API_SERVICE_NAME, API_VERSION, credentials=cred, static_discovery=False)
        print(API_SERVICE_NAME, 'service created successfully')
        return service
    except Exception as e:
        print(e)
    return None

service = Create_Service('credentials/client_secret.json', "photoslibrary", "v1", ['https://www.googleapis.com/auth/photoslibrary',
          'https://www.googleapis.com/auth/photoslibrary.sharing'])
from googleapiclient.discovery import build
import pickle
import os

def Get_Service(API_SERVICE_NAME, API_VERSION):
    pickle_file = os.path.join(os.getcwd(), "backend", "token_photoslibrary_v1.pickle")
    cred = None
    if os.path.exists(pickle_file):
        with open(pickle_file, 'rb') as token:
            cred = pickle.load(token)
            # print(dir(cred))
            # print(cred.expired)
    try:
        service = build(API_SERVICE_NAME, API_VERSION, credentials=cred, static_discovery=False)
        # print(API_SERVICE_NAME, 'service created successfully')
        return service
    except Exception as e:
        print(e)
    return None

service = Get_Service("photoslibrary", "v1")
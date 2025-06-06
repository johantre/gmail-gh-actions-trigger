import os
import json
from google.oauth2 import service_account
from google.auth.transport.requests import Request

def main():
    # Lees service account JSON vanuit environment variable
    sa_json = os.environ.get("SERVICE_ACCOUNT_JSON")
    if not sa_json:
        raise Exception("SERVICE_ACCOUNT_JSON environment variable not set")

    creds_dict = json.loads(sa_json)
    scopes = ["https://www.googleapis.com/auth/script.projects"]
    creds = service_account.Credentials.from_service_account_info(creds_dict, scopes=scopes)
    creds.refresh(Request())
    print(creds.token)

if __name__ == "__main__":
    main()

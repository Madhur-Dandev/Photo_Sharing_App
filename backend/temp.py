# from flask import Flask, request

# app = Flask(__name__)

# @app.post("/form")
# def form():

#     image = request.files.get("img")

#     # method to read size of incoming file over the internet
#     size_of_file = 0
#     data = image.stream.read(1024)
#     while data:
#         size_of_file += len(data)
#         image.stream.flush()
#         data = image.stream.read(1024)
#     print(round(size_of_file / 1000, 1)) # converting bytes to megabytes and rounding it.

#     return f"Size of file is : {size_of_file // 1000 // 1000}MB"
# if __name__ == "__main__":
#     app.run(debug=True)


{
    "access_token": "ya29.a0AWY7Ckka6_rpyUs5T-IIqzjH65iLV_DGRzTBi9oiEKwh4D36MlQGhxm6wEwoApv5KpLphirw-3LdcCj0CvrU8GbgrOQ3SGRbDNGpH183ngpPGXqAyfXa1FSbgCukkMtFGsc0zWnfKot1XbrnxLa8w4aOlkRHaCgYKAd8SARISFQG1tDrpvFbHl_pFz2_80J738N-HUw0163",
    "expires_in": 3599,
    "scope": "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    "token_type": "Bearer",
    "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg1YmE5MzEzZmQ3YTdkNGFmYTg0ODg0YWJjYzg0MDMwMDQzNjMxODAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxNDU3NzUyNzk1MzctaWJzMWdlOWFpcTk4bDJiMzI1cjFzMGQzZzBuNGplMTUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxNDU3NzUyNzk1MzctaWJzMWdlOWFpcTk4bDJiMzI1cjFzMGQzZzBuNGplMTUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDcxNTQyNzE5MjE2MTU5MjMyNTgiLCJlbWFpbCI6InByYWRpcDk1MjczQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiZDVLOVdLWDBEZG90Tml5aU40VzdJdyIsIm5vbmNlIjoiQzJVTmUwVWpnNmt3MG1aUkZsQWwiLCJuYW1lIjoiMTkyIE1hZGh1ciBEYW5kZXYiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Y3RnX3lndC1QX0J6MkZRQWpQa1llcHNfRWdtUkUxdm1yU3AyT0w9czk2LWMiLCJnaXZlbl9uYW1lIjoiMTkyIE1hZGh1ciIsImZhbWlseV9uYW1lIjoiRGFuZGV2IiwibG9jYWxlIjoiZW4tR0IiLCJpYXQiOjE2ODYyMTIzODAsImV4cCI6MTY4NjIxNTk4MH0.QuboTpI8Y1dicvB47ebD9lCTNmg-7j6__0HX9hNuePbtVKuicZR3Tp1UD9O7B2hCUSrn_OvLp9qvNCtQM375pwtQXH1cOw5EVJV4t2EMwx-89adbhpULo0WXjVdNsdYkDiTRxURxNXuswXW3ucyxz3-LuO6iPfOwheriVp7I0L9yqCh60Iwy0pOC_nsZPDC7HETL6w9yxMxESV3Ssl41D1_kwQ72lXQhcwtxpBhU5vDt4f6-BmBWXAv7jq4eP3lP21edJQw4NIjwZVfvg7Lzi3jS8bl57rGgjrzmlYWwRu2eg8DK5zItE9V9SvRWI-AlcVEwzrXq6mowFJJZax-oIA",
    "expires_at": 1686215980,
    "userinfo": {
        "iss": "https://accounts.google.com",
        "azp": "145775279537-ibs1ge9aiq98l2b325r1s0d3g0n4je15.apps.googleusercontent.com",
        "aud": "145775279537-ibs1ge9aiq98l2b325r1s0d3g0n4je15.apps.googleusercontent.com",
        "sub": "107154271921615923258",
        "email": "pradip95273@gmail.com",
        "email_verified": True,
        "at_hash": "d5K9WKX0DdotNiyiN4W7Iw",
        "nonce": "C2UNe0Ujg6kw0mZRFlAl",
        "name": "192 Madhur Dandev",
        "picture": "https://lh3.googleusercontent.com/a/AAcHTtctg_ygt-P_Bz2FQAjPkYeps_EgmRE1vmrSp2OL=s96-c",
        "given_name": "192 Madhur",
        "family_name": "Dandev",
        "locale": "en-GB",
        "iat": 1686212380,
        "exp": 1686215980,
    },
}

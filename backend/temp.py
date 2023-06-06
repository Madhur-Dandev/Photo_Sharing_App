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

from flask import Flask
from markupsafe import escape

app = Flask(__name__)

@app.route('/')
def home():
    return "<h1> Hello, World! </h1>"


@app.route('/user/<name>')
def user(name):
    return f"<h1> Hello, {escape(name)}! </h1>"


@app.route('/this/')
def this():
    return "<h1> This is a page </h1>"

if __name__ == '__main__':
    app.run()
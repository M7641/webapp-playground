from flask import Flask, render_template, request, jsonify, redirect, url_for
from markupsafe import escape

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/takeAPayload', methods=['POST'])
def takeAPayload():
    return redirect(url_for('user', name=request.json['name']))


@app.route('/user/<name>', methods=['GET'])
def user(name):
    return f"<h1> Hello, {escape(name)}! </h1>"

if __name__ == '__main__':
    app.run()
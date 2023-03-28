from flask import *

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("home.html")

@app.route('/fracs')
def fracs():
    return render_template("fracs.html")

if __name__ == "__main__":
    app.run(port=5005)
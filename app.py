from flask import *

app = Flask(__name__)

@app.route('/')
def editor():
    return render_template("home.html")

if __name__ == "__main__":
    app.run(port=5000)
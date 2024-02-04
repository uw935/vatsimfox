from flask import Flask, render_template, abort
import requests


app = Flask(__name__)


@app.route("/")
def index_page():
    return render_template("index.html")


@app.errorhandler(404)
def errorhandler_page(_):
    return render_template("4O4.html"), 404


@app.route("/<int:cid>/")
def viewer_page(cid):
    user = requests.get(f"https://api.vatsim.net/v2/members/{cid}").json()

    if "detail" in user and user["detail"] == "Not Found":
        return abort(404)

    return render_template("viewer.html", data=(user, ))


if __name__ == "__main__":
    app.run(debug=True)

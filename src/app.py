import requests
from flask import Flask, render_template, abort, request, jsonify


app = Flask(__name__)
VATSIM_API_URL = "https://api.vatsim.net/v2/"


@app.route("/")
def index_page():
    return render_template("index.html")


@app.errorhandler(404)
def errorhandler_page(_):
    return render_template("4O4.html"), 404


@app.route("/api/request")
def request_handler():
    if request_string := request.args.get("request_string"):
        try:
            return requests.get(f"{VATSIM_API_URL}{request_string}").json()
        except requests.exceptions.JSONDecodeError:
            return jsonify({"result": "error", "message": "Something went wrong. Report that error please"})

    return jsonify({"result": "not found", "message": "Not found"})


@app.route("/<int:cid>/")
def viewer_page(cid):
    user = requests.get(f"{VATSIM_API_URL}members/{cid}").json()

    if "detail" in user and user["detail"] == "Not Found":
        return abort(404)

    return render_template("viewer.html", user=user)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)

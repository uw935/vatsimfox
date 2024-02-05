from flask import Flask, render_template, abort, request, jsonify
import requests


app = Flask(__name__)
VATSIM_API_URL = "https://api.vatsim.net/v2/"


@app.route("/")
def index_page():
    return render_template("index.html")


@app.errorhandler(404)
def errorhandler_page(_):
    return render_template("4O4.html"), 404

# Custom wrapper to fetch VATSIM data
@app.route("/api/request")
def request_handler():
    request_string = request.args.get("request_string")

    if request_string:
        return requests.get(f"{VATSIM_API_URL}{request_string}").json()
    
    return jsonify({"result": "not found"})


@app.route("/<int:cid>/")
def viewer_page(cid):
    user = requests.get(f"{VATSIM_API_URL}members/{cid}").json()

    if "detail" in user and user["detail"] == "Not Found":
        return abort(404)

    return render_template("viewer.html", data=(user, ))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)

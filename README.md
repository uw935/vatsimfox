<br>
<p align="center">
    <img align="center" src="media/cover.png">
    <h3 align="center">VATSIM Fox — v1.2</h3>
    <p align="center">Website to find out your detailed VATSIM stastic</p>
</p>
<br>

## About
**VATSIM Fox** — helps you to view profile stastic easily. Here you can see your last 50 flightplans / 100 ATC shifts.

Project based on [Virtual Air Traffic Simulation Network (VATSIM) API](https://vatsim.dev/).

Written in Python 3.8.18 + JS (JQuery framework) + Boostrap

## Startup
For run application on your own machine, you must install docker. Then just one command in the "src" folder with the project source code:

```bash
docker compose up
```

## Contibution
Any help with this project would be greatly appreciated. Fixes or some features are welcome.

VATSIM Fox is free software, open to suggestions and contributions. All the files are under the MIT License.

### How to set virtual environment

```bash
# you must be in "src" folder before init
cd src

python -m venv venv
.\venv\Scripts\activate

# downloading requirements && upgrading pip
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
# starting application
python -m flask run --host 0.0.0.0 --debug
```

## Feature
There is small TODO list I would like to make in this project:

- [x] Create docker
- [x] Deploy to webserver with domain
- [ ] Change viewer style to the map, where user could see his airports where he was as a pilot or an ATC.
- [ ] More ATC information — add map with control area
- [ ] More profile information — add some more info, not only date of registration. Maybe rating or something
- [ ] Website redesign
- [ ] Challenges, like: "fly to this country N times", or "fly to all countries around the world", etc

## Contributors
https://github.com/exituser/

## Author contacts
Telegram: https://uw935.t.me/<br>
Instagram: https://instagram.com/uw_935/<br>
Discord: uw935
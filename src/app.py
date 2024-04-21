import uvicorn
import requests

from fastapi import (
    FastAPI,
    Request,
    HTTPException,
)
from fastapi.responses import FileResponse
from starlette.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


VATSIM_API_URL = "https://api.vatsim.net/v2/"

app = FastAPI(
    title="VATSIM Fox",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
    redirect_slashes=True
)
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def get_index_page(request: Request):
    """
    Index page

    :param request: FastAPI request
    :return: HTML template
    """

    return templates.TemplateResponse(
        name="index.html",
        context={
            "request": request,
        }
    )


@app.get("/favicon.ico", include_in_schema=False)
async def get_favicon():
    """
    Get favicon

    :return: Icon file
    """

    return FileResponse("./static/icon.ico")


@app.get("/{cid}/")
async def get_viewer_page(request: Request, cid: str = None):
    """
    Viewer page

    :param request: FastAPI request
    :param cid: User CID
    :return: HTML template
    """
    try:
        user = requests.get(f"{VATSIM_API_URL}members/{cid}").json()
    except requests.exceptions.JSONDecodeError:
        raise HTTPException(404)

    if "detail" in user and user["detail"] == "Not Found":
        raise HTTPException(404)

    return templates.TemplateResponse(
        name="viewer.html",
        context={
            "user": user,
            "request": request,
        }
    )


@app.exception_handler(404)
async def error_handler(request: Request, _):
    """
    Handler to the 404 HTTP error

    :param request: FastAPI request
    :return: HTML template
    """

    return templates.TemplateResponse(
        name="4O4.html",
        context={
            "request": request,
        }
    )


@app.get("/api/request")
def request_handler(request_string: str):
    """
    Wrapper to the VATSIM API functions

    :param request_string: String that will fetched from VATSIM API
    """

    if request_string:
        try:
            return requests.get(f"{VATSIM_API_URL}{request_string}").json()
        except requests.exceptions.JSONDecodeError:
            return {"result": "error", "message": "Something went wrong. Report that error please"}

    return {"result": "not found", "message": "Not found"}


if __name__ == "__main__":
    uvicorn.run(app=app, host="0.0.0.0", port=80)

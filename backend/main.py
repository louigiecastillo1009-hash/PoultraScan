import os

from dotenv import load_dotenv
load_dotenv()

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from database.migrations_runner import ensure_migrated

from routes.user_route import router as user_router
from routes.auth_route import router as auth_router
from routes.scan_summary_route import router as scan_summary_router
from routes.scan_session_route import router as scan_session_router
from routes.notification_route import router as notification_router
from routes.farm_route import router as farm_router
from routes.activity_log_route import router as activity_log_router
from routes.ai_prediction_route import router as ai_prediction_router
from routes.chicken_image_route import router as chicken_image_router

from routes.detection_route import router as detection_router
from routes.journal_entry_route import router as journal_entry_router
from routes.feedback_route import router as feedback_router
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Apply any pending Alembic migrations before the API starts serving,
    # so newly added models always have their tables in the database.
    ensure_migrated()
    yield


app = FastAPI(lifespan=lifespan)

_origins_env = os.getenv("ALLOWED_ORIGINS")
allow_origins = [o.strip() for o in _origins_env.split(",") if o.strip()] if _origins_env else ["http://localhost:5173"]

# Local development origins must ALWAYS be reachable from the dev server.
# Without them, a locally-running frontend (http://localhost:5173) fails its
# CORS preflight once ALLOWED_ORIGINS is set for the production URL.
LOCAL_DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
for origin in LOCAL_DEV_ORIGINS:
    if origin not in allow_origins:
        allow_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,  # comma-separated in ALLOWED_ORIGINS, defaults to localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.mount("/static", StaticFiles(directory="static"), name="static")


app.include_router(auth_router)
app.include_router(user_router)
app.include_router(scan_summary_router)
app.include_router(scan_session_router)
app.include_router(notification_router)
app.include_router(farm_router)
app.include_router(activity_log_router)
app.include_router(ai_prediction_router)
app.include_router(chicken_image_router)
app.include_router(detection_router)
app.include_router(journal_entry_router)
app.include_router(feedback_router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


@app.exception_handler(Exception)
async def unhandled_exception_handler(request, exc):
    """
    FastAPI strips CORS headers from responses produced by unhandled
    exceptions, so the browser sees a CORS 'error' instead of the real
    500. Turning every unhandled exception into a plain JSON 500 keeps
    the CORS headers (added by CORSMiddleware) in the response so the
    frontend can read the actual status code.
    """
    import logging
    import traceback

    logging.getLogger("uvicorn.error").error(
        f"Unhandled error on {request.method} {request.url.path}:\n"
        f"{traceback.format_exception(type(exc), exc, exc.__traceback__)}"
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again."},
    )
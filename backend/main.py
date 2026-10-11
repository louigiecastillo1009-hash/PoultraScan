import os

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

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

app = FastAPI()

_origins_env = os.getenv("ALLOWED_ORIGINS")
allow_origins = [o.strip() for o in _origins_env.split(",") if o.strip()] if _origins_env else ["http://localhost:5173"]

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
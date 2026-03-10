from fastapi import APIRouter

from app.schemas import MoodCreate
from app.services.mood_service import save_mood

router = APIRouter()


@router.post("/")
def save_mood_endpoint(payload: MoodCreate):
    return save_mood(payload)
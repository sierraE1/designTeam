from fastapi import APIRouter
from app.schemas import MoodCreate, MoodResponse
from app.services.mood_service import save_mood

router = APIRouter()


@router.post("/", response_model=MoodResponse)
def save_mood_endpoint(payload: MoodCreate):
    return save_mood(payload)
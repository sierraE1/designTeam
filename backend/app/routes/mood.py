from fastapi import APIRouter, status
from app.schemas import MoodCreate, MoodResponse
from app.services.mood_service import create_mood, list_moods

router = APIRouter(
    # prefix="/mood",
    tags=["mood"]
)

@router.post("/", response_model=MoodResponse, status_code=status.HTTP_201_CREATED)
def create_mood_endpoint(payload: MoodCreate):
    return create_mood(payload)

@router.get("/", response_model=list[MoodResponse])
def get_moods():
    return list_moods()
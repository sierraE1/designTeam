from fastapi import APIRouter, status
from app.schemas import MoodCreate, MoodResponse

router = APIRouter(
    # prefix="/mood",
    tags=["mood"]
)

# Temporary in-memory storage
moods_db = []

@router.post("/", response_model=MoodResponse, status_code=status.HTTP_201_CREATED)
def create_mood_endpoint(payload: MoodCreate):
    new_id = len(moods_db) + 1
    mood = {
        "id": new_id,
        "user_id": payload.user_id,
        "value": payload.value
    }
    moods_db.append(mood)
    return mood

@router.get("/", response_model=list[MoodResponse])
def get_moods():
    return moods_db
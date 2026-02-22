from fastapi import APIRouter

from app.schemas import MoodCreate

router = APIRouter()


@router.post("/")
def save_mood(payload: MoodCreate) -> dict[str, str]:
	return {"message": f"Mood '{payload.value}' saved"}

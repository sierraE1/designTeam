from app.schemas import MoodCreate


def save_mood(payload: MoodCreate) -> dict[str, str]:
    return {"message": f"Mood '{payload.value}' saved"}
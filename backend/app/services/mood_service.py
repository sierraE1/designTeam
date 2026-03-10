from app.schemas import MoodCreate


def save_mood(payload: MoodCreate) -> dict[str, str]:
    # For now this just returns a confirmation
    # Later this could save to the database
    return {"message": f"Mood '{payload.value}' saved"}
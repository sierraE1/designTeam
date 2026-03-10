from app.schemas import MoodCreate, MoodResponse
from app.models import Mood
from app.database import get_database_url


def get_db():
    db = get_database_url()
    try:
        yield db
    finally:
        db.close()


def create_mood(payload: MoodCreate) -> MoodResponse:
    db = next(get_db())

    new_mood = Mood(
        user_id=payload.user_id,
        value=payload.value
    )

    db.add(new_mood)
    db.commit()
    db.refresh(new_mood)

    return MoodResponse(
        id=new_mood.id,
        user_id=new_mood.user_id,
        value=new_mood.value
    )
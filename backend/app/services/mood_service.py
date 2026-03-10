from app.schemas import MoodCreate
from app.models import Mood

moods = []
next_id = 1


def save_mood(payload: MoodCreate) -> Mood:
    global next_id

    mood = Mood(
        id=next_id,
        user_id=payload.user_id,
        value=payload.value
    )

    moods.append(mood)
    next_id += 1

    return mood
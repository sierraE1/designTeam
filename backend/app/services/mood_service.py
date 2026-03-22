from app.schemas import MoodCreate, MoodResponse
from app.database import get_database_connection

def create_mood(payload: MoodCreate) -> MoodResponse:
    conn = get_database_connection()
    cur = conn.cursor()

    # Insert the mood and get the new ID
    cur.execute(
        "INSERT INTO moods (user_id, value) VALUES (%s, %s) RETURNING id;",
        (payload.user_id, payload.value)
    )
    mood_id = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return MoodResponse(
        id=mood_id,
        user_id=payload.user_id,
        value=payload.value
    )
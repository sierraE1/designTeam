from app.schemas import MoodCreate, MoodResponse
from app.database import get_database_connection

def create_mood(payload: MoodCreate) -> MoodResponse:
    conn = get_database_connection()
    cur = conn.cursor()

    # Insert the mood and get the new ID
    cur.execute(
        "INSERT INTO moods (user_id, mood) VALUES (%s, %s) RETURNING id;",
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

#Added this to list moods!
def list_moods() -> list[MoodResponse]:
    conn = get_database_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, user_id, mood FROM moods ORDER BY id DESC;"
    )
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        MoodResponse(id=row[0], user_id=row[1], value=row[2])
        for row in rows
    ]
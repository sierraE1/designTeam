import sqlite3
from app.schemas import NoteCreate, NoteResponse

DB_PATH = "notes.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)")
    return conn

def create_note(payload: NoteCreate) -> NoteResponse:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO notes (content) VALUES (?)", (payload.content,))
    new_id = cursor.lastrowid

    conn.commit()
    cursor.close()
    conn.close()

    return NoteResponse(id=new_id, content=payload.content)

def get_all_notes() -> list[NoteResponse]:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, content FROM notes")
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return [NoteResponse(id=row[0], content=row[1]) for row in rows]
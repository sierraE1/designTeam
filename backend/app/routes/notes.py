from fastapi import APIRouter, status
from app.schemas import NoteCreate, NoteResponse

router = APIRouter(
    # prefix="/notes",
    tags=["notes"]
)

notes_db = []  # temporary in-memory storage

@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(payload: NoteCreate):
    new_note = {
        "id": len(notes_db) + 1,
        "content": payload.content
    }
    notes_db.append(new_note)
    return new_note

@router.get("/", response_model=list[NoteResponse])
def get_notes():
    return notes_db
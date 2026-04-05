from fastapi import APIRouter, status
from app.schemas import NoteCreate, NoteResponse
from app.services.notes_service import create_note, get_all_notes

router = APIRouter(
    tags=["notes"]
)

@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note_endpoint(payload: NoteCreate):
    return create_note(payload)


@router.get("/", response_model=list[NoteResponse])
def get_notes():
    return get_all_notes()
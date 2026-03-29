from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_subtasks_service import generate_subtasks

router = APIRouter(tags=["AI"])

class SubtaskRequest(BaseModel):
    task_name: str
    task_notes: str = ""

@router.post("/generate-subtasks")
def generate_subtasks_endpoint(req: SubtaskRequest):
    return {"subtasks": generate_subtasks(req.task_name, req.task_notes)}
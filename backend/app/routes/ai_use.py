from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_subtasks_service import generate_subtasks, generate_focus_hint

router = APIRouter(tags=["AI"])

class SubtaskRequest(BaseModel):
    task_name: str
    task_notes: str = ""


class FocusHintRequest(BaseModel):
    task_name: str
    task_notes: str = ""

@router.post("/generate_subtasks")
def generate_subtasks_endpoint(req: SubtaskRequest):
    try:
        return generate_subtasks(req.task_name, req.task_notes)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Failed to generate subtasks: {exc}") from exc


@router.post("/task_focus_hint")
def task_focus_hint_endpoint(req: FocusHintRequest):
    try:
        return generate_focus_hint(req.task_name, req.task_notes)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Failed to generate focus hint: {exc}") from exc
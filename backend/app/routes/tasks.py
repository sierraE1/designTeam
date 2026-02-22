from fastapi import APIRouter

from app.schemas import TaskCreate, TaskResponse

router = APIRouter()


@router.get("/", response_model=list[TaskResponse])
def list_tasks() -> list[TaskResponse]:
	return []


@router.post("/", response_model=TaskResponse)
def create_task(payload: TaskCreate) -> TaskResponse:
	return TaskResponse(id=1, title=payload.title, description=payload.description)

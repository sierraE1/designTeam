from fastapi import APIRouter

from app.schemas import TaskCreate, TaskResponse
from app.services.tasks_service import create_task, update_task, delete_task

router = APIRouter(
	prefix="/tasks", #Every endpoint in this router will start with /tasks
	tags=["tasks"] #This is for documentation stuff from what i gather but tbh idk
)

#just a stub
@router.get("/", response_model=list[TaskResponse])
def list_tasks() -> list[TaskResponse]:
	return []

#Create
@router.post("/", response_model=TaskResponse)
#The user_id is just a temp for now since we dont have auth
def create_task_endpoint(payload: TaskCreate, user_id: int = 1):
	return create_task(user_id, payload)

#Update
@router.put("/{task_id}", response_model=TaskResponse)
def update_task_endpoint(task_id: int, payload: TaskCreate, user_id: int = 1):
	return update_task(user_id, task_id, payload)

#Delete
@router.delete("/{task_id}")
def delete_task_endpoint(task_id: int, user_id: int = 1):
	return delete_task(user_id, task_id)
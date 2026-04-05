from fastapi import APIRouter, HTTPException

from app.schemas import TaskCreate, TaskResponse
from app.services.tasks_service import (
    create_task,
    update_task,
    delete_task,
    list_tasks_for_user,
    get_task_by_id,
    get_today_tasks_service,
)

router = APIRouter(tags=["tasks"])

USER_ID_DEFAULT = 1


@router.get("/", response_model=list[TaskResponse])
def list_tasks(user_id: int = USER_ID_DEFAULT) -> list[TaskResponse]:
    return list_tasks_for_user(user_id)


@router.post("/", response_model=TaskResponse)
def create_task_endpoint(payload: TaskCreate, user_id: int = USER_ID_DEFAULT):
    return create_task(user_id, payload)


# Static path must be registered before /{task_id} so "today" is not parsed as an id.
@router.get("/today")
def get_today_tasks(user_id: int = USER_ID_DEFAULT):
    return get_today_tasks_service(user_id)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task_endpoint(task_id: int, user_id: int = USER_ID_DEFAULT):
    task = get_task_by_id(user_id, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task_endpoint(task_id: int, payload: TaskCreate, user_id: int = USER_ID_DEFAULT):
    try:
        return update_task(user_id, task_id, payload)
    except Exception as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.delete("/{task_id}")
def delete_task_endpoint(task_id: int, user_id: int = USER_ID_DEFAULT):
    try:
        delete_task(user_id, task_id)
        return {"ok": True}
    except Exception as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

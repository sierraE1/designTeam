from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.mood import router as mood_router
from app.routes.tasks import router as tasks_router

app = FastAPI(title="Design Team API")

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(tasks_router, prefix="/tasks", tags=["tasks"])
app.include_router(mood_router, prefix="/mood", tags=["mood"])


@app.get("/health")
def health_check() -> dict[str, str]:
	return {"status": "ok"}

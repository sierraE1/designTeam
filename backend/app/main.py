from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.mood import router as mood_router
from app.routes.tasks import router as tasks_router
from app.routes.notes import router as notes_router
from app.routes.ai_use import router as ai_router
from app.database import get_database_connection
from dotenv import load_dotenv
load_dotenv() #Load environment variables from .env file

app = FastAPI(title="Design Team API")

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(tasks_router, prefix="/tasks", tags=["tasks"])
app.include_router(mood_router, prefix="/mood", tags=["mood"])
app.include_router(notes_router, prefix="/notes", tags=["notes"])
app.include_router(ai_router, prefix="/ai", tags=["AI"])


@app.get("/health")
def health_check() -> dict[str, str]:
	return {"status": "ok"}

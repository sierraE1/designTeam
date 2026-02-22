from fastapi import APIRouter

from app.schemas import LoginRequest, SignupRequest

router = APIRouter()


@router.post("/signup")
def signup(payload: SignupRequest) -> dict[str, str]:
	return {"message": f"User {payload.email} signed up"}


@router.post("/login")
def login(payload: LoginRequest) -> dict[str, str]:
	return {"message": f"User {payload.email} logged in"}

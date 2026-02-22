from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
	email: EmailStr
	password: str


class LoginRequest(BaseModel):
	email: EmailStr
	password: str


class TaskCreate(BaseModel):
	title: str
	description: str | None = None


class TaskResponse(BaseModel):
	id: int
	title: str
	description: str | None = None


class MoodCreate(BaseModel):
	value: str

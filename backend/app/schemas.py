from pydantic import BaseModel, EmailStr

class SignupRequest(BaseModel):
	email: EmailStr
	password: str


class LoginRequest(BaseModel):
	email: EmailStr
	password: str

#This is what the frontend sends to the backend when creating a task
class TaskCreate(BaseModel):
	title: str
	description: str | None = None

#This is whta the frontend sends when updating a task
class TaskUpdate(BaseModel):
	title: str
	description: str | None = None

#This is what the backend sends to the frontend
class TaskResponse(BaseModel):
	id: int
	title: str
	description: str | None = None


class MoodCreate(BaseModel):
	user_id: int
	value: str

class MoodResponse(BaseModel):
    id: int
    user_id: int
    value: str

class NoteCreate(BaseModel):
    content: str

class NoteResponse(BaseModel):
    id: int
    content: str
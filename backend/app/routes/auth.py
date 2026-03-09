from fastapi import APIRouter

from app.schemas import LoginRequest, SignupRequest

from app.database import get_database_connection

from app.authentification import create_access_token, create_password, verify_password

router = APIRouter()




@router.post("/signup")
def signup(payload: SignupRequest) -> dict[str, str]:
    email = payload.email
    with get_database_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id FROM users WHERE email = %s",
                (email,)
            )
            existing_user = cur.fetchone()
            if existing_user:
                return {"message": "User already exists"}
            hashed_password = create_password(payload.password)
            cur.execute(
                "INSERT INTO users (email, password) VALUES (%s, %s)",
                (email, hashed_password)
            )
        conn.commit()
    return {"message": f"User {payload.email} signed up"}


@router.post("/login")
def login(payload: LoginRequest) -> dict[str, str]:
    email = payload.email
    with get_database_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT password FROM users WHERE email = %s",
                (email,)
            )
            user = cur.fetchone()
    if not user:
        return {"message": "User does not exist"}
    hashed_password = user[0]
    if not verify_password(payload.password, hashed_password):
        return {"message": "Incorrect password"}
    token = create_access_token({"sub": email})
    return {"token": token, "message": f"User {payload.email} logged in"}
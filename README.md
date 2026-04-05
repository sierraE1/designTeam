# Dopaminder
WICSE Spring Design Team 2026!

## Project Structure

```text
designTeam/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── node_modules/
│   └── package.json
└── README.md
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- Docker Desktop (for containerized PostgreSQL)

## Database Setup (Docker PostgreSQL)

From the repo root, start PostgreSQL in Docker:

```powershell
docker compose up -d db
```

If you already started the DB before this setup, reset once so the init script runs:

```powershell
docker compose down -v
docker compose up -d db
```

Check container status:

```powershell
docker compose ps
docker compose logs -f db
```

Schema bootstrap runs automatically from `db/init.sql` on first container startup.

The backend reads DB values from `backend/.env`.
Included defaults are already set for this Docker service:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adhd_app
DB_USER=adhd_user
DB_PASSWORD=designteam2026
```

To stop the DB container:

```powershell
docker compose down
```

## Backend Setup (FastAPI)

Run from the repo root:

```powershell
cd backend
python -m venv venv
```

Activate venv (PowerShell):

```powershell
.\venv\Scripts\Activate.ps1
```

Install Python dependencies:

```powershell
pip install -r requirements.txt
```

Run backend server:

```powershell
uvicorn app.main:app --reload
```

If your venv is located at the repo root (`.venv`), you can run:

```powershell
cd backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Backend URLs:

- API base: http://127.0.0.1:8000
- Health check: http://127.0.0.1:8000/health

## Frontend Setup (React)

Open a new terminal from repo root:

```powershell
cd frontend
npm install
```

Run frontend dev server:

```powershell
npm start
```

Frontend URL:

- App: http://localhost:3000

## One-Command Startup (Windows)

From the repo root, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```

This script:

- starts Docker PostgreSQL (`db` service)
- waits for DB health
- opens a backend terminal (`uvicorn` with reload)
- opens a frontend terminal (`npm start`)

## One-Time Installs Summary

If you just want all install commands in one place:

```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Frontend (in a separate terminal)
cd frontend
npm install
```
## To access the PostGreSQL database
Open pgAdmin → Click Add New Server

General Tab → Name: “adhd_app”

Connection Tab → Fill in:

Host name/address: 192.168.56.1

Port: 5432 (default)

Maintenance database: postgres

Username: adhd_user

Password: designteam2026

Check Save password

Click Save → server appears in pgAdmin


## Details about the database (important for backend!)

Table: moods
Columns: 
- id SERIAL PRIMARY KEY (auto)
- user_id INTEGER NOT NULL (FK → users.id)
- mood VARCHAR(50) NOT NULL
- created_at TIMESTAMP DEFAULT now()
Notes:
- id and created_at are auto generated
- user_id must reference existing users.id

Table: users
Columns:
- id SERIAL PRIMARY KEY (auto)
- username VARCHAR(50) NOT NULL UNIQUE
- email VARCHAR(100) NOT NULL UNIQUE
- password_hash VARCHAR(255) NOT NULL
- created_at TIMESTAMP DEFAULT now()
Notes:
- id and created_at are auto generated
- username and email must be unique
- passwords are hashes
- this is a parent table

Table: tasks
Columns:
- id SERIAL PRIMARY KEY (auto)
- user_id INTEGER NOT NULL (FK → users.id)
- title VARCHAR(100) NOT NULL
- description TEXT (optional)
- due_date DATE (optional)
- completed BOOLEAN DEFAULT false
- created_at TIMESTAMP DEFAULT now()
Notes:
- id and created_at are auto-generated
- completed defaults to false
- user_id must reference an existing user
- every task belongs to a user

Table: rewards
Columns:
- id SERIAL PRIMARY KEY (auto)
- user_id INTEGER (FK → users.id)
- reward_name VARCHAR(50)
- unlocked_at TIMESTAMP DEFAULT now()
Notes:
- id and unlocked_at auto-generated
- reward may optionally belong to a user
- if user_id is provided, it must reference users.id
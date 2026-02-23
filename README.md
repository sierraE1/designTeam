# designTeam
WISCE Spring Design Team 2026!

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
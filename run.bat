@echo off
echo Starting Backend (FastAPI)...
start "Backend Server" cmd /k "cd /d E:\EDA_Project\backend && set PYTHONPATH=E:\EDA_Project\backend && E:\EDA_Project\EDA_Project_Venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"

echo Starting Frontend (Vite React)...
cd /d E:\EDA_Project\frontend
npm run dev

# Start Backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd E:\EDA_Project\backend; $env:PYTHONPATH='E:\EDA_Project\backend'; E:\EDA_Project\EDA_Project_Venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"

# Start Frontend in current window
cd E:\EDA_Project\frontend
npm run dev

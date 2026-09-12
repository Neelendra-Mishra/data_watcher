# Autonomous Data Watcher

An intelligent, full-stack exploratory data analysis (EDA) and anomaly detection platform that scans business spreadsheets (CSV / Excel) for unexpected changes, spikes, and drops using statistical Z-score models and dynamic time-series visualizations.

---

## 🌟 Key Features

- **Automated Anomaly Detection**: Calculates rolling baselines (7-day window) and dynamic Z-scores to catch statistically significant shifts without manual thresholding.
- **Guided Setup**: Automatic date column detection, metric selection, and customizable detection sensitivity slider ($Z \ge 2.0$ recommended).
- **Incident Categorization**: Automatically categorizes outliers (`SPIKE HIGH`, `DROP LOW`) with observed vs. previous values and percentage changes.
- **Interactive Visualizations**: Clean Mediterranean-styled Area charts, Bar charts, and Combo charts highlighting anomalies in pulsing red markers.
- **Executive Summary Generation**: Plain-English narrative summaries providing non-technical context on discovered patterns.
- **Instant Demo**: Built-in sample dataset (`car_sales.csv`) ready to test in one click.

---

## 🏗️ Architecture

```text
EDA_Project/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # API router and endpoints (/upload, /analyze)
│   │   ├── services/         # Analytics engine & Executive summary generator
│   │   └── main.py           # FastAPI entrypoint
│   ├── tests/                # Automated pytest suites
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React + Vite Application
│   ├── src/
│   │   ├── components/       # UI Components (Upload, Charts, Tables, Navbar)
│   │   ├── App.jsx           # Master dashboard view
│   │   └── index.css         # Styling
│   └── package.json
├── sample_data/              # Sample spreadsheets (car_sales.csv)
├── docs/                     # User walkthroughs and documentation
├── run.bat                   # Windows batch launcher (runs backend & frontend)
└── run.ps1                   # PowerShell launcher
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
$env:PYTHONPATH='.'
uvicorn app.main:app --reload --port 8000
```
Backend API will be accessible at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Frontend dashboard will be accessible at: `http://localhost:5173/`

### 4. One-Click Launch (Windows)
Double-click `run.bat` or execute in PowerShell:
```powershell
.\run.ps1
```

---

## 🧪 Running Tests

```powershell
cd backend
pytest tests/
```

---

## 📄 Documentation
For an in-depth walkthrough of the algorithms, statistical math, and narrative breakdown, see [docs/user_walkthrough_guide.md](docs/user_walkthrough_guide.md).

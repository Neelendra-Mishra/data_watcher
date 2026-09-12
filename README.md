# Autonomous Data Watcher — Time-Series Anomaly Intelligence
### Comprehensive Technical Architecture, Statistical Engine Design & Operational Guide

---

## 1. Why I Built This Project (Motivation & Problem Statement)

### The Real-World Problem
Every modern business relies heavily on spreadsheets—daily car dealership sales, grocery store inventory logs, manufacturing scrap rates, SaaS customer signups, and financial ledgers. However, the way organizations monitor this operational data is fundamentally broken:

1. **Manual Inspection Fatigue:** Store managers, supply chain operators, and financial analysts routinely scan through hundreds of rows in Microsoft Excel or Google Sheets. When human eyes review columns of numbers daily, subtle anomalies and emerging crisis patterns go unnoticed until significant financial losses occur.
2. **Static Thresholds Cause False Alarm Fatigue:** Traditional dashboards rely on arbitrary hardcoded alarms (e.g., *"alert if daily revenue drops below $100,000"*). These static rules fail because business numbers naturally fluctuate due to seasonality, weekday vs. weekend patterns, and promotional campaigns. A drop to $100,000 might be an emergency on a busy Saturday, but completely normal on a quiet Tuesday.
3. **Complex Machine Learning Models Lack Explainability:** While advanced deep learning models (such as LSTMs or Prophet) can detect anomalies, they operate as black boxes. When an executive or dealership general manager asks, *"Why did the system flag August 9th?"*, an ML model cannot provide a clear, intuitive explanation. Non-technical decision-makers need plain-English business narratives, not raw loss values or p-values.
4. **Data Privacy and Storage Vulnerabilities:** Many third-party analytics platforms require uploading sensitive financial spreadsheets to external cloud databases, creating compliance headaches and data privacy liabilities.

### The Vision Behind Data Watcher
I built the **Autonomous Data Watcher** to engineer a lightweight, transparent, privacy-first, full-stack analytical platform that turns raw operational spreadsheets into instant visual answers and plain-English executive briefings in milliseconds:

- **Zero-Storage, Privacy-First Architecture:** Files are processed entirely in memory via byte streams (`io.BytesIO`). No user dataset is stored on disk or written to a persistent database.
- **Dynamic Statistical Baselines:** Instead of rigid thresholds, the engine computes rolling 7-day baselines ($\mu$) and standard deviation "wobble rulers" ($\sigma$). It measures today's value against the metric's own recent behavioral stability.
- **Explainable Anomaly Identification:** Calculates dynamic Z-scores to pinpoint extreme outliers ($|Z| \ge 2.0$), categorizing events as `SPIKE HIGH` or `DROP LOW` with observed values, benchmarks, and percentage changes.
- **Automated Plain-English Narrative Generation:** Translates complex mathematical variance into clear, boardroom-ready briefings that explain exactly what happened and why it matters.
- **Interactive Visual System:** Automatically pairs metric types with specialized data visualizations (Area charts for financial flow, Bar charts for discrete counts, Combo charts for unit tracking) adorned with pulsing anomaly dot markers.

---

## 2. What We've Built and Why (Current Project Overview)

The Autonomous Data Watcher is an end-to-end analytical intelligence application composed of:

1. **High-Performance FastAPI Backend:** An asynchronous REST API built with FastAPI, Pandas, and NumPy for streaming in-memory spreadsheet parsing, chronological date sanitization, dynamic rolling Z-score computation, and executive summary narrative assembly.
2. **Statistical Anomaly Engine:** A statistical calculation layer that handles cold-start expanding windows, division-by-zero variances, period-over-period percentage shifts, and user-tuned sensitivity thresholds ($Z \in [1.0, 4.0]$).
3. **Executive Briefing Generator:** A deterministic natural language synthesis engine that builds high-level executive summaries and per-metric diagnostic narratives.
4. **Modern React 19 Frontend:** Built on Vite and Tailwind CSS, featuring an earthy Mediterranean Calm aesthetic (warm cream `#F7F4EF`, deep olive `#667035`, terracotta `#C2856A`, and sage garden `#9BA084`), smart date-column heuristics, interactive sensitivity sliders, Recharts time-series visualizations, and an in-depth "How It Works" educational console.

```
+-----------------------------------------------------------------------------------+
|                        USER DATASET (CSV or XLSX SPREADSHEET)                     |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                     STEP 1: FASTAPI FILE STREAM & PREVIEW                         |
|   - Endpoint: POST /api/upload                                                    |
|   - Parses byte buffer in-memory with Pandas (pd.read_csv / pd.read_excel)        |
|   - Extracts column headers, row counts, and first 5 sample preview records       |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                  STEP 2: SMART SCHEMA DETECTION & CONFIGURATION                   |
|   - Client identifies candidate date/timestamp headers (excludes numeric terms)   |
|   - User selects timeline anchor, target metric columns, and sensitivity (Z)     |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                  STEP 3: CORE STATISTICAL ANALYTICS ENGINE                        |
|   - Endpoint: POST /api/analyze                                                   |
|   - Chronological date coercion and sorting                                       |
|   - Period-over-period % delta: ((Current - Prev) / |Prev|) * 100                 |
|   - 7-day rolling window baseline mean (mu) & rolling standard deviation (sigma)  |
|   - Cold-start expanding window fallback for initial operating periods            |
|   - Statistical surprise calculation: Z = (Value - mu) / sigma                    |
|   - Anomaly filtering: |Z| >= Threshold (Flagged as SPIKE_HIGH or DROP_LOW)       |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                  STEP 4: EXECUTIVE SUMMARY & NARRATIVE GENERATOR                  |
|   - Synthesizes findings into plain-English management briefings                  |
|   - Formulates overall executive health and individual metric diagnostics         |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                  STEP 5: REACT DASHBOARD & DYNAMIC VISUALIZATION                  |
|   - Executive Summary Banner (Status: Normal vs. Attention Required)              |
|   - Interactive Flagged Incident Table with decision-logic popovers               |
|   - Responsive Recharts Time-Series (Area, Bar, and Combo with pulsing red dots)  |
|   - In-app "How It Works" documentation guide                                     |
+-----------------------------------------------------------------------------------+
```

---

## 3. Contents & File-by-File Technical Breakdown

Here is a comprehensive breakdown of every file and directory in the project and its exact role in the architecture:

| File / Directory | Purpose & Technical Role |
| :--- | :--- |
| **`backend/app/main.py`** | **REST API Entrypoint.** Initializes the FastAPI application, configures CORS middleware for frontend communication (`http://localhost:5173`), mounts the `/api` route prefix, and defines the root `/` health check route. |
| **`backend/app/api/endpoints.py`** | **API Route Handlers.** Defines `/api/upload` (for spreadsheet header discovery and preview) and `/api/analyze` (for executing the statistical pipeline on uploaded byte streams and returning the unified JSON payload). |
| **`backend/app/services/analytics.py`** | **Core Statistical Analytics Engine.** Contains `load_dataset` (handles both CSV and Excel via `pd.read_csv` and `pd.read_excel`) and `run_analysis` (validates date formats, enforces chronological sorting, computes rolling statistics, calculates Z-scores, and identifies anomalies). |
| **`backend/app/services/summary.py`** | **Executive Narrative Generator.** Contains `generate_metric_narrative` and `generate_executive_summary`. Translates numeric Z-scores and percentage changes into boardroom-ready plain-English executive summaries. |
| **`backend/requirements.txt`** | **Python Dependency Manifest.** Specifies dependencies including `fastapi`, `uvicorn`, `pandas`, `openpyxl`, `numpy`, `python-multipart`, and `pydantic`. |
| **`backend/tests/`** | **Automated Backend Test Suites.** Contains `test_analytics.py`, `test_summary.py`, and `test_api.py` for headless verification of the statistical algorithms and REST endpoints. |
| **`frontend/src/App.jsx`** | **Master React Application Canvas.** Manages top-level application state (`activeTab`, `uploadedData`, `analysisPayload`), coordinates the 3-step user workflow, and renders the auto-hiding navbar and scroll-to-top buttons. |
| **`frontend/src/components/Navbar.jsx`** | **Scroll-Aware Header.** Auto-hiding header with glassmorphic blur, tab switching between the interactive Dashboard and the "How It Works" documentation tab. |
| **`frontend/src/components/FileUpload.jsx`** | **File Ingestion Dropzone.** Provides drag-and-drop file upload for `.csv` and `.xlsx` files, error boundary handling, and a one-click sample dataset preset button for `car_sales.csv`. |
| **`frontend/src/components/ColumnMapping.jsx`** | **Interactive Configuration Panel.** Features heuristic date-column detection, metric multi-selection with color badges, the detection sensitivity slider ($Z \in [1.0, 4.0]$), and triggers analysis. |
| **`frontend/src/components/ExecutiveSummaryCard.jsx`** | **Executive Summary Banner.** Displays overall status (`Attention Required` vs `Status: Normal`), row counts, flagged incident tallies, and the plain-English narrative. |
| **`frontend/src/components/AnomalyTable.jsx`** | **Flagged Incident Data Table.** Tabulates anomalous records displaying Metric name, Date, Observed Value, Previous Benchmark, % Change, and Incident Badges with interactive mathematical explanation popovers. |
| **`frontend/src/components/MetricChart.jsx`** | **Time-Series Visualizer.** Built with Recharts. Renders Area, Bar, or Combo charts dynamically paired with metric semantics, showing expected baseline trend lines and glowing red anomaly dot markers. |
| **`frontend/src/components/DocsTab.jsx`** | **Educational Documentation Console.** Provides interactive worked examples from `car_sales.csv`, explaining standard deviation, rolling baselines, and sensitivity tuning in plain business language. |
| **`frontend/src/components/ScrollToTop.jsx`** | **Floating Navigation Button.** Smoothly returns long dashboard views back to the top of the viewport. |
| **`frontend/src/index.css`** | **Design System & Global Styling.** Implements the warm Mediterranean color palette, custom glassmorphism cards (`.clean-card`), and custom styled scrollbars. |
| **`sample_data/car_sales.csv`** | **Reference Operational Dataset.** 30-day realistic dealership dataset (August 1 to August 30, 2026) with revenue surges, inventory shifts, and test-drive spikes for demonstration. |
| **`run.bat` & `run.ps1`** | **One-Click Launchers.** Automated scripts to start the FastAPI Uvicorn backend on port 8000 and the Vite frontend dev server on port 5173 concurrently. |

---

## 4. FastAPI Architecture, Benefits & Comprehensive Endpoint Reference

### Why We Use FastAPI
FastAPI was selected as the backend framework for four fundamental architectural reasons:
1. **Asynchronous Non-Blocking I/O:** Analyzing spreadsheets and parsing multi-megabyte files can block execution in traditional synchronous frameworks (like Flask). FastAPI's asynchronous architecture handles concurrent file uploads smoothly without worker thread starvation.
2. **In-Memory Streaming Validation:** Combined with `python-multipart` and `io.BytesIO`, files uploaded via `UploadFile` are streamed directly into memory. This eliminates temporary file creation on disk, ensuring strict data privacy and rapid processing speeds.
3. **Automatic OpenAPI & Swagger Documentation:** FastAPI automatically generates interactive documentation at `/docs` and `/redoc`, allowing developers to inspect payload schemas and test REST endpoints interactively.
4. **CORS Flexibility:** Built-in middleware allows controlled communication between the Vite frontend (`localhost:5173`) and the backend (`localhost:8000`).

---

### Detailed API Endpoint Breakdown

#### 1. `GET /` — API Health & Diagnostic Root
- **Purpose:** Verifies backend connectivity, version information, and operational status.
- **Request:** None.
- **Response (HTTP 200 JSON):**
  ```json
  {
    "status": "online",
    "service": "Autonomous Data Watcher API",
    "version": "1.0.0",
    "docs_url": "/docs"
  }
  ```

---

#### 2. `POST /api/upload` — Spreadsheet Header Discovery & Preview
- **Purpose:** Ingests a CSV or Excel file, validates its format, extracts column headers, and returns a 5-row sample preview without performing heavy analytics.
- **Request Parameters (Multipart Form-Data):**
  - `file`: `UploadFile` (Binary file stream, restricted to `.csv`, `.xlsx`, `.xls`).
- **Validation Logic:**
  - Case-insensitive extension check: rejects non-spreadsheet files with HTTP 400.
  - Ingests file stream into `io.BytesIO` buffer.
  - Loads data via Pandas (`load_dataset`).
  - Replaces all `NaN` values with empty strings for clean JSON serialization.
- **Success Response (HTTP 200 JSON):**
  ```json
  {
    "filename": "car_sales.csv",
    "total_rows": 30,
    "columns": ["date", "brand", "fuel_type", "units_sold", "revenue", "test_drives"],
    "sample_rows": [
      {
        "date": "2026-08-01",
        "brand": "Honda",
        "fuel_type": "Hybrid",
        "units_sold": 7,
        "revenue": 161700,
        "test_drives": 15
      },
      {
        "date": "2026-08-02",
        "brand": "Hyundai",
        "fuel_type": "Diesel",
        "units_sold": 7,
        "revenue": 158193,
        "test_drives": 13
      }
    ]
  }
  ```
- **Error Response (HTTP 400 JSON):**
  ```json
  {
    "detail": "Invalid file format. Please upload a .csv or .xlsx file."
  }
  ```

---

#### 3. `POST /api/analyze` — Core Statistical Execution & Narrative Assembly
- **Purpose:** Ingests the spreadsheet file along with user column selections and sensitivity threshold, executes the statistical engine, and returns complete time-series coordinates, flagged anomalies, and plain-English narratives.
- **Request Parameters (Multipart Form-Data):**
  - `file`: `UploadFile` (Spreadsheet binary stream).
  - `date_col`: `str` (Name of the timeline column, e.g. `"date"`).
  - `metric_cols`: `str` (Comma-separated string or JSON array of metrics, e.g. `"revenue,units_sold,test_drives"`).
  - `z_threshold`: `float` (Sensitivity multiplier, defaults to `2.0`).
- **Execution Workflow:**
  1. Validates file extension and parses `metric_cols`.
  2. Ensures specified `date_col` and all `metric_cols` exist in the spreadsheet.
  3. Sorts rows chronologically and cleans non-date values.
  4. Computes 7-day rolling averages, rolling standard deviations, percentage changes, and Z-scores.
  5. Flags all observations where $|Z| \ge z\_threshold$.
  6. Passes results to `generate_executive_summary` to compose plain-English narratives.
- **Success Response (HTTP 200 JSON):**
  ```json
  {
    "status": "success",
    "analysis": {
      "file_info": {
        "filename": "car_sales.csv",
        "total_rows": 30,
        "start_date": "2026-08-01",
        "end_date": "2026-08-30"
      },
      "z_threshold": 2.0,
      "total_anomalies": 3,
      "metrics": [
        {
          "metric_name": "revenue",
          "latest_value": 177960.0,
          "previous_value": 85472.0,
          "latest_delta_pct": 108.21,
          "latest_z_score": 1.25,
          "anomaly_count": 1,
          "anomalies": [
            {
              "date": "2026-08-09",
              "metric": "revenue",
              "value": 437000.0,
              "previous_value": 148113.0,
              "delta_pct": 195.04,
              "rolling_mean": 127557.14,
              "rolling_std": 42180.21,
              "z_score": 7.34,
              "type": "SPIKE_HIGH"
            }
          ],
          "time_series": [
            {
              "date": "2026-08-01",
              "value": 161700.0,
              "previous_value": 161700.0,
              "delta_pct": 0.0,
              "rolling_mean": 161700.0,
              "rolling_std": 0.0,
              "z_score": 0.0,
              "is_anomaly": false
            }
          ]
        }
      ]
    },
    "summary": {
      "overall_summary": "NOTICE: 3 unusual event(s) detected in 'car_sales.csv' across: Revenue, Units_sold, Test_drives. These numbers moved far beyond normal day-to-day changes compared to recent history. We recommend reviewing these dates.",
      "alert_required": true,
      "metric_summaries": [
        {
          "metric_name": "revenue",
          "narrative": "WARNING: Revenue jumped sharply on 2026-08-09 to 437,000 (+195.0% change), which is way higher than what's normal for this metric recently. Please check for operational issues or input errors during this period.",
          "has_anomaly": true,
          "anomaly_count": 1
        }
      ]
    }
  }
  ```

---

## 5. Core Analytics Engine & Statistical Detection Model

The intelligence of Data Watcher lies in how it computes variance dynamically rather than relying on brittle, fixed thresholds.

### 5.1 Date Sanitization & Chronological Sorting
Real-world spreadsheets are frequently exported out of order or contain missing dates. The engine handles this via:
1. Converting the designated date column using `pd.to_datetime(df[date_col], errors="coerce")`.
2. Guarding against numeric-only columns being mistakenly selected as dates.
3. Checking for Unix epoch fallbacks (`1970-01-01`).
4. Dropping unparseable rows and performing an ascending chronological sort:
   ```python
   df = df.dropna(subset=[date_col]).sort_values(by=date_col).reset_index(drop=True)
   ```

---

### 5.2 Period-over-Period Percentage Change
For every metric $V$, the period-over-period percentage shift measures day-to-day momentum:
$$\Delta\%_t = \begin{cases} \left(\frac{V_t - V_{t-1}}{|V_{t-1}|}\right) \times 100 & \text{if } V_{t-1} \neq 0 \\ 0.0 & \text{if } V_{t-1} = 0 \text{ or } t = 0 \end{cases}$$

---

### 5.3 Rolling Window Baseline & Standard Deviation
To prevent an anomalous spike today from contaminating its own baseline calculation, the engine uses `.shift(1)` before computing rolling statistics over a 7-day window ($W = 7$):

#### 1. Rolling Expected Mean ($\mu_t$):
$$\mu_t = \frac{1}{W} \sum_{i=1}^{W} V_{t-i}$$

#### 2. Rolling Sample Standard Deviation ($\sigma_t$):
$$\sigma_t = \sqrt{\frac{1}{W - 1} \sum_{i=1}^{W} (V_{t-i} - \mu_t)^2}$$

#### 3. Cold-Start Expanding Fallback ($t < W$):
For the initial days of a dataset where fewer than $W$ history points exist, the engine falls back dynamically to an expanding cumulative window:
$$\mu_{\text{expanding}} = \frac{1}{t} \sum_{i=0}^{t-1} V_i, \quad \sigma_{\text{expanding}} = \sqrt{\frac{1}{t - 1} \sum_{i=0}^{t-1} (V_i - \mu_{\text{expanding}})^2}$$

---

### 5.4 Z-Score Surprise Calculation & Incident Classification
The **Z-Score** measures how many standard deviations today's observation lies away from the rolling historical average:
$$Z_t = \begin{cases} \frac{V_t - \mu_t}{\sigma_t} & \text{if } \sigma_t > 0 \\ 0.0 & \text{if } \sigma_t = 0 \end{cases}$$

#### Classification Rules:
- An observation is flagged as an **Anomaly** if:
  $$|Z_t| \ge Z_{\text{threshold}} \quad (\text{default: } 2.0)$$
- If $Z_t > 0$, it is categorized as **`SPIKE_HIGH`** (surge event).
- If $Z_t < 0$, it is categorized as **`DROP_LOW`** (plunge event).

#### Concrete Calculation Walkthrough (`car_sales.csv` on August 9, 2026):
1. **Prior 7 Days Revenue (Aug 2 to Aug 8):** `[$158193, $82228, $84372, $155162, $180296, $84536, $148113]`
2. **7-Day Rolling Mean ($\mu$):** $\frac{892,900}{7} = \mathbf{\$127,557.14}$
3. **Rolling Standard Deviation ($\sigma$):** $\mathbf{\$42,180.21}$
4. **Observed Revenue ($V_t$):** $\mathbf{\$437,000.00}$ (vs. Aug 8's $\$148,113.00 \rightarrow \mathbf{+195.04\%}$)
5. **Z-Score:**
   $$Z = \frac{437,000 - 127,557.14}{42,180.21} = \mathbf{+7.34}$$
6. **Result:** Because $|+7.34| \ge 2.0$, the event is flagged as a major **`SPIKE_HIGH`** incident.

---

## 6. Frontend Architecture & Interactive Visual System

### 6.1 Design System & Aesthetic Philosophy
The user interface is built on a custom **Mediterranean Calm** design system configured in [`frontend/src/index.css`](file:///e:/EDA_Project/frontend/src/index.css) and Tailwind CSS:
- **Canvas Background:** Soft warm cream (`#F7F4EF`) with subtle ambient radial gradients.
- **Glassmorphic Surface Cards:** Pure white frosted cards with 92% opacity, 12px backdrop blur, soft warm borders (`#E5DAD0`), and olive drop-shadows.
- **Semantic Color Palette:**
  - **Deep Olive (`#667035`):** Used for healthy performance markers, baseline trends, and primary indicators.
  - **Warm Terracotta (`#C2856A`):** Used for primary interactive actions, upload buttons, and focus rings.
  - **Sage Garden (`#9BA084`):** Used for secondary controls and subtle container highlights.
  - **Alert Coral/Red (`#D32F2F`):** Dedicated exclusively to anomaly markers and critical attention banners.

---

### 6.2 Dynamic Chart Engine (Recharts Integration)
Rather than rendering identical line charts for every column, [`frontend/src/components/MetricChart.jsx`](file:///e:/EDA_Project/frontend/src/components/MetricChart.jsx) dynamically assigns visual chart structures based on the semantic nature of the data:

1. **Area Charts (Financial & Continuous Flow):** Applied to monetary metrics (`revenue`, `sales`, `income`). Renders a smooth monotone area with a subtle vertical gradient, an expected baseline dashed line, and pulsing red anomaly dots.
2. **Bar Charts (Discrete Operations & Waste):** Applied to count metrics (`waste`, `loss`, `defects`). Renders vertical bars where normal days share the olive theme and anomalous days render in vivid alert red (`#D32F2F`).
3. **Combo Charts (Volume vs. Baseline):** Applied to inventory and vehicle movements (`units_sold`, `inventory`, `stock`). Combines volume bars with an overlay trend line for expected baseline averages.

---

### 6.3 Flagged Incident Table with In-Line Logic Explainers
The [`AnomalyTable.jsx`](file:///e:/EDA_Project/frontend/src/components/AnomalyTable.jsx) component translates statistical calculations into an interactive audit log. Every column header (`Observed Value`, `Previous Value`, `% Change`, `Incident Type`) includes an interactive tooltip explainer, and hovering over any flagged row reveals the underlying mathematical decision logic:
- Exact 7-day baseline average at that date.
- The calculated Z-score and how it compares against the user's sensitivity threshold.

---

## 7. Step-by-Step Local Setup & Execution Guide

### Prerequisites
- **Operating System:** Windows 10/11, macOS, or Linux.
- **Python:** Python 3.10, 3.11, or 3.12 installed.
- **Node.js:** Node.js 18+ and `npm`.

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Neelendra-Mishra/data_watcher.git
cd data_watcher
```

---

### Step 2: Backend Setup & Virtual Environment
**On Windows (PowerShell):**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

**On macOS / Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

---

### Step 3: Frontend Setup & Dependencies
In a new terminal window:
```bash
cd frontend
npm install
```

---

### Step 4: Running the Application

#### Option A: One-Click Startup (Windows)
From the project root directory, execute:
```powershell
.\run.ps1
```
*(Or double-click `run.bat` from Windows File Explorer).*

#### Option B: Manual Startup
1. **Start Backend (Terminal 1):**
   ```powershell
   cd backend
   $env:PYTHONPATH='.'
   uvicorn app.main:app --reload --port 8000
   ```
2. **Start Frontend (Terminal 2):**
   ```powershell
   cd frontend
   npm run dev
   ```

---

### Step 5: Accessing the Dashboard & Running Analysis
1. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```
2. Click **"Load Sample Dataset (car_sales.csv)"** at the top right of the upload dropzone.
3. Review the automatically detected column mapping in Step 2:
   - Timeline Column: `date`
   - Monitored Metrics: `revenue`, `units_sold`, `test_drives`
   - Detection Sensitivity: `2.0 (Recommended)`
4. Click **"Scan for Unexpected Changes"**.
5. Observe:
   - The **Executive Summary Banner** highlighting the detected anomaly events.
   - The **Flagged Incident List** detailing the August 9 revenue spike ($+195.04\%$, $Z = +7.34$).
   - The interactive **Time-Series Charts** displaying the rolling baseline trend line and glowing red anomaly points.

---

## 8. Technical Architecture Trade-offs & Interview Discussion Points

### 1. Why Rolling Z-Scores Over Deep Learning (LSTM, Prophet, Isolation Forest)?
| Dimension | Complex Machine Learning (LSTM / Prophet) | Rolling Z-Score Engine (Data Watcher) |
| :--- | :--- | :--- |
| **Data Requirements** | Requires hundreds or thousands of rows to train | Works immediately on small spreadsheets (as few as 7–14 days) |
| **Execution Latency** | 3 to 15 seconds for model fitting and inference | Sub-15 milliseconds in-memory vectorized execution |
| **Explainability** | Black box; hard to explain to business executives | Complete transparency: explicitly shows $\mu$, $\sigma$, and exact formula |
| **Cold Starts** | Struggles with short histories or new data streams | Seamlessly handled using expanding window fallbacks |
| **Operational Overhead** | Requires GPU/heavy CPU instances, PyTorch/TensorFlow | Lightweight; runs efficiently on standard CPUs with standard Pandas |

---

### 2. Why In-Memory Processing Instead of Persistent Databases?
- **Zero-Storage Privacy:** In many corporate environments, uploading proprietary financial data to a persistent database triggers security reviews and GDPR/SOC2 hurdles. Streaming the file into an in-memory `io.BytesIO` buffer guarantees that once the request cycle finishes, no sensitive data remains stored on the server.
- **Speed & Simplicity:** Eliminates database migrations, connection pooling bottlenecks, and stale record clean-up jobs.

---

### 3. How Does the Engine Handle Variance Edge Cases?
- **Division by Zero ($\sigma = 0$):** If a metric remains completely flat for 7 days (e.g., constant daily rent of $\$5,000$), the sample standard deviation is $0.0$. A naive formula would crash with a `ZeroDivisionError`. The engine uses `np.where(rolling_std_series > 0, ..., 0.0)` to gracefully return a Z-score of $0.0$.
- **First-Period Cold Start ($t = 0$):** Since the first observation has no prior day for comparison, $\Delta\%$ is automatically clamped to $0.0\%$, preventing `NaN` propagation through JSON serialization.

---

*Engineered by Neelendra Mishra — Autonomous Data Watcher Project.*

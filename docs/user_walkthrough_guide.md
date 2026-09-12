# The Autonomous Data Watcher Story: Step-by-Step Walkthrough with `car_sales.csv`
### How Anyone Can Turn a Raw Business Spreadsheet into Instant Visual Answers, Anomaly Alerts, and Operational Action Plans

---

## 🌟 What We Are Going to Do Today

Welcome to the guided walkthrough of the **Autonomous Data Watcher**! 

If you've ever managed a store, monitored dealership sales, tracked warehouse inventory, or reviewed company expenses, you know the daily headache: **staring at spreadsheets filled with hundreds of numbers in Excel or Google Sheets**. It's exhausting, human eyes miss subtle warning signs, and by the time someone notices a major slump or inventory shortage, money has already been lost.

In this walkthrough, we are going to experience how the Data Watcher changes that completely. 

Together, we are going to take a realistic 30-day business dataset—[`sample_data/car_sales.csv`](file:///e:/EDA_Project/sample_data/car_sales.csv)—and follow the application through each step of the journey:
1. **Step 1: Uploading Our Data** — How the app reads our file instantly and safely in memory without storing it on disk.
2. **Step 2: Choosing What to Monitor** — How smart detection finds our timeline and metrics, and how to set our alert sensitivity.
3. **Step 3: Scanning for Unexpected Changes** — What the statistical engine does under the hood to measure what is "normal" vs. "unusual."
4. **Step 4: Reading the 10-Second Executive Summary** — Getting an instant boardroom-level verdict on whether attention is required.
5. **Step 5: Investigating Flagged Incidents** — Walking through real surges and drops, understanding the math and business reasons, and knowing the exact operational steps to take next.
6. **Step 6: Exploring the Visual Charts** — Seeing the story unfold across time-series trendlines, expected baseline curves, and glowing red anomaly markers.
7. **Step 7: Fine-Tuning Sensitivity** — How adjusting the slider helps us catch subtle post-spike supply bottlenecks.

Let's begin the journey!

---

## 🚗 Meeting Our Companion Dataset: `car_sales.csv`

Before we upload anything, let's understand the business we are auditing.

Imagine you oversee operations for a regional automotive dealership network. Every evening at closing time, your showroom management system exports daily activity across the month of **August 2026** (30 days) into a CSV file with six columns:

* **`date`**: Calendar date of operations (`2026-08-01` to `2026-08-30`).
* **`brand`**: Primary car manufacturer featured (`Honda`, `Toyota`, `Nissan`, `Ford`, `Hyundai`, `Kia`).
* **`fuel_type`**: Powertrain category (`Hybrid`, `Electric`, `Diesel`, `Petrol`).
* **`units_sold`**: Number of cars delivered that day (typically 5 to 8 cars).
* **`revenue`**: Total daily dollar revenue generated (typically $120,000 to $180,000).
* **`test_drives`**: Showroom customer test drives conducted (typically 12 to 15 drives).

Now let's put the Data Watcher to work!

---

## 📤 Step 1: Uploading Your Spreadsheet

### What This Step is For
The first step is getting your data into the system. Unlike many corporate tools that force you to upload sensitive company data into external cloud databases, the Data Watcher uses a **privacy-first in-memory stream**. Your file is parsed in RAM using Python byte buffers (`io.BytesIO`) and is never saved to a server hard drive.

### What You Do
When you open the web dashboard at `http://localhost:5173/`, you see **"1. Select your spreadsheet"** at the top of the screen:
1. **Drag and Drop:** You can drag `car_sales.csv` directly into the dotted upload dropzone, or click **"browse files"**.
2. **Or Use the One-Click Preset:** Click the terracotta button in the top-right corner:
   👉 **`Load Sample Dataset (car_sales.csv)`**

### What Happens Behind the Scenes
The moment you select the file:
- The React frontend sends the raw file stream to the FastAPI backend endpoint (`POST /api/upload`).
- Python Pandas inspects the spreadsheet, validates the file format, and calculates top-level metadata:
  - Total rows detected: **`30`**
  - Columns discovered: `["date", "brand", "fuel_type", "units_sold", "revenue", "test_drives"]`
- The backend packages the first 5 records as a sample preview and returns it to your browser in milliseconds.

### What You See on Screen
The upload card confirms success with a green badge: **"File Ready • car_sales.csv • 30 rows loaded • 6 columns detected"**. Right beneath it, a clean preview table displays the first 5 rows so you can verify that your headers and columns loaded accurately.

### What We Do Next
With our spreadsheet parsed, the application automatically unlocks **Step 2** directly below.

---

## 🎛️ Step 2: Choose What to Monitor

### What This Step is For
A spreadsheet can contain dozens of columns—customer notes, IDs, dates, categories, dollar amounts, and counts. Step 2 acts as your intelligent control deck: it tells the system which column represents your timeline, which numeric metrics you want to analyze, and how strict you want your alert threshold to be.

### What You Do
You will notice three intuitive controls in the **"2. Choose what to monitor"** card:

#### 1. Smart Date Column Selection
* **How it helps you:** The application automatically inspects all column headers and detects that `date` contains calendar timestamps. It sets `date` as your default timeline anchor.
* **Safety protection:** To prevent human errors, non-date numerical columns like `revenue` or `units_sold` are excluded from the date dropdown. You never have to worry about accidentally sorting your dealership timeline by dollar amounts or car counts!

#### 2. Selecting Monitored Metrics
* **How it helps you:** You decide which business indicators matter today. Each metric gets assigned an intuitive color-coded badge.
* For our walkthrough, we select all three core metrics:
  - **`revenue`** (Financial Momentum — Deep Olive badge)
  - **`units_sold`** (Physical Inventory Turnover — Olive Mist badge)
  - **`test_drives`** (Customer Showroom Interest — Terracotta badge)

#### 3. Setting Detection Sensitivity ($Z$-Score Slider)
* **How it works:** This slider controls how unusual a number has to be before triggering an alarm.
* By default, it is set to **`Standard (Z = 2.0)`**. This recommended setting strikes a balance: it catches genuine business surprises while ignoring ~95% of routine, minor daily wobbles.

### What We Do Next
With our timeline, metrics, and sensitivity locked in, we click the large action button:
👉 **"Scan for Unexpected Changes"**

---

## ⚡ Step 3: Scanning the Data (Behind the Scenes of the Engine)

### What This Step is For
This is where the magic happens. Instead of relying on rigid, arbitrary alarms (e.g. *"alert if revenue is below $100k"*), the Data Watcher evaluates each day against its own recent historical reality.

### What the Engine Does in Under a Second
1. **Chronological Sorting:** Python verifies that all 30 days are in true chronological order from August 1st to August 30th.
2. **Period-over-Period Delta ($\Delta\%$):** The engine compares each day against yesterday to measure day-to-day momentum:
   $$\% \text{ Change} = \frac{\text{Today} - \text{Yesterday}}{\text{Yesterday}} \times 100$$
3. **The 7-Day Rolling Baseline ($\mu$):** For every single date, Python looks back at the preceding 7 days ($W = 7$) to calculate what a typical day looked like:
   $$\mu = \frac{\text{Sum of Previous 7 Days}}{7}$$
   *(Note: The current day is shifted out of the baseline calculation so today's spike doesn't contaminate its own benchmark!)*
4. **The "Wobble Ruler" / Rolling Standard Deviation ($\sigma$):** Python measures how much that metric naturally bounced up and down over those same 7 days.
5. **The Surprise Score ($Z$-Score):** Python calculates how many standard deviations today's number is away from the expected baseline:
   $$Z = \frac{\text{Observed Value} - \text{Rolling Mean}}{\text{Rolling Standard Deviation}}$$
6. **Flagging:** If $|Z| \ge 2.0$, the row is flagged!
   - $Z > 0 \rightarrow$ **`SPIKE HIGH`** (Surge)
   - $Z < 0 \rightarrow$ **`DROP LOW`** (Slump)

### What We Do Next
The scan finishes in milliseconds, and the screen smoothly updates with complete executive findings.

---

## 📋 Step 4: Reading the 10-Second Executive Summary

### What This Step is For
A General Manager, Director, or store owner doesn't have 20 minutes to read through raw calculation tables. Step 4 provides an immediate, high-level verdict on store health.

### What You See on Screen
A prominent executive card appears at the top of the results:

* **Status Banner:** Shows a bold badge reading **`Attention Required`** with a red security icon.
* **Key Metrics Summary:** Confirms `30 rows analyzed` across `car_sales.csv`, identifying `3 Unusual Events Flagged`.
* **Plain-English Briefing:**
  > *"NOTICE: 3 unusual event(s) detected in 'car_sales.csv' across: Revenue, Units_sold, Test_drives. These numbers moved far beyond normal day-to-day changes compared to recent history. We recommend reviewing these dates."*

### Why This is Helpful
In 10 seconds, anyone reviewing the project immediately knows:
1. The spreadsheet was parsed cleanly.
2. The overall business health is not "business as usual"—there are genuine anomalies that require review.
3. Exactly which metrics breached their normal boundaries (`Revenue`, `Units_sold`, `Test_drives`).

### What We Do Next
Now that we know anomalies exist, we scroll down to the **Flagged Incident List** to investigate each event in detail.

---

## 🔍 Step 5: Investigating the Flagged Incidents (Real Numbers, Reasoning & What To Do Next)

### What This Step is For
This step is your operational audit log. It lays out every single date that triggered an alarm, explains the mathematics behind the flag, and tells you what operational actions to take next.

Let's examine the major incidents caught in `car_sales.csv`:

---

### 🚨 Incident A: The Monday Revenue Slump (August 3, 2026)

| Metric | Date | Observed Value | Previous Value | % Change | Incident Badge | Z-Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`revenue`** | `2026-08-03` | **`$82,228.00`** | `$158,193.00` | **`-48.02%`** | 🔻 **`DROP LOW`** | $-31.34$ |

#### 1. Why It Was Flagged (The Reasoning):
* On Saturday (Aug 1) and Sunday (Aug 2), the dealership enjoyed brisk weekend business ($\$161,700$ and $\$158,193$). The 2-day expanding mean was **`$159,946.50`**, and the variation was very narrow ($\sigma = \$2,479.82$).
* On Monday, August 3rd, gross revenue suddenly plummeted to **`$82,228.00`** (Row 4: Kia Diesel, only 4 cars sold).
* That was a **`$77,718.50`** plunge below the expected average. Dividing by the tight standard deviation yielded $Z = -31.34$. The engine immediately flagged it as **`DROP LOW`**.

#### 2. What To Do Next (Operational Action):
1. **Audit Financing Approvals:** Have the Finance & Insurance (F&I) team check if customer loan contracts signed over the weekend were delayed in Monday morning bank verification queues.
2. **Review Lead Queues:** Ensure website inquiries submitted on Sunday were properly assigned to sales representatives on Monday morning.
3. **Staffing Check:** Verify whether Monday sales coverage was cut too thin after the busy weekend.

---

### 🔔 Incident B: Showroom Foot-Traffic Early Warnings (August 5 & August 8, 2026)

| Metric | Date | Observed Value | Previous Value | % Change | Incident Badge | Z-Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`test_drives`** | `2026-08-05` | **`18 drives`** | 14 drives | **`+28.57%`** | 🔺 **`SPIKE HIGH`** | $+2.71$ |
| **`test_drives`** | `2026-08-08` | **`19 drives`** | 12 drives | **`+58.33%`** | 🔺 **`SPIKE HIGH`** | $+2.13$ |

#### 1. Why It Was Flagged (The Reasoning):
* Dealership test drives usually hover predictably between 12 and 15 drives a day ($\mu \approx 14.3$, $\sigma \approx 1.3 - 2.2$).
* Jumps to **18 drives** on Wednesday (Aug 5) and **19 drives** on Saturday (Aug 8) broke normal boundaries ($Z = +2.71$ and $+2.13$).
* **Why this matters:** Test drives are **leading indicators**. Buyers don't purchase vehicles on a whim—they test drive first. These spikes were warning signs that buyer interest was surging toward a massive weekend!

#### 2. What To Do Next (Operational Action):
1. **Mobilize Sales Staff:** Schedule all available sales reps and finance managers for Sunday.
2. **Prep the Demo Fleet:** Ensure all popular demo vehicles are washed, fueled, and battery-charged on the front line to avoid customer bottlenecks.
3. **Contact Test Drivers:** Have the sales team follow up immediately with the visitors who test-drove cars on Aug 5 and Aug 8 with same-weekend pricing promotions.

---

### ⚡ Incident C: The Super Spike — Fleet Deal & EV Run (August 9, 2026)

| Metric | Date | Observed Value | Previous Value | % Change | Incident Badge | Z-Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`units_sold`** | `2026-08-09` | **`19 cars`** | 7 cars | **`+171.43%`** | 🔴 **`SPIKE HIGH`** | $+7.41$ |
| **`revenue`** | `2026-08-09` | **`$437,000.00`** | `$148,113.00` | **`+195.04%`** | 🔴 **`SPIKE HIGH`** | $+7.34$ |

#### 1. Why It Was Flagged (The Reasoning):
* Look at Row 10 in our spreadsheet: `2026-08-09, Nissan, Electric, 19, 437000, 13`.
* For the previous 7 days (Aug 2–8), daily dealership revenue averaged **`$127,557.14`** with standard deviation **`$42,180.21`**.
* On Sunday, August 9, revenue skyrocketed to **`$437,000.00`**—nearly tripling yesterday's sales ($+195.04\%$) as 19 electric vehicles were sold in a single day!
* The math:
  $$Z = \frac{437,000 - 127,557.14}{42,180.21} = \mathbf{+7.34}$$
* Surpassing normal variance by over **7 standard deviations**, both `units_sold` ($Z = +7.41$) and `revenue` ($Z = +7.34$) triggered major alert flags.

#### 2. What To Do Next (Operational Action):
1. **Emergency Lot Backfill:** Delivering 19 electric vehicles in one afternoon depleted dealership inventory. The General Manager must immediately contact the regional Nissan distributor to allocate replenishment units before next weekend.
2. **Service Bay Scheduling:** Schedule technician bays for pre-delivery inspections (PDI) so the 19 vehicles can be prepped without stalling normal customer maintenance.
3. **Verify Wire Transfers:** Ensure accounting reconciles commercial fleet wire transfers or municipal clean-energy rebate documentation.

---

### ⚡ Incident D: The Viral Test-Drive Frenzy (August 21, 2026)

| Metric | Date | Observed Value | Previous Value | % Change | Incident Badge | Z-Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`test_drives`** | `2026-08-21` | **`31 drives`** | 13 drives | **`+138.46%`** | 🔴 **`SPIKE HIGH`** | $+9.67$ |

#### 1. Why It Was Flagged (The Reasoning):
* Normal test drives on recent days hovered around **13.86 drives** ($\sigma = 1.77$).
* On Friday, August 21, test drives surged to an astounding **`31 drives`** ($+138.46\%$)—the highest statistical surprise in the entire 30-day dataset (**$Z = +9.67$**, almost 10 standard deviations above normal!).
* Looking at the data, a viral promotional campaign for the Hyundai Electric brought massive foot traffic to the showroom floor.
* However, only **5 Hyundai Electric cars closed that day**.

#### 2. What To Do Next (Operational Action):
1. **Launch a 24-Hour CRM Blitz (High Priority!):** 31 test drives resulted in 5 sales, meaning **26 qualified buyers** are sitting warm in your CRM database! Send an automated text/email campaign within 24 hours:
   > *"Thank you for test-driving the Hyundai Electric at Apex Motors on Friday! Complete your order before August 31st and receive complimentary home charger installation."*
2. **Debrief the Sales Team:** Why did 26 prospective buyers walk out without purchasing? Was it trade-in valuation, lease pricing, or range anxiety?
3. **Capitalize on the Pipeline:** These 26 warm leads are the exact pipeline that powered the dealership's strong month-end close on **August 30th ($177,960)**!

---

## 📈 Step 6: Visualizing Trends with Dynamic Charts

### What This Step is For
Numbers in a table tell you what happened on individual days. Interactive charts tell the continuous visual story of your business momentum over time.

### How Data Watcher Visualizes Each Metric
Directly beneath the incident table, you see tailored charts for each monitored metric:

#### 1. Revenue (Smooth Area Chart)
* **Why Area?** Dollar revenue is continuous financial cash flow. A gradient area chart best shows financial trajectory.
* **The Dashed Baseline Line:** A subtle horizontal dashed line floats at the 7-day rolling average ($\sim \$127,557$). It gives your eyes an instant benchmark of expected daily sales.
* **The Glowing Red Dot:** On August 9th, a glowing red dot (`#D32F2F`) pulses directly at the $\$437,000$ peak. Normal days remain calm olive green. You don't have to search for the anomaly—it immediately draws your eyes.
* **Latest Value Header:** The top-right card shows the final day's close (**`$177,960`**, $+108.2\%$, green trending arrow), confirming that month-end closed strong.

#### 2. Units Sold & Test Drives (Bar & Combo Charts)
* **Why Bars?** Vehicles and test drives are discrete daily counts (4 cars, 7 cars, 19 cars).
* On August 9th, the 19-car bar stands like a tall red tower contrasting sharply against normal 5–7 car bars.
* On August 21st, the 31 test-drive bar stands out instantly from the normal 13-drive level.

### What We Do Next
Now let's explore an advanced feature: what happens when an anomaly is subtle, and how the sensitivity slider helps us find it.

---

## 🎛️ Step 7: Fine-Tuning Sensitivity (The August 16 Lesson)

### What This Step is For
No two businesses are identical. A hospital ICU or flight safety team needs ultra-strict alarms (flagging small variations), while an executive reviewing high-level revenue might only want to know about massive crises. Step 7 shows how the **Detection Sensitivity Slider** puts you in total control.

### The Mystery of August 16, 2026:
Look at what happened on Sunday, August 16th:
* **Recorded Sales:** **`1 car`** ($90,052 revenue).
* **Previous Day (Aug 15):** `6 cars`.
* **Day-over-Day Drop:** **`-83.33%`**!

Selling only 1 car on a weekend is an operational failure for a dealership that normally averages 6–8 cars. So why wasn't it flagged in our table at the default setting?

#### The Explanation:
Remember the massive August 9 surge (19 cars)? Because August 9 sits within the previous 7-day window, that giant spike temporarily inflated the rolling standard deviation $\sigma$ from $1.77$ up to **`4.41`**.
$$Z = \frac{1 - 9.14}{4.41} = \mathbf{-1.85}$$
Because $|-1.85| < 2.0$, the standard setting filtered it out to avoid false alarms.

### How You Solve This with the Slider:
1. Scroll back up to **Step 2**.
2. Move the **Detection Sensitivity Slider** slightly to the right toward **`High Sensitivity (Z = 1.5 - 1.8)`**.
3. Click **"Scan for Unexpected Changes"** again.
4. **The Result:** August 16th is now immediately flagged with a red 🔻 **`DROP LOW`** badge!

#### What This Teaches Us:
- Use **Standard ($Z = 2.0$)** for daily, executive-level monitoring without noise.
- Slide to **High Sensitivity ($Z = 1.5$)** when auditing post-crisis periods or conducting strict inventory and quality-control reviews.

---

## 🎯 Summary: Why the Autonomous Data Watcher Matters

By following this step-by-step walkthrough with `car_sales.csv`, you have seen how the **Autonomous Data Watcher** solves the real-world problems of spreadsheet data:

1. **Zero Setup & Total Privacy:** No database configuration, no cloud storage risks—files are processed in memory and disappear when the analysis finishes.
2. **Context-Aware Intelligence:** Instead of dumb static rules, it calculates dynamic rolling baselines adapted to your business's recent pace.
3. **Complete Transparency:** Every flag has an exact mathematical formula and business explanation behind it. No mysterious black-box AI.
4. **Actionable Insights:** It doesn't just show numbers; it tells managers exactly what happened and outlines the operational next steps to protect revenue and capitalize on opportunities.

*Now, try uploading your own `.csv` or `.xlsx` spreadsheet and discover what stories and surprises your data is waiting to tell!*

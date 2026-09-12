# User Walkthrough Guide — Master Story of Data Analysis (`car_sales.csv`)

Welcome to the master walkthrough guide for the **Autonomous Data Watcher**. This document provides a complete, step-by-step story of how the application processes raw business spreadsheets, detects unexpected changes, explains every calculation in simple terms, and visualizes trends.

By following this single guide, you will understand the entire project's functionality—from raw file upload to final executive insights—without needing a statistics background.

---

## 📖 1. Introduction: Meeting Our Sample Dataset

To see how the Data Watcher works in real life, let me introduce our sample dataset: **`car_sales.csv`**.

Imagine you manage a dealership network. Every evening at closing time, your inventory management system exports daily sales and showroom activity into a CSV file. This file contains **30 days of data** (from August 1, 2026 to August 30, 2026) across six key columns:

* **`date`**: The calendar date of each dealership day (e.g. `2026-08-01`).
* **`brand`**: The primary vehicle brand sold that day (e.g. `Honda`, `Toyota`, `Nissan`, `Ford`, `Kia`).
* **`fuel_type`**: Engine classification (e.g. `Hybrid`, `Electric`, `Diesel`, `Petrol`).
* **`units_sold`**: Total number of vehicles sold that day (e.g. `7 cars`).
* **`revenue`**: Total daily dollar revenue generated from car sales (e.g. `$161,700`).
* **`test_drives`**: Total number of customer test drives conducted by sales reps (e.g. `15 test drives`).

Normally, scanning through 30 rows of numbers across multiple columns in Excel takes manual effort and time. Let's see how our application turns this raw spreadsheet into instant visual answers in seconds!

---

## 📤 2. Step 1 — Uploading the File

When you first open the application, you are greeted by a clean, warm Mediterranean interface.

At the top of the screen, you see **Step 1: Upload Your Data**. You can either drag and drop **`car_sales.csv`** directly into the upload dropzone or click **"Load Preset Sample"** and select **Car Sales Metrics**.

The moment you select the file:
1. The frontend parses all 30 rows of spreadsheet data in milliseconds.
2. The upload card confirms success with a friendly checkmark: *"Dataset loaded: 30 rows, 6 columns"*.
3. **Step 2** instantly unfolds below, ready for your instructions.

---

## 🎛️ 3. Step 2 — Choose What to Monitor

Now that your file is loaded, **Step 2** acts as your interactive control panel.

### Automatic Date Column Detection:
The application inspects all column headers in `car_sales.csv` (`date`, `brand`, `fuel_type`, `units_sold`, `revenue`, `test_drives`). It automatically recognizes that `date` contains calendar date strings (`2026-08-01`) and sets `date` as your timeline anchor.

To protect you from mistakes, the dropdown automatically hides numeric columns like `revenue`, `units_sold`, or `test_drives`. This guarantees that you never accidentally sort your dealership timeline by dollar amounts or car counts!

### Picking Your Metrics:
Next, you choose which metrics you actually want to monitor.
* Maybe today you only care about total daily sales volume, so you select **`revenue`**.
* Maybe you also want to keep an eye on physical inventory movement, so you select **`units_sold`**.
* Maybe you want to track customer foot-traffic interest, so you add **`test_drives`**.

You can pick whichever metrics matter to you. For our walkthrough, we select all three: **`revenue`**, **`units_sold`**, and **`test_drives`**.

### Setting Detection Sensitivity:
Finally, you see the **Detection Sensitivity Slider**. It defaults to **`2.0 (Recommended)`**. This standard setting means the app will only alert you when a change is statistically significant, ignoring minor day-to-day wobbles.

---

## ⚡ 4. Pressing "Scan for Unexpected Changes"

With your settings ready, you click the primary action button: **"Scan for Unexpected Changes"**.

Here is what happens behind the scenes in story form:
1. The browser sends your 30 rows of data and selected settings to our FastAPI backend (`POST /api/analyze`).
2. Python Pandas sorts the 30 days chronologically from August 1st to August 30th.
3. For every single day, Python looks back at the previous 7 days to calculate what a "typical day" looks like for revenue, units sold, and test drives.
4. Python computes Z-scores to identify extreme outliers, checks percentage changes, assigns custom Mediterranean chart types, and generates plain-English executive summary narratives.
5. In less than a second, your screen updates with complete interactive results!

---

## 🚨 5. Explaining the Flagged Incident List (With Real Numbers & Full Reasoning)

Scroll down to the **Flagged Incident List** table. The system highlights a massive incident on **August 9, 2026** for **`revenue`**:

| METRIC | DATE | OBSERVED VALUE | PREVIOUS VALUE | % CHANGE | INCIDENT TYPE | Z-SCORE |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`revenue`** | `2026-08-09` | **`$437,000.00`** | `$148,113.00` | **`+195.04%`** | 🔴 **`SPIKE HIGH`** | $+7.34$ |

Let's walk through every single column on this flagged row and explain **what it is**, **why it's shown**, **why it's useful**, and **how it's calculated**:

---

### 1. Observed Value (`$437,000.00`)
* **What it is:** The actual recorded revenue in your spreadsheet on August 9, 2026.
* **Why it's shown & why it matters:** This is the raw ground truth—what actually happened at your dealership on that day. Without the observed value, you wouldn't know the exact dollar amount generated during the sales surge.

---

### 2. Previous Value (`$148,113.00`)
* **What it is:** The revenue recorded on yesterday, August 8, 2026 (Row 9 of your CSV file).
* **Why it's shown & why it's needed:** A number on its own tells you nothing. If I say *"Dealership revenue was $437,000 today"*, you don't know if that's good or bad until you compare it to recent history. Showing yesterday's `$148,113` gives you an immediate benchmark of recent store performance.

---

### 3. % Change (`+195.04%`)
* **What it is:** Measures how much revenue surged today compared to yesterday as a percentage.
* **Why it exists & how it helps at a glance:** Comparing raw numbers like `$437,000` vs `$148,113` requires mental math. The `% Change` column turns two separate figures into one simple, relatable measure of *"how much did this number move?"* Percentages are far easier to read because human brains naturally understand that a $195.04\%$ surge means revenue nearly tripled in a single day!
* **How it's calculated (Real Math):**
  $$\% \text{ Change} = \frac{\text{Observed Value} - \text{Previous Value}}{\text{Previous Value}} \times 100$$
  $$\% \text{ Change} = \frac{437,000 - 148,113}{148,113} \times 100 = \frac{288,887}{148,113} \times 100 = \mathbf{+195.04\%}$$

---

### 4. Z-Score (`+7.34`)
* **What it is:** The statistical "Surprise Index" measuring how many standard deviations today's number is away from your dealership's normal weekly average.
* **Why it exists & why % Change alone isn't enough:** 
  Percentage change by itself can be misleading! 
  * Imagine a volatile metric like test drives or accessory sales—those numbers might naturally jump or drop by $50\%$ every day as a routine occurrence. For that metric, a $50\%$ jump would be completely normal.
  * However, for your dealership's **Revenue**, daily sales usually hover predictably around $\$127,557.14$.
  * The **Z-score** solves this problem by measuring today's surge against *Revenue's own historical day-to-day stability*.
* **How it's calculated (Real Math Step-by-Step):**
  To evaluate August 9th, Python looks back at the 7 preceding days (August 2 to August 8): `[$158193, $82228, $84372, $155162, $180296, $84536, $148113]`.
  
  1. **7-Day Rolling Mean ($\mu$):**
     $$\mu = \frac{158193 + 82228 + 84372 + 155162 + 180296 + 84536 + 148113}{7} = \frac{892,900}{7} = \mathbf{\$127,557.14}$$
  2. **Standard Deviation / "The Wobble Ruler" ($\sigma$):**
     We subtract $\$127,557.14$ from each of the 7 days, square the differences, add them together ($10,674,383,230.86$), divide by $6$ ($1,779,063,871.81$), and take the square root:
     $$\sigma = \sqrt{1,779,063,871.81} = \mathbf{\$42,180.21}$$
     *(Note: Standard deviation is **not fixed**—it is recalculated dynamically for every date and metric!)*
  3. **Z-Score Formula:**
     $$Z = \frac{\text{Observed Value} - \text{Rolling Mean}}{\text{Rolling Standard Deviation}} = \frac{X - \mu}{\sigma}$$
     $$Z = \frac{437,000 - 127,557.14}{42,180.21} = \frac{309,442.86}{42,180.21} = \mathbf{+7.34}$$

---

### 5. What Happens After Calculating the Z-Score
Once Python calculates $Z = +7.34$:
1. **Threshold Check:** The backend takes the absolute value ($|+7.34| = 7.34$) and compares it against your sensitivity threshold ($2.0$). Since $7.34 \ge 2.0$, the row gets flagged!
2. **Badge Labeling:** Because $Z$ is positive (revenue jumped far above normal), the system attaches the red **`SPIKE HIGH`** badge.

*(Similarly, on August 9th, **`units_sold`** surged from 7 cars to 19 cars (+171.43%, $Z = +7.41$), and on August 21st, **`test_drives`** shot up from 13 to 31 (+138.46%, $Z = +9.67$), each earning the red **`SPIKE HIGH`** badge!)*

---

## 📈 6. Explaining the Graphs (With Real Numbers & Full Reasoning)

When you look at the **Revenue Trend Chart** on your dashboard, you are seeing an interactive visual story of your dealership's 30-day performance.

---

### 1. The Dotted Baseline Trend Line
* **What it is:** A subtle horizontal reference line floating at **$127,557.14**.
* **Why it's shown:** It gives your eyes an instant reference benchmark of expected normal daily revenue.
* **How it's calculated:** It plots the 7-day rolling mean ($\mu = \$127,557.14$) calculated across recent operating days.

---

### 2. The Glowing Red Anomaly Points
* **What they are:** Glowing pulsing red dots (`#D32F2F`) rendered directly on specific dates (like August 9th at `$437,000`).
* **Why they're shown & how the app decides to mark them red:** They draw immediate visual focus to dates where a statistical surge or crash occurred. The app marks a point red whenever the backend calculates $|Z| \ge 2.0$ and sets `is_anomaly: true`. All normal days remain soft Mediterranean olive green.

---

### 3. Why the Line Curves the Way it Does
* **What it is:** The solid green line simply plots your raw recorded daily revenue chronologically across all 30 days:
  * Aug 1 to Aug 8: Floating between `$82,228` and `$180,296`.
  * Aug 9: Shooting straight up to **`$437,000`** (19 cars sold!).
  * Aug 10 to Aug 15: Returning to normal levels around `$123,654` to `$187,912`.
  * Aug 30: Ending at **`$177,960`**.

---

### 4. The "Latest Value" Stat on the Card
* **What it is:** The top-right header box displaying **`$177,960`** with a green **`+107.62%`** badge.
* **Where it comes from & what it means:** Taken directly from the final row of your spreadsheet (August 30, 2026, where revenue was `$177,960` compared to Aug 29's `$85,472`). It reassures the manager at a glance: *"Sales closed strong at the end of the month!"*

---

### 5. Why Revenue Uses an Area Chart vs. Units Sold's Bar Chart
* **Revenue (Smooth Area Chart):** Dealership dollar flow represents continuous financial volume. A gradient area line best visualizes financial momentum, trajectory, and cash flow over time.
* **Units Sold / Test Drives (Vertical Bar Chart):** Car sales and test drives are discrete daily item counts (7 cars, 19 cars, 31 test drives). A vertical bar chart makes discrete daily spikes stand out like tall towers, contrasting the 19-car red bar on Aug 9 against normal 6-car bars.
* **Stock & Capacity (Combo Chart):** Combines volume bars with baseline trend lines for minimum stock requirements.

---

## 🎯 Summary

By following this master guide, you can see how the **Autonomous Data Watcher** transforms 30 rows of raw spreadsheet numbers into an intuitive visual story:
1. It validates dates and metrics automatically.
2. It evaluates statistical surprises using dynamic Z-scores ($Z = +7.34$).
3. It explains flagged incidents in plain English with exact numbers ($+195.04\%$ surge).
4. It visualizes trends with custom charts and red alert indicators.

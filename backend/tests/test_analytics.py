# backend/tests/test_analytics.py
import sys
import os
from pathlib import Path

# Add backend directory to Python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.analytics import run_analysis


def test_core_analytics():
    sample_csv = os.path.join(Path(__file__).resolve().parent.parent.parent, "sample_data", "daily_store_metrics.csv")
    print(f"--- Running Test on Sample File: {sample_csv} ---")

    results = run_analysis(
        file_source=sample_csv,
        filename="daily_store_metrics.csv",
        date_col="date",
        metric_cols=["sales", "waste", "inventory"],
        z_threshold=2.0
    )

    print("\n[FILE INFO]")
    print(f"Total Rows: {results['file_info']['total_rows']}")
    print(f"Date Range: {results['file_info']['start_date']} to {results['file_info']['end_date']}")
    print(f"Total Anomalies Flagged across all metrics: {results['total_anomalies']}")

    print("\n[METRIC SUMMARY]")
    for metric in results["metrics"]:
        print(f"\nMetric: {metric['metric_name'].upper()}")
        print(f"  - Latest Value: {metric['latest_value']}")
        print(f"  - Latest % Delta: {metric['latest_delta_pct']}%")
        print(f"  - Total Anomalies Flagged: {metric['anomaly_count']}")
        
        if metric["anomalies"]:
            print("  - Flagged Anomaly Details:")
            for a in metric["anomalies"]:
                print(f"     * Date: {a['date']} | Value: {a['value']} (Prev: {a['previous_value']}) | Delta: {a['delta_pct']}% | Z-Score: {a['z_score']} ({a['type']})")
        else:
            print("  - No anomalies detected.")

    print("\n--- TEST COMPLETED SUCCESSFULLY ---")


if __name__ == "__main__":
    test_core_analytics()

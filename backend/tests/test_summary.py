# backend/tests/test_summary.py
import sys
import os
from pathlib import Path

# Add backend directory to Python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.analytics import run_analysis
from app.services.summary import generate_executive_summary


def test_narrative_generator():
    sample_csv = os.path.join(Path(__file__).resolve().parent.parent.parent, "sample_data", "daily_store_metrics.csv")
    print(f"--- Testing Summary Generator on Sample File: {sample_csv} ---")

    # Step 1: Run Analytics Engine
    analytics_results = run_analysis(
        file_source=sample_csv,
        filename="daily_store_metrics.csv",
        date_col="date",
        metric_cols=["sales", "waste", "inventory"],
        z_threshold=2.0
    )

    # Step 2: Generate Plain-English Narratives
    summary_payload = generate_executive_summary(analytics_results)

    print("\n[OVERALL EXECUTIVE SUMMARY]")
    print(summary_payload["overall_summary"])

    print(f"\n[ALERT REQUIRED]: {summary_payload['alert_required']}")

    print("\n[INDIVIDUAL METRIC NARRATIVES]")
    for ms in summary_payload["metric_summaries"]:
        print(f"\nMetric: {ms['metric_name'].upper()} (Anomaly Flag: {ms['has_anomaly']})")
        print(f"Narrative: {ms['narrative']}")

    print("\n" + "="*50)
    print("[GENERATED EMAIL PREVIEW]")
    print("="*50)
    print(f"SUBJECT: {summary_payload['email_subject']}\n")
    print(summary_payload["email_body"])
    print("="*50)

    print("\n--- SUMMARY TEST COMPLETED SUCCESSFULLY ---")


if __name__ == "__main__":
    test_narrative_generator()

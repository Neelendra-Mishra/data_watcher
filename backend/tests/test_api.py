# backend/tests/test_api.py
import sys
import os
from pathlib import Path
from fastapi.testclient import TestClient

# Add backend directory to Python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app

client = TestClient(app)


def test_api_endpoints():
    print("--- Testing FastAPI Web Server & REST API Endpoints ---")

    # 1. Test Root Health Endpoint
    response = client.get("/")
    assert response.status_code == 200
    print("[GET /]:", response.json())

    # 2. Test File Upload Endpoint (/api/upload)
    sample_csv_path = os.path.join(Path(__file__).resolve().parent.parent.parent, "sample_data", "daily_store_metrics.csv")
    
    with open(sample_csv_path, "rb") as f:
        response = client.post(
            "/api/upload",
            files={"file": ("daily_store_metrics.csv", f, "text/csv")}
        )
    
    assert response.status_code == 200
    upload_data = response.json()
    print("\n[POST /api/upload Response]:")
    print(f"  - Filename: {upload_data['filename']}")
    print(f"  - Total Rows: {upload_data['total_rows']}")
    print(f"  - Detected Columns: {upload_data['columns']}")
    print(f"  - Sample Preview Rows Returned: {len(upload_data['sample_rows'])}")

    # 3. Test Data Analysis Endpoint (/api/analyze)
    with open(sample_csv_path, "rb") as f:
        response = client.post(
            "/api/analyze",
            files={"file": ("daily_store_metrics.csv", f, "text/csv")},
            data={
                "date_col": "date",
                "metric_cols": "sales,waste,inventory",
                "z_threshold": "2.0"
            }
        )

    assert response.status_code == 200
    analyze_data = response.json()
    print("\n[POST /api/analyze Response]:")
    print(f"  - API Status: {analyze_data['status']}")
    print(f"  - Total Anomalies Detected: {analyze_data['analysis']['total_anomalies']}")
    print(f"  - Overall Summary: {analyze_data['summary']['overall_summary']}")
    print(f"  - Alert Required: {analyze_data['summary']['alert_required']}")

    print("\n--- ALL API ENDPOINT TESTS PASSED SUCCESSFULLY ---")


if __name__ == "__main__":
    test_api_endpoints()

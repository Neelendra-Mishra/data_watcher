from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import List, Optional
import io
import json
import pandas as pd

from app.services.analytics import load_dataset, run_analysis
from app.services.summary import generate_executive_summary

router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Accepts CSV or XLSX file upload, validates extension,
    and returns column headers and a 5-row preview.
    """
    if not file.filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload a .csv or .xlsx file."
        )

    try:
        contents = await file.read()
        file_buffer = io.BytesIO(contents)
        df = load_dataset(file_buffer, file.filename)

        # Replace NaN values for clean JSON output
        df_clean = df.fillna("")
        columns = list(df_clean.columns)
        sample_rows = df_clean.head(5).to_dict(orient="records")

        return {
            "filename": file.filename,
            "total_rows": len(df),
            "columns": columns,
            "sample_rows": sample_rows
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to parse spreadsheet: {str(e)}"
        )


@router.post("/analyze")
async def analyze_data(
    file: UploadFile = File(...),
    date_col: str = Form(...),
    metric_cols: str = Form(...),  # Comma-separated or JSON list
    z_threshold: float = Form(2.0)
):
    """
    Accepts spreadsheet file + user column mappings, runs core analytics & summary engines,
    and returns full JSON analysis payload in-memory.
    """
    if not file.filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload a .csv or .xlsx file."
        )

    clean_date_col = date_col.strip().strip('"').strip("'")

    try:
        if metric_cols.startswith("["):
            raw_metrics = json.loads(metric_cols)
        else:
            raw_metrics = [m.strip().strip('"').strip("'") for m in metric_cols.split(",") if m.strip()]
        
        selected_metrics = [m for m in raw_metrics if m]
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid metric_cols format. Send comma-separated values like 'sales,waste' or a JSON array."
        )

    if not selected_metrics:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one metric column must be selected for analysis."
        )

    try:
        contents = await file.read()
        file_buffer = io.BytesIO(contents)

        # Step 1: Run Statistical Analytics Engine
        analytics_results = run_analysis(
            file_source=file_buffer,
            filename=file.filename,
            date_col=clean_date_col,
            metric_cols=selected_metrics,
            z_threshold=z_threshold
        )

        # Step 2: Run Plain-English Summary Generator
        summary_payload = generate_executive_summary(analytics_results)

        full_payload = {
            "status": "success",
            "analysis": analytics_results,
            "summary": summary_payload
        }

        return full_payload

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during analysis: {str(e)}"
        )

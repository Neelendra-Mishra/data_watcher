import pandas as pd
import numpy as np
from typing import List, Dict, Any, Union
import io


def load_dataset(file_source: Union[str, io.BytesIO], filename: str = "") -> pd.DataFrame:
    """
    Loads CSV or Excel spreadsheet into a Pandas DataFrame.
    """
    if isinstance(file_source, str):
        if file_source.endswith(".csv"):
            return pd.read_csv(file_source)
        elif file_source.endswith((".xlsx", ".xls")):
            return pd.read_excel(file_source)
        else:
            raise ValueError("Unsupported file format. Please upload a .csv or .xlsx file.")
    else:
        # File buffer from web upload
        if filename.endswith(".csv"):
            return pd.read_csv(file_source)
        elif filename.endswith((".xlsx", ".xls")):
            return pd.read_excel(file_source)
        else:
            # Default fallback to CSV
            try:
                return pd.read_csv(file_source)
            except Exception:
                file_source.seek(0)
                return pd.read_excel(file_source)


def run_analysis(
    file_source: Union[str, io.BytesIO],
    filename: str,
    date_col: str,
    metric_cols: List[str],
    z_threshold: float = 2.0,
    window_size: int = 7
) -> Dict[str, Any]:
    """
    Performs data validation, date sorting, period-over-period delta % calculation,
    and rolling Z-Score anomaly detection across user-selected metric columns.
    """
    # 1. Load data
    df = load_dataset(file_source, filename)

    # 2. Validate column existence
    if date_col not in df.columns:
        raise ValueError(f"Date column '{date_col}' not found in file. Available columns: {list(df.columns)}")

    missing_metrics = [m for m in metric_cols if m not in df.columns]
    if missing_metrics:
        raise ValueError(f"Metric column(s) not found: {missing_metrics}")

    # 3. Clean date column and sort
    raw_date_series = df[date_col]
    if pd.api.types.is_numeric_dtype(raw_date_series) and not pd.api.types.is_datetime64_any_dtype(raw_date_series):
        raise ValueError(f"Column '{date_col}' contains numerical data (e.g. {raw_date_series.iloc[0]}), not calendar dates. Please select a valid date/time column.")

    df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
    if df[date_col].isna().all():
        raise ValueError(f"Could not parse dates in column '{date_col}'. Ensure it contains valid date formats.")

    # Check if all dates defaulted to epoch 1970-01-01
    unique_dates = df[date_col].dt.date.unique()
    if len(unique_dates) == 1 and str(unique_dates[0]) == "1970-01-01":
        raise ValueError(f"Column '{date_col}' could not be parsed as real calendar dates. Please select a valid date column.")

    # Drop rows with invalid dates and sort ascending
    df = df.dropna(subset=[date_col]).sort_values(by=date_col).reset_index(drop=True)

    if len(df) < 3:
        raise ValueError("Dataset has too few valid rows (minimum 3 rows required for statistical analysis).")

    # Format date to YYYY-MM-DD string for clean API output
    date_strings = df[date_col].dt.strftime("%Y-%m-%d").tolist()

    analysis_results = {
        "file_info": {
            "filename": filename,
            "total_rows": len(df),
            "start_date": date_strings[0],
            "end_date": date_strings[-1]
        },
        "z_threshold": z_threshold,
        "metrics": []
    }

    total_anomalies_found = 0

    # 4. Process each metric column
    for metric in metric_cols:
        series = pd.to_numeric(df[metric], errors="coerce").fillna(0.0)
        
        # Period-over-period percentage change: ((current - prev) / prev) * 100
        prev_series = series.shift(1)
        delta_pct_series = np.where(
            prev_series != 0,
            ((series - prev_series) / prev_series.abs()) * 100,
            0.0
        )
        delta_pct_series[0] = 0.0  # First element has no previous period

        # Rolling statistics (using shift(1) so current observation doesn't skew baseline)
        rolling_mean_series = series.shift(1).rolling(window=window_size, min_periods=2).mean()
        rolling_std_series = series.shift(1).rolling(window=window_size, min_periods=2).std()

        # Handle early rows where rolling mean/std is NaN (use cumulative stats as fallback)
        expanding_mean = series.shift(1).expanding(min_periods=1).mean()
        expanding_std = series.shift(1).expanding(min_periods=1).std()

        rolling_mean_series = rolling_mean_series.fillna(expanding_mean).fillna(series)
        rolling_std_series = rolling_std_series.fillna(expanding_std).fillna(0.0)

        # Calculate Z-Score: (current_value - rolling_mean) / rolling_std
        z_scores = np.where(
            rolling_std_series > 0,
            (series - rolling_mean_series) / rolling_std_series,
            0.0
        )

        time_series_points = []
        anomalies_list = []

        for i in range(len(df)):
            val = float(series.iloc[i])
            prev_val = float(prev_series.iloc[i]) if i > 0 else val
            delta = float(round(delta_pct_series[i], 2))
            rmean = float(round(rolling_mean_series.iloc[i], 2))
            rstd = float(round(rolling_std_series.iloc[i], 2))
            z_score = float(round(z_scores[i], 2))
            
            # Anomaly condition: |Z-score| >= z_threshold
            is_anomaly = bool(abs(z_score) >= z_threshold)

            point_data = {
                "date": date_strings[i],
                "value": val,
                "previous_value": prev_val,
                "delta_pct": delta,
                "rolling_mean": rmean,
                "rolling_std": rstd,
                "z_score": z_score,
                "is_anomaly": is_anomaly
            }

            time_series_points.append(point_data)

            if is_anomaly:
                total_anomalies_found += 1
                anomalies_list.append({
                    "date": date_strings[i],
                    "metric": metric,
                    "value": val,
                    "previous_value": prev_val,
                    "delta_pct": delta,
                    "rolling_mean": rmean,
                    "rolling_std": rstd,
                    "z_score": z_score,
                    "type": "SPIKE_HIGH" if z_score > 0 else "DROP_LOW"
                })

        metric_summary = {
            "metric_name": metric,
            "latest_value": float(series.iloc[-1]),
            "previous_value": float(series.iloc[-2]) if len(series) > 1 else float(series.iloc[-1]),
            "latest_delta_pct": float(round(delta_pct_series[-1], 2)),
            "latest_z_score": float(round(z_scores[-1], 2)),
            "anomaly_count": len(anomalies_list),
            "anomalies": anomalies_list,
            "time_series": time_series_points
        }

        analysis_results["metrics"].append(metric_summary)

    analysis_results["total_anomalies"] = total_anomalies_found
    return analysis_results

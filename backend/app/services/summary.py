from typing import Dict, Any


def generate_metric_narrative(metric_data: Dict[str, Any]) -> str:
    """
    Generates a plain-English summary for an individual metric.
    """
    metric_name = metric_data["metric_name"].capitalize()
    latest_val = metric_data["latest_value"]
    delta_pct = metric_data["latest_delta_pct"]
    anomalies = metric_data["anomalies"]
    anomaly_count = metric_data["anomaly_count"]

    if anomaly_count == 0:
        return (
            f"The latest {metric_name} value is {latest_val:,.2f} ({delta_pct:+.1f}% change). "
            f"No statistical anomalies were detected, and behavior remains within normal historical expectations."
        )

    # Pick the most severe anomaly (highest absolute Z-score)
    most_severe = max(anomalies, key=lambda x: abs(x["z_score"]))
    a_date = most_severe["date"]
    a_val = most_severe["value"]
    a_delta = most_severe["delta_pct"]
    a_type = most_severe["type"]

    if a_type == "SPIKE_HIGH":
        direction_phrase = "jumped sharply"
        context_phrase = "way higher than what's normal for this metric recently"
    else:
        direction_phrase = "fell sharply"
        context_phrase = "way lower than what's normal for this metric recently"

    return (
        f"WARNING: {metric_name} {direction_phrase} on {a_date} to {a_val:,.0f} ({a_delta:+.1f}% change), "
        f"which is {context_phrase}. Please check for operational issues or input errors during this period."
    )


def generate_executive_summary(analysis_results: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates an executive summary payload combining overall findings
    and individual metric narratives.
    """
    total_anomalies = analysis_results.get("total_anomalies", 0)
    file_info = analysis_results.get("file_info", {})
    filename = file_info.get("filename", "Uploaded Spreadsheet")
    date_range = f"{file_info.get('start_date', '')} to {file_info.get('end_date', '')}"

    metric_narratives = []
    flagged_metrics = []

    for metric in analysis_results.get("metrics", []):
        narrative = generate_metric_narrative(metric)
        metric_narratives.append({
            "metric_name": metric["metric_name"],
            "narrative": narrative,
            "has_anomaly": metric["anomaly_count"] > 0,
            "anomaly_count": metric["anomaly_count"]
        })
        if metric["anomaly_count"] > 0:
            flagged_metrics.append(metric["metric_name"].capitalize())

    # Build top-level Executive Summary (2-3 sentences)
    if total_anomalies == 0:
        overall_narrative = (
            f"Analysis of '{filename}' ({date_range}) completed with no unusual changes found. "
            f"All monitored metrics stayed smoothly within expected daily ranges."
        )
        alert_required = False
    else:
        flagged_list_str = ", ".join(flagged_metrics)
        overall_narrative = (
            f"NOTICE: {total_anomalies} unusual event(s) detected in '{filename}' across: {flagged_list_str}. "
            f"These numbers moved far beyond normal day-to-day changes compared to recent history. "
            f"We recommend reviewing these dates."
        )
        alert_required = True

    return {
        "overall_summary": overall_narrative,
        "alert_required": alert_required,
        "metric_summaries": metric_narratives
    }

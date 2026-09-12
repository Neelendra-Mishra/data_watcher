import React, { useState, useEffect } from 'react';
import { Calendar, BarChart2, Sliders, Play, AlertCircle, HelpCircle } from 'lucide-react';
import axios from 'axios';


// Helper to get distinct Mediterranean Calm color themes for light background
export function getMetricColorTheme(metricName) {
  const name = (metricName || '').toLowerCase();
  if (name.includes('sale') || name.includes('rev') || name.includes('income')) {
    return {
      bg: 'bg-[#667035]/15',
      border: 'border-[#667035]/35',
      text: 'text-[#3E451E]',
      pill: 'bg-[#667035]/20 text-[#303617] border-[#667035]/40',
      chartColor: '#667035', // Deep Olive
      gradientId: 'salesGradient',
      type: 'area'
    };
  }
  if (name.includes('waste') || name.includes('loss') || name.includes('defect') || name.includes('cost')) {
    return {
      bg: 'bg-[#9BA084]/20',
      border: 'border-[#9BA084]/45',
      text: 'text-[#474D34]',
      pill: 'bg-[#9BA084]/30 text-[#333824] border-[#9BA084]/50',
      chartColor: '#9BA084', // Sage Garden
      gradientId: 'wasteGradient',
      type: 'bar'
    };
  }
  if (name.includes('inventory') || name.includes('stock') || name.includes('unit')) {
    return {
      bg: 'bg-[#B6B49C]/25',
      border: 'border-[#B6B49C]/50',
      text: 'text-[#4A4837]',
      pill: 'bg-[#B6B49C]/35 text-[#353426] border-[#B6B49C]/60',
      chartColor: '#B6B49C', // Olive Mist
      gradientId: 'inventoryGradient',
      type: 'combo'
    };
  }
  return {
    bg: 'bg-[#C2856A]/15',
    border: 'border-[#C2856A]/35',
    text: 'text-[#96543A]',
    pill: 'bg-[#C2856A]/20 text-[#82442C] border-[#C2856A]/40',
    chartColor: '#C2856A', // Terracotta Glow
    gradientId: 'defaultGradient',
    type: 'area'
  };
}

export default function ColumnMapping({ uploadedData, onAnalysisComplete }) {
  const [dateCol, setDateCol] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [zThreshold, setZThreshold] = useState(2.0);
  const [showHelpInfo, setShowHelpInfo] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://127.0.0.1:8000/api';


  // Smart Date Column Detection: Filter out numeric metrics from Date dropdown
  const candidateKeywords = ['date', 'time', 'day', 'timestamp', 'month', 'year'];
  const availableDateColumns = uploadedData
    ? uploadedData.columns.filter((col) => {
        const lower = col.toLowerCase();
        // Exclude obvious metric headers like waste, sales, revenue, cost, price, units
        const isNumericHeader = ['waste', 'sales', 'revenue', 'cost', 'price', 'units', 'inventory', 'latency', 'defects', 'returns'].some(
          (k) => lower.includes(k)
        );
        if (isNumericHeader) return false;
        return candidateKeywords.some((k) => lower.includes(k)) || lower.endsWith('date');
      })
    : [];

  useEffect(() => {
    if (uploadedData && uploadedData.columns) {
      if (availableDateColumns.length > 0) {
        setDateCol(availableDateColumns[0]);
      } else {
        setDateCol(uploadedData.columns[0]);
      }

      // Default select numerical non-date columns
      const defaultMetrics = uploadedData.columns.filter((col) => !availableDateColumns.includes(col));
      setSelectedMetrics(defaultMetrics.length > 0 ? defaultMetrics : [uploadedData.columns[1] || uploadedData.columns[0]]);
    }
  }, [uploadedData]);

  const handleMetricToggle = (col) => {
    if (selectedMetrics.includes(col)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== col));
    } else {
      setSelectedMetrics([...selectedMetrics, col]);
    }
  };

  const handleRunAnalysis = async () => {
    if (!dateCol) {
      setError('Please select a date column.');
      return;
    }
    if (selectedMetrics.length === 0) {
      setError('Please select at least one metric to monitor.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', uploadedData.fileObject);
    formData.append('date_col', dateCol);
    formData.append('metric_cols', selectedMetrics.join(','));
    formData.append('z_threshold', zThreshold.toString());

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (onAnalysisComplete) {
        onAnalysisComplete(response.data);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Analysis request failed.';
      setError(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!uploadedData) return null;

  return (
    <div className="clean-card p-8 mt-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#2C3218] tracking-tight">2. Choose what to monitor</h2>
        <p className="text-xs text-[#786C5A] mt-1">Select your timeline column and the metrics to watch.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#DCC8B2]">
          <label className="block text-xs font-bold text-[#667035] uppercase tracking-wider mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C2856A]" />
            <span>Date or Time Column</span>
          </label>
          <select
            value={dateCol}
            onChange={(e) => setDateCol(e.target.value)}
            className="w-full bg-white border border-[#DCC8B2] text-[#2C3218] text-sm rounded-xl p-3 focus:border-[#C2856A] focus:outline-none font-medium shadow-2xs"
          >
            {availableDateColumns.length > 0 ? availableDateColumns.map((col, idx) => (
              <option key={idx} value={col}>
                {col}
              </option>
            )) : uploadedData.columns.map((col, idx) => (
              <option key={idx} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Sensitivity Control */}
        <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#DCC8B2]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label className="block text-xs font-bold text-[#667035] uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C2856A]" />
                <span>Detection Sensitivity</span>
              </label>

              {/* Sensitivity Info Tooltip Button */}
              <div className="relative inline-flex items-center group">
                <button
                  type="button"
                  onClick={() => setShowHelpInfo(!showHelpInfo)}
                  className="w-4 h-4 rounded-full bg-[#E7D9C8] hover:bg-[#C2856A] text-[#667035] hover:text-white flex items-center justify-center text-[10px] font-bold border border-[#DCC8B2] transition-colors cursor-pointer shadow-2xs"
                  aria-label="Sensitivity Help"
                >
                  ?
                </button>

                {/* Clean Floating Tooltip Box */}
                {showHelpInfo && (
                  <div className="absolute left-0 top-6 z-30 w-72 p-3 bg-[#2C3218] text-white text-xs rounded-xl shadow-xl border border-[#DCC8B2]/40 pointer-events-none transition-all">
                    <p className="font-bold text-[#E7D9C8] mb-1">How Sensitivity Works:</p>
                    <p className="text-slate-200 leading-relaxed font-normal">
                      <strong>Low Sensitivity (left)</strong> flags major spikes & emergency drops only.<br />
                      <strong>High Sensitivity (right)</strong> flags smaller variations & subtle changes.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <span className="text-xs font-bold text-[#667035] bg-[#E7D9C8]/60 px-2.5 py-1 rounded-lg border border-[#DCC8B2]">
              {zThreshold <= 1.5 ? 'High Sensitivity' : zThreshold >= 3.0 ? 'Low Sensitivity' : 'Standard'}
            </span>
          </div>

          <input
            type="range"
            min="1.0"
            max="4.0"
            step="0.1"
            value={5.0 - zThreshold}
            onChange={(e) => setZThreshold(parseFloat((5.0 - parseFloat(e.target.value)).toFixed(1)))}
            className="w-full h-2 bg-[#DCC8B2]/60 rounded-lg appearance-none cursor-pointer accent-[#C2856A] mt-2"
          />
          <div className="flex justify-between text-xs text-[#786C5A] mt-2 font-semibold">
            <span>Low Sensitivity</span>
            <span>High Sensitivity</span>
          </div>
        </div>

      </div>

      {/* Metrics Choice */}
      <div className="mt-6 bg-[#FAF6F0] p-5 rounded-2xl border border-[#DCC8B2]">
        <label className="block text-xs font-bold text-[#667035] uppercase tracking-wider mb-3 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#C2856A]" />
          <span>Select Metrics & Color Themes</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {uploadedData.columns
            .filter((col) => col !== dateCol)
            .map((col, idx) => {
              const isChecked = selectedMetrics.includes(col);
              const theme = getMetricColorTheme(col);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleMetricToggle(col)}
                  className={`flex items-center space-x-3 p-3 rounded-xl border text-sm font-bold transition-all ${isChecked
                      ? `${theme.bg} ${theme.border} ${theme.text} shadow-2xs`
                      : 'bg-white border-[#DCC8B2] text-[#786C5A] hover:border-[#C2856A]/60'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => { }}
                    className="rounded border-[#DCC8B2] text-[#C2856A] focus:ring-0 cursor-pointer accent-[#C2856A]"
                  />
                  <span className="truncate">{col}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary CTA Button */}
      <button
        onClick={handleRunAnalysis}
        disabled={analyzing}
        className="mt-6 w-full py-4 bg-[#C2856A] hover:bg-[#A86F55] text-white text-sm font-bold rounded-xl shadow-md shadow-[#C2856A]/25 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
      >
        {analyzing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Analyzing data for unusual patterns...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Scan for Unexpected Changes</span>
          </>
        )}
      </button>
    </div>
  );
}

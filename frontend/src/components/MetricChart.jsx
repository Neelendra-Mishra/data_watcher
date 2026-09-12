import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Info, Activity } from 'lucide-react';
import { getMetricColorTheme } from './ColumnMapping';

// Crisp Warm Red Anomaly Dot marker standing out against earthy palette
const CustomAnomalyDot = (props) => {
  const { cx, cy, payload } = props;
  if (payload && payload.is_anomaly) {
    return (
      <g key={`dot-${payload.date}`}>
        <circle cx={cx} cy={cy} r={7} fill="#D32F2F" fillOpacity={0.25} />
        <circle cx={cx} cy={cy} r={5} fill="#D32F2F" stroke="#ffffff" strokeWidth={2} />
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={3} fill="#667035" />;
};

export default function MetricChart({ metricData, narrativeInfo }) {
  if (!metricData) return null;

  const { metric_name, latest_value, latest_delta_pct, anomaly_count, time_series } = metricData;
  const isUp = latest_delta_pct >= 0;

  // Get distinct color palette and chart type for this metric
  const theme = getMetricColorTheme(metric_name);
  const chartType = theme.type;

  const tooltipStyle = {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCC8B2',
    borderRadius: '0.75rem',
    fontSize: '12px',
    color: '#2C3218',
    boxShadow: '0 4px 20px -2px rgba(102, 112, 53, 0.15)'
  };

  return (
    <div className="clean-card p-6 space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#DCC8B2]/60">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl border ${theme.bg} ${theme.border} ${theme.text}`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-[#2C3218] uppercase tracking-wide">{metric_name}</h3>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase border ${theme.pill}`}>
                {chartType === 'area' ? 'Area Trend' : chartType === 'bar' ? 'Bar Totals' : 'Combo View'}
              </span>
              {anomaly_count > 0 && (
                <span className="px-2.5 py-0.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  {anomaly_count} Flagged Event(s)
                </span>
              )}
            </div>
            <p className="text-xs text-[#786C5A] mt-0.5">Time-Series Trajectory & Baseline Comparison</p>
          </div>
        </div>

        {/* Clean Latest Value Card */}
        <div className="bg-[#FAF6F0] px-4 py-2.5 rounded-xl border border-[#DCC8B2] shadow-2xs">
          <p className="text-[10px] text-[#786C5A] font-semibold uppercase">Latest Value</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-base font-extrabold text-[#2C3218] font-mono">{latest_value.toLocaleString()}</p>
            <div
              className={`flex items-center text-xs font-bold ${
                isUp ? 'text-[#667035]' : 'text-[#D32F2F]'
              }`}
            >
              {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              <span>{latest_delta_pct > 0 ? `+${latest_delta_pct}%` : `${latest_delta_pct}%`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Info Box */}
      {narrativeInfo && (
        <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#DCC8B2] text-xs text-[#2C3218] flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-[#C2856A] shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">{narrativeInfo.narrative}</p>
        </div>
      )}

      {/* Dynamic Render based on Chart Type */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            /* 1. AREA CHART */
            <AreaChart data={time_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={theme.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.chartColor} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={theme.chartColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAE5DD" vertical={false} />
              <XAxis dataKey="date" stroke="#8C8275" fontSize={11} tickLine={false} />
              <YAxis stroke="#8C8275" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#6B6055' }} />
              <Line
                type="monotone"
                dataKey="rolling_mean"
                name="Expected Baseline"
                stroke="#A39888"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="value"
                name={`${metric_name} Trend`}
                stroke={theme.chartColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${theme.gradientId})`}
                dot={<CustomAnomalyDot />}
              />
            </AreaChart>
          ) : chartType === 'bar' ? (
            /* 2. BAR CHART */
            <BarChart data={time_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAE5DD" vertical={false} />
              <XAxis dataKey="date" stroke="#8C8275" fontSize={11} tickLine={false} />
              <YAxis stroke="#8C8275" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#6B6055' }} />
              <Line
                type="monotone"
                dataKey="rolling_mean"
                name="Expected Baseline"
                stroke="#A39888"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
              />
              <Bar dataKey="value" name={`${metric_name} Total`} radius={[4, 4, 0, 0]}>
                {time_series.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.is_anomaly ? '#D32F2F' : theme.chartColor}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            /* 3. COMBO CHART */
            <ComposedChart data={time_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAE5DD" vertical={false} />
              <XAxis dataKey="date" stroke="#8C8275" fontSize={11} tickLine={false} />
              <YAxis stroke="#8C8275" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#6B6055' }} />
              <Bar dataKey="value" name={`${metric_name} Actual`} radius={[4, 4, 0, 0]}>
                {time_series.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.is_anomaly ? '#D32F2F' : theme.chartColor}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="rolling_mean"
                name="Expected Baseline"
                stroke="#786C5A"
                strokeWidth={2}
                dot={<CustomAnomalyDot />}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}



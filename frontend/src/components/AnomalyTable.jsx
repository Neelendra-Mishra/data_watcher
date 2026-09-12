import React, { useState } from 'react';
import { AlertOctagon, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { getMetricColorTheme } from './ColumnMapping';

export default function AnomalyTable({ metrics }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  if (!metrics) return null;

  const allAnomalies = [];
  metrics.forEach((m) => {
    if (m.anomalies && m.anomalies.length > 0) {
      allAnomalies.push(...m.anomalies);
    }
  });

  if (allAnomalies.length === 0) return null;

  return (
    <div className="clean-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#2C3218] flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-600" />
            <span>Flagged Incident List</span>
          </h3>
          <p className="text-xs text-[#786C5A]">Dates and metrics that experienced unusually large changes.</p>
        </div>
        <span className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg shadow-2xs">
          {allAnomalies.length} Flagged Events
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#DCC8B2] bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF6F0] text-[#38401C] font-semibold border-b border-[#DCC8B2] uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Date</th>
              
              {/* Observed Value Header */}
              <th className="px-4 py-3">
                <div className="flex items-center gap-1.5 relative group">
                  <span>Observed Value</span>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveTooltip('observed')}
                    onMouseLeave={() => setActiveTooltip(null)}
                    onClick={() => setActiveTooltip(activeTooltip === 'observed' ? null : 'observed')}
                    className="w-3.5 h-3.5 rounded-full bg-[#E7D9C8] hover:bg-[#C2856A] text-[#667035] hover:text-white flex items-center justify-center text-[9px] font-bold border border-[#DCC8B2] transition-colors cursor-pointer"
                  >
                    ?
                  </button>
                  {activeTooltip === 'observed' && (
                    <div className="absolute left-0 top-7 z-30 w-64 p-3 bg-[#2C3218] text-white text-xs rounded-xl shadow-xl border border-[#DCC8B2]/40 normal-case font-sans">
                      <p className="font-bold text-[#E7D9C8] mb-1">Observed Value:</p>
                      <p className="text-slate-200 leading-relaxed text-[11px]">
                        The raw ground truth number recorded in your spreadsheet on that specific date.
                      </p>
                    </div>
                  )}
                </div>
              </th>

              {/* Previous Value Header */}
              <th className="px-4 py-3">
                <div className="flex items-center gap-1.5 relative group">
                  <span>Previous Value</span>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveTooltip('previous')}
                    onMouseLeave={() => setActiveTooltip(null)}
                    onClick={() => setActiveTooltip(activeTooltip === 'previous' ? null : 'previous')}
                    className="w-3.5 h-3.5 rounded-full bg-[#E7D9C8] hover:bg-[#C2856A] text-[#667035] hover:text-white flex items-center justify-center text-[9px] font-bold border border-[#DCC8B2] transition-colors cursor-pointer"
                  >
                    ?
                  </button>
                  {activeTooltip === 'previous' && (
                    <div className="absolute left-0 top-7 z-30 w-64 p-3 bg-[#2C3218] text-white text-xs rounded-xl shadow-xl border border-[#DCC8B2]/40 normal-case font-sans">
                      <p className="font-bold text-[#E7D9C8] mb-1">Previous Value:</p>
                      <p className="text-slate-200 leading-relaxed text-[11px]">
                        Yesterday's recorded value used as a benchmark to compare today's number against.
                      </p>
                    </div>
                  )}
                </div>
              </th>

              {/* % Change Header */}
              <th className="px-4 py-3">
                <div className="flex items-center gap-1.5 relative group">
                  <span>% Change</span>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveTooltip('pct')}
                    onMouseLeave={() => setActiveTooltip(null)}
                    onClick={() => setActiveTooltip(activeTooltip === 'pct' ? null : 'pct')}
                    className="w-3.5 h-3.5 rounded-full bg-[#E7D9C8] hover:bg-[#C2856A] text-[#667035] hover:text-white flex items-center justify-center text-[9px] font-bold border border-[#DCC8B2] transition-colors cursor-pointer shadow-2xs"
                  >
                    ?
                  </button>
                  {activeTooltip === 'pct' && (
                    <div className="absolute left-0 top-7 z-30 w-72 p-3 bg-[#2C3218] text-white text-xs rounded-xl shadow-xl border border-[#DCC8B2]/40 normal-case font-sans">
                      <p className="font-bold text-[#E7D9C8] mb-1">Why % Change is Included:</p>
                      <p className="text-slate-200 leading-relaxed text-[11px]">
                        Turns two raw numbers (Today vs Yesterday) into one simple, relatable measure of <strong>how much the metric moved</strong>.
                      </p>
                      <p className="text-[#DCC8B2] text-[10px] font-mono mt-1 pt-1 border-t border-slate-600">
                        Formula: ((Today - Yesterday) ÷ Yesterday) × 100
                      </p>
                    </div>
                  )}
                </div>
              </th>

              {/* Incident Type Header */}
              <th className="px-4 py-3">
                <div className="flex items-center gap-1.5 relative group">
                  <span>Incident Type</span>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveTooltip('incident')}
                    onMouseLeave={() => setActiveTooltip(null)}
                    onClick={() => setActiveTooltip(activeTooltip === 'incident' ? null : 'incident')}
                    className="w-3.5 h-3.5 rounded-full bg-[#E7D9C8] hover:bg-[#C2856A] text-[#667035] hover:text-white flex items-center justify-center text-[9px] font-bold border border-[#DCC8B2] transition-colors cursor-pointer"
                  >
                    ?
                  </button>
                  {activeTooltip === 'incident' && (
                    <div className="absolute right-0 top-7 z-30 w-72 p-3 bg-[#2C3218] text-white text-xs rounded-xl shadow-xl border border-[#DCC8B2]/40 normal-case font-sans">
                      <p className="font-bold text-[#E7D9C8] mb-1">Incident Badges:</p>
                      <p className="text-slate-200 leading-relaxed text-[11px]">
                        <strong className="text-emerald-400">SPIKE HIGH:</strong> Number jumped far above expected weekly bounce.<br />
                        <strong className="text-red-400">DROP LOW:</strong> Number plunged far below expected weekly bounce.
                      </p>
                    </div>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7D9C8]/40 text-[#2C3218] font-medium">
            {allAnomalies.map((item, idx) => {
              const isHigh = item.type === 'SPIKE_HIGH';
              const theme = getMetricColorTheme(item.metric);

              return (
                <tr key={idx} className="hover:bg-[#FAF7F2] transition-colors font-mono">
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border uppercase tracking-wider ${theme.pill}`}>
                      {item.metric}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#786C5A] font-sans">{item.date}</td>
                  <td className="px-4 py-3 font-bold text-[#2C3218]">{item.value.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[#786C5A]">{item.previous_value.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center space-x-1 font-bold ${
                        item.delta_pct >= 0 ? 'text-[#667035]' : 'text-red-600'
                      }`}
                    >
                      {item.delta_pct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{item.delta_pct > 0 ? `+${item.delta_pct}%` : `${item.delta_pct}%`}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative inline-block group">
                      <span
                        onMouseEnter={() => setActiveTooltip(`row-${idx}`)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        onClick={() => setActiveTooltip(activeTooltip === `row-${idx}` ? null : `row-${idx}`)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase border cursor-help ${
                          isHigh
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200'
                        } transition-colors`}
                      >
                        {isHigh ? 'Spike High' : 'Drop Low'}
                      </span>
                      {activeTooltip === `row-${idx}` && (
                        <div className="absolute right-0 top-7 z-30 w-72 p-3 bg-[#2C3218] text-white text-xs rounded-xl shadow-xl border border-[#DCC8B2]/40 normal-case font-sans">
                          <p className="font-bold text-[#E7D9C8] mb-1">Decision Logic for This Flag:</p>
                          <p className="text-slate-200 leading-relaxed text-[11px]">
                            Value (<strong>{item.value.toLocaleString()}</strong>) was far outside the expected 7-day average (<strong>{item.rolling_mean ? item.rolling_mean.toLocaleString() : 'N/A'}</strong>).
                          </p>
                          <p className="text-[#DCC8B2] text-[10px] font-mono mt-1.5 pt-1.5 border-t border-slate-600">
                            Calculated Z-Score: <strong>{item.z_score ? (item.z_score > 0 ? `+${item.z_score}` : item.z_score) : 'N/A'}</strong> (Breached threshold)
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}




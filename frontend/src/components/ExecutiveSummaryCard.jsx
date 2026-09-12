import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function ExecutiveSummaryCard({ analysisPayload }) {
  if (!analysisPayload) return null;

  const { analysis, summary, email } = analysisPayload;
  const totalAnomalies = analysis.total_anomalies;
  const isCritical = totalAnomalies > 0;

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <div
        className={`clean-card p-6 border-l-4 ${
          isCritical
            ? 'border-l-[#D32F2F] bg-red-50/50'
            : 'border-l-[#667035] bg-[#9BA084]/10'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3.5">
            {isCritical ? (
              <div className="p-3 bg-red-100 text-red-700 rounded-2xl border border-red-200">
                <ShieldAlert className="w-6 h-6" />
              </div>
            ) : (
              <div className="p-3 bg-[#667035]/15 text-[#667035] rounded-2xl border border-[#667035]/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-md uppercase tracking-wider ${
                    isCritical
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-[#667035]/15 text-[#4E5627] border border-[#667035]/30'
                  }`}
                >
                  {isCritical ? 'Attention Required' : 'Status: Normal'}
                </span>
                <span className="text-xs text-[#786C5A]">• {analysis.file_info.filename}</span>
              </div>
              <h2 className="text-xl font-bold text-[#2C3218] mt-1">Summary Findings</h2>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-medium">
            <div className="px-3 py-1.5 bg-[#FAF6F0] border border-[#DCC8B2] rounded-xl text-[#6B6055]">
              Rows analyzed: <span className="font-bold text-[#2C3218]">{analysis.file_info.total_rows}</span>
            </div>
            <div
              className={`px-3 py-1.5 border rounded-xl font-bold ${
                isCritical
                  ? 'bg-red-100 border-red-200 text-red-800'
                  : 'bg-[#667035]/15 border-[#667035]/30 text-[#4E5627]'
              }`}
            >
              Unusual events: {totalAnomalies}
            </div>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#DCC8B2] text-sm text-[#2C3218] leading-relaxed font-medium">
          {summary.overall_summary}
        </div>
      </div>
    </div>
  );
}



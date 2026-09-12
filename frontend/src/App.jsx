import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import ColumnMapping from './components/ColumnMapping';
import ExecutiveSummaryCard from './components/ExecutiveSummaryCard';
import MetricChart from './components/MetricChart';
import AnomalyTable from './components/AnomalyTable';
import DocsTab from './components/DocsTab';
import ScrollToTop from './components/ScrollToTop';
import { RotateCcw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadedData, setUploadedData] = useState(null);
  const [analysisPayload, setAnalysisPayload] = useState(null);

  const handleUploadSuccess = (data) => {
    setUploadedData(data);
    setAnalysisPayload(null);
  };

  const handleAnalysisComplete = (payload) => {
    setAnalysisPayload(payload);
  };

  const handleReset = () => {
    setUploadedData(null);
    setAnalysisPayload(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex flex-col font-sans relative">
      {/* Scroll-aware Auto-Hiding Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container with pt-20 padding top for fixed navbar */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 pt-20 pb-12 space-y-8">
        {activeTab === 'dashboard' ? (
          <>
            {/* Start Over Button */}
            {uploadedData && (
              <div className="flex justify-end">
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-[#FAF6F0] hover:bg-[#E7D9C8]/60 border border-[#DCC8B2] text-[#667035] text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Upload Another Spreadsheet</span>
                </button>
              </div>
            )}

            {/* Step 1: File Upload Component */}
            <FileUpload onUploadSuccess={handleUploadSuccess} uploadedData={uploadedData} />


            {/* Step 2: Guided Column Mapping Component */}
            {uploadedData && (
              <ColumnMapping
                uploadedData={uploadedData}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}

            {/* Step 3: Analysis Results, Dashboard Cards & Charts */}
            {analysisPayload && (
              <div className="space-y-8 border-t border-[#DCC8B2]/60 pt-8">
                {/* Executive Summary Findings */}
                <ExecutiveSummaryCard analysisPayload={analysisPayload} />

                {/* Flagged Incidents List */}
                <AnomalyTable metrics={analysisPayload.analysis.metrics} />

                {/* Metric Time-Series Charts */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#2C3218] tracking-tight">Metric Trends & Anomaly Markers</h3>
                    <p className="text-xs text-[#786C5A] mt-1">Line, Bar, and Combo charts comparing values against baseline averages.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {analysisPayload.analysis.metrics.map((m, idx) => {
                      const narrativeInfo = analysisPayload.summary.metric_summaries.find(
                        (ns) => ns.metric_name === m.metric_name
                      );
                      return (
                        <MetricChart
                          key={idx}
                          metricData={m}
                          narrativeInfo={narrativeInfo}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <DocsTab />
        )}
      </main>

      {/* Floating Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}




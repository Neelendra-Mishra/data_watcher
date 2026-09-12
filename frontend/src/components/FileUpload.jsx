import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function FileUpload({ onUploadSuccess, uploadedData: uploadedDataProp }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState('');

  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    if (!uploadedDataProp) {
      setUploadedData(null);
      setSelectedPreset('');
    }
  }, [uploadedDataProp]);

  const handleFileUpload = async (file, presetKey = '') => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadedData({ ...response.data, fileObject: file });
      setSelectedPreset(presetKey);
      if (onUploadSuccess) {
        onUploadSuccess({ ...response.data, fileObject: file });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Could not read file. Ensure FastAPI backend is running.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], '');
    }
  };

  const SAMPLE_DATASETS = {
    car_sales: {
      filename: 'car_sales.csv',
      label: 'Car Sales Metrics (car_sales.csv)',
      content: `date,brand,fuel_type,units_sold,revenue,test_drives
2026-08-01,Honda,Hybrid,7,161700,15
2026-08-02,Hyundai,Diesel,7,158193,13
2026-08-03,Kia,Diesel,4,82228,16
2026-08-04,Kia,Hybrid,4,84372,14
2026-08-05,Honda,Petrol,7,155162,18
2026-08-06,Toyota,Electric,8,180296,12
2026-08-07,Nissan,Electric,4,84536,12
2026-08-08,Toyota,Petrol,7,148113,19
2026-08-09,Nissan,Electric,19,437000,13
2026-08-10,Honda,Petrol,7,150234,12
2026-08-11,Honda,Diesel,8,187912,12
2026-08-12,Toyota,Hybrid,8,176712,14
2026-08-13,Ford,Diesel,8,177416,15
2026-08-14,Ford,Hybrid,8,176640,16
2026-08-15,Hyundai,Hybrid,6,123654,12
2026-08-16,Honda,Hybrid,1,90052,12
2026-08-17,Kia,Diesel,8,183952,16
2026-08-18,Kia,Petrol,5,116210,13
2026-08-19,Nissan,Electric,6,131514,15
2026-08-20,Honda,Petrol,5,103840,13
2026-08-21,Hyundai,Electric,5,116495,31
2026-08-22,Nissan,Diesel,7,148176,11
2026-08-23,Ford,Hybrid,8,176304,14
2026-08-24,Honda,Diesel,8,166264,18
2026-08-25,Hyundai,Hybrid,4,86716,11
2026-08-26,Ford,Electric,4,178872,14
2026-08-27,Honda,Hybrid,4,87536,13
2026-08-28,Honda,Hybrid,4,86132,13
2026-08-29,Nissan,Hybrid,4,85472,16
2026-08-30,Honda,Electric,8,177960,18`
    }
  };

  const loadSampleDatasetKey = async (key = 'car_sales') => {
    const ds = SAMPLE_DATASETS[key];
    if (!ds) return;
    setLoading(true);
    setError(null);
    try {
      const blob = new Blob([ds.content], { type: 'text/csv' });
      const sampleFile = new File([blob], ds.filename, { type: 'text/csv' });
      await handleFileUpload(sampleFile, key);
    } catch (err) {
      setError(`Failed to load ${ds.label}.`);
    }
  };

  return (
    <div className="clean-card p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#2C3218] tracking-tight">1. Select your spreadsheet</h2>
          <p className="text-xs text-[#786C5A] mt-1">Upload an Excel (.xlsx) or CSV file containing your operational data.</p>
        </div>

        {/* Single Sample Dataset Button */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => loadSampleDatasetKey('car_sales')}
            disabled={loading}
            className="bg-[#C2856A] hover:bg-[#A86F55] text-white text-xs font-bold rounded-xl px-4 py-2.5 cursor-pointer shadow-md shadow-[#C2856A]/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Sample Dataset (car_sales.csv)</span>
          </button>
        </div>
      </div>



      {/* Dropzone Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-[#C2856A] bg-[#E7D9C8]/40'
            : 'border-[#DCC8B2] hover:border-[#C2856A] bg-[#FAF6F0]/80'
        }`}
      >
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => handleFileUpload(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3.5 bg-[#C2856A]/15 rounded-2xl text-[#C2856A] border border-[#C2856A]/30">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2C3218]">
              Drag and drop your file here, or <span className="text-[#C2856A] font-bold hover:underline">browse files</span>
            </p>
            <p className="text-xs text-[#786C5A] mt-1">Supports CSV and XLSX spreadsheets</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-4 p-4 bg-[#FAF6F0] border border-[#DCC8B2] rounded-xl flex items-center justify-center space-x-3 text-[#667035] text-xs font-medium">
          <div className="w-4 h-4 border-2 border-[#C2856A] border-t-transparent rounded-full animate-spin"></div>
          <span>Parsing spreadsheet headers and previewing rows...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Data Table Preview */}
      {uploadedData && !loading && (
        <div className="mt-6 border-t border-[#DCC8B2]/60 pt-6">
          <div className="flex items-center justify-between bg-[#9BA084]/15 border border-[#9BA084]/30 p-4 rounded-xl mb-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-[#667035]" />
              <div>
                <p className="text-sm font-bold text-[#2C3218]">{uploadedData.filename}</p>
                <p className="text-xs text-[#667035] font-medium">
                  {uploadedData.total_rows} rows loaded • {uploadedData.columns.length} columns detected
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#667035] text-white text-xs font-bold rounded-lg shadow-2xs">
              File Ready
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#DCC8B2] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E7D9C8]/50 text-[#38401C] font-bold border-b border-[#DCC8B2]">
                <tr>
                  {uploadedData.columns.map((col, idx) => (
                    <th key={idx} className="px-4 py-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7D9C8]/40 text-[#2C3218] font-mono">
                {uploadedData.sample_rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#F7F4EF]">
                    {uploadedData.columns.map((col, cIdx) => (
                      <td key={cIdx} className="px-4 py-2.5">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


/**
 * BulkUpload.jsx
 * 
 * Admin page for bulk uploading data via CSV or JSON files.
 * Supports three entity types: Equipment, Detergents, Rules.
 * Features:
 * - Tabbed interface for each entity type
 * - File selection (CSV or JSON)
 * - Format selector
 * - Preview of first few rows (for CSV/JSON)
 * - Upload progress and result summary (success count, errors)
 * - Uses adminService upload methods
 */

import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Trash2,
  Eye,
  ChevronRight,
  Database,
  FlaskConical,
  Gavel
} from 'lucide-react';
import { 
  uploadEquipment, 
  uploadDetergents, 
  uploadRules 
} from '../../../services/adminService';

const TABS = [
  { id: 'equipment', label: 'Equipment', icon: Database },
  { id: 'detergents', label: 'Detergents', icon: FlaskConical },
  { id: 'rules', label: 'Rules', icon: Gavel },
];

export const BulkUpload = () => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('csv');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setPreviewData(null);
      return;
    }
    setFile(selectedFile);
    setResult(null);
    setError(null);
    // Preview file content (first few rows)
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      if (format === 'csv') {
        // Simple CSV preview: split lines and take first 5 rows
        const lines = content.split(/\r?\n/).slice(0, 6);
        const headers = lines[0]?.split(',') || [];
        const rows = lines.slice(1).filter(r => r.trim()).map(r => r.split(','));
        setPreviewData({ headers, rows });
      } else {
        // JSON preview
        try {
          const json = JSON.parse(content);
          const preview = Array.isArray(json) ? json.slice(0, 5) : [json];
          setPreviewData({ json: preview });
        } catch (err) {
          setPreviewData({ error: 'Invalid JSON format' });
        }
      }
    };
    reader.readAsText(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewData(null);
    setResult(null);
    setError(null);
    document.getElementById('file-input').value = '';
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      let response;
      switch (activeTab) {
        case 'equipment':
          response = await uploadEquipment(file, format);
          break;
        case 'detergents':
          response = await uploadDetergents(file, format);
          break;
        case 'rules':
          response = await uploadRules(file, format);
          break;
        default:
          throw new Error('Invalid tab');
      }
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const renderPreview = () => {
    if (!previewData) return null;
    if (previewData.error) {
      return (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {previewData.error}
        </div>
      );
    }
    if (format === 'csv' && previewData.headers) {
      return (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Preview (first 5 rows)</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-100">
                <tr>
                  {previewData.headers.map((h, idx) => (
                    <th key={idx} className="px-2 py-1 border text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.rows.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cidx) => (
                      <td key={cidx} className="px-2 py-1 border">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (format === 'json' && previewData.json) {
      return (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Preview (first 5 items)</h4>
          <pre className="bg-slate-50 rounded-xl p-3 text-xs font-mono overflow-x-auto border border-slate-200">
            {JSON.stringify(previewData.json, null, 2)}
          </pre>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Bulk Upload
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload CSV or JSON files to import equipment, detergents, or rules in bulk.
        </p>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mt-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                clearFile();
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* File upload area */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select File</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="file-input"
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            <select
              value={format}
              onChange={(e) => {
                setFormat(e.target.value);
                clearFile();
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            >
              <option value="csv">CSV Format</option>
              <option value="json">JSON Format</option>
            </select>
          </div>
        </div>

        {/* Format hints */}
        <div className="mt-2 text-xs text-slate-400">
          {activeTab === 'equipment' && (
            <p>CSV headers: name, brand, category, intensity, domain, price_ugx, spare_part_lead_time_days, power_kw, power_type, motor_type, noise_level_db, compatible_surfaces (comma‑separated), compatible_dirt_types, materials, in_stock</p>
          )}
          {activeTab === 'detergents' && (
            <p>CSV headers: name, brand, category, intensity, domain, ph, dilution_ratio, compatible_surfaces, compatible_dirt_types, eco_certified, hazard_alerts, price_ugx, package_size_liters, in_stock</p>
          )}
          {activeTab === 'rules' && (
            <p>CSV headers: rule_id, condition (JSON string), action_type, action_message, action_factor, priority, category, active</p>
          )}
        </div>

        {/* Preview */}
        {renderPreview()}

        {/* Upload button */}
        {file && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={clearFile}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-70"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        )}

        {/* Result display */}
        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <CheckCircle className="w-5 h-5" /> Upload Successful
            </div>
            <div className="mt-2 text-sm text-green-700">
              <p>Inserted: {result.insertedCount || result.inserted || 0}</p>
              {result.errors && result.errors.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-amber-700">Errors ({result.errors.length})</summary>
                  <pre className="mt-2 p-2 bg-white rounded text-xs overflow-x-auto">
                    {JSON.stringify(result.errors, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="text-red-700 text-sm">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};
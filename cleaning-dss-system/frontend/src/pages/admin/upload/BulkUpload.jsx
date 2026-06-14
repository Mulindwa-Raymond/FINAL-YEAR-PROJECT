/**
 * BulkUpload.jsx
 * 
 * Admin page for bulk uploading data via CSV, JSON, or Excel files.
 * Supports three entity types: Equipment, Detergents, Rules.
 */

import React, { useState, useCallback } from 'react';
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
  Gavel,
  FileSpreadsheet,
  FileJson,
  FileCode,
  Loader2,
  Download,
  Table
} from 'lucide-react';
import { 
  uploadEquipment, 
  uploadDetergents, 
  uploadRules 
} from '../../../services/adminService';

const TABS = [
  { id: 'equipment', label: 'Equipment', icon: Database, color: 'blue' },
  { id: 'detergents', label: 'Detergents', icon: FlaskConical, color: 'cyan' },
  { id: 'rules', label: 'Rules', icon: Gavel, color: 'purple' },
];

const FORMATS = [
  { value: 'csv', label: 'CSV', icon: <FileCode size={14} />, extension: '.csv' },
  { value: 'json', label: 'JSON', icon: <FileJson size={14} />, extension: '.json' },
  { value: 'excel', label: 'Excel (.xlsx, .xls)', icon: <FileSpreadsheet size={14} />, extension: '.xlsx,.xls' },
  { value: 'auto', label: 'Auto-detect', icon: <Table size={14} />, extension: '*' },
];

export const BulkUpload = () => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('auto');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

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
    
    // Preview file content
    previewFile(selectedFile);
  };

  const previewFile = async (selectedFile) => {
    setPreviewLoading(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target.result;
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      
      try {
        if (ext === 'csv') {
          // Simple CSV preview
          const lines = content.split(/\r?\n/).slice(0, 6);
          const headers = lines[0]?.split(',') || [];
          const rows = lines.slice(1).filter(r => r.trim()).map(r => r.split(','));
          setPreviewData({ type: 'csv', headers, rows, totalRows: lines.length - 1 });
        } else if (ext === 'json') {
          const json = JSON.parse(content);
          const preview = Array.isArray(json) ? json.slice(0, 5) : [json];
          setPreviewData({ 
            type: 'json', 
            data: preview, 
            totalRows: Array.isArray(json) ? json.length : 1 
          });
        } else if (ext === 'xlsx' || ext === 'xls') {
          setPreviewData({ 
            type: 'excel', 
            message: 'Excel file selected. Preview will be shown after upload.',
            fileName: selectedFile.name
          });
        } else {
          setPreviewData({ type: 'unknown', error: 'Unsupported file type' });
        }
      } catch (err) {
        setPreviewData({ error: 'Invalid file format: ' + err.message });
      } finally {
        setPreviewLoading(false);
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
      console.error('Upload error:', err);
      setError(err.response?.data?.error || err.message || 'Upload failed. Please check your file format.');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    let templateData = [];
    let filename = '';
    let headers = [];
    
    switch (activeTab) {
      case 'equipment':
        headers = ['name', 'brand', 'category', 'subtype', 'intensity', 'domain', 'price_ugx', 'power_source', 'in_stock'];
        templateData = [headers];
        filename = 'equipment_template.csv';
        break;
      case 'detergents':
        headers = ['product_name', 'brand_name', 'form', 'detergent_category', 'intensity', 'domain', 'ph_value', 'unit_size', 'requires_ppe', 'current_price_ugx'];
        templateData = [headers];
        filename = 'detergents_template.csv';
        break;
      case 'rules':
        headers = ['rule_id', 'rule_text', 'category', 'priority', 'conditions', 'action_type', 'action_message'];
        templateData = [headers];
        filename = 'rules_template.csv';
        break;
    }
    
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderPreview = () => {
    if (!previewData) return null;
    
    if (previewData.error) {
      return (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 inline mr-2" />
          {previewData.error}
        </div>
      );
    }
    
    if (previewData.type === 'excel') {
      return (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
          <FileSpreadsheet className="w-4 h-4 inline mr-2" />
          {previewData.message}
          <div className="text-xs text-blue-500 mt-2">
            File: {previewData.fileName}
          </div>
        </div>
      );
    }
    
    if (previewData.type === 'csv' && previewData.headers) {
      return (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-700">Preview (first 5 rows)</h4>
            <span className="text-xs text-slate-400">Total rows: {previewData.totalRows}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-100">
                <tr>
                  {previewData.headers.map((h, idx) => (
                    <th key={idx} className="px-2 py-1 border text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.rows.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cidx) => (
                      <td key={cidx} className="px-2 py-1 border text-slate-600">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    if (previewData.type === 'json' && previewData.data) {
      return (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-700">Preview (first 5 items)</h4>
            <span className="text-xs text-slate-400">Total items: {previewData.totalRows}</span>
          </div>
          <pre className="bg-slate-50 rounded-xl p-3 text-xs font-mono overflow-x-auto border border-slate-200 max-h-64">
            {JSON.stringify(previewData.data, null, 2)}
          </pre>
        </div>
      );
    }
    
    return null;
  };

  const getTabColor = (tabId) => {
    switch(tabId) {
      case 'equipment': return 'blue';
      case 'detergents': return 'cyan';
      case 'rules': return 'purple';
      default: return 'slate';
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Bulk Upload
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload CSV, JSON, or Excel files to import equipment, detergents, or rules in bulk.
        </p>

        {/* Download Template Button */}
        <div className="flex justify-end mt-2">
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
          >
            <Download size={12} />
            Download Template (CSV)
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mt-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                clearFile();
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? `text-${getTabColor(tab.id)}-600 border-b-2 border-${getTabColor(tab.id)}-600`
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
              accept=".csv,.json,.xlsx,.xls"
              onChange={handleFileChange}
              className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            >
              {FORMATS.map(f => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Format hints */}
        <div className="mt-2 text-xs text-slate-400">
          {activeTab === 'equipment' && (
            <div className="space-y-1">
              <p>✅ Supported formats: CSV, JSON, Excel (.xlsx, .xls)</p>
              <p className="text-slate-300">📋 Required CSV headers: name, brand, category, intensity, domain, price_ugx</p>
              <p className="text-slate-300">Optional: subtype, power_source, in_stock, compatible_surfaces, compatible_dirt_types</p>
            </div>
          )}
          {activeTab === 'detergents' && (
            <div className="space-y-1">
              <p>✅ Supported formats: CSV, JSON, Excel (.xlsx, .xls)</p>
              <p className="text-slate-300">📋 Required CSV headers: product_name, form, detergent_category, ph_value, unit_size</p>
              <p className="text-slate-300">Optional: brand_name, intensity, domain, current_price_ugx, requires_ppe</p>
            </div>
          )}
          {activeTab === 'rules' && (
            <div className="space-y-1">
              <p>✅ Supported formats: CSV, JSON, Excel (.xlsx, .xls)</p>
              <p className="text-slate-300">📋 Required CSV headers: rule_id, rule_text, category</p>
              <p className="text-slate-300">Optional: priority, conditions (JSON string), action_type, action_message</p>
            </div>
          )}
        </div>

        {/* Preview Section */}
        {previewLoading && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-cyan-600 animate-spin" />
            <span className="ml-2 text-sm text-slate-500">Previewing file...</span>
          </div>
        )}
        
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
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Result display */}
        {result && (
          <div className={`mt-6 p-4 border rounded-xl ${result.errorCount && result.errorCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
            <div className={`flex items-center gap-2 font-semibold ${result.errorCount && result.errorCount > 0 ? 'text-amber-700' : 'text-green-700'}`}>
              {result.errorCount && result.errorCount > 0 ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {result.message || `Upload completed`}
            </div>
            <div className={`mt-2 text-sm ${result.errorCount && result.errorCount > 0 ? 'text-amber-700' : 'text-green-700'}`}>
              <p>📊 Total rows processed: <span className="font-medium">{result.totalRows || 0}</span></p>
              <p>✅ Successfully inserted: <span className="font-medium">{result.insertedCount || 0}</span></p>
              {result.errorCount > 0 && (
                <>
                  <p className="mt-1">❌ Errors: <span className="font-medium">{result.errorCount}</span></p>
                  {result.errors && result.errors.length > 0 && (
                    <details className="mt-3 cursor-pointer">
                      <summary className="font-medium hover:underline">Show error details ({result.errors.length})</summary>
                      <div className="mt-2 p-3 bg-white rounded-lg border border-amber-100 max-h-64 overflow-y-auto">
                        {result.errors.map((err, idx) => (
                          <div key={idx} className="text-xs mb-2 p-2 bg-red-50 rounded border border-red-200 text-red-700">
                            <strong>{err.row ? `Row ${err.row}:` : 'Error:'}</strong> {err.message || err.error || JSON.stringify(err)}
                            {err.data && (
                              <pre className="mt-1 text-[10px] bg-red-100 p-1 rounded overflow-x-auto">
                                {JSON.stringify(err.data, null, 2)}
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-red-700 text-sm">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};
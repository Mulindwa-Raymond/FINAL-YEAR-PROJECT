/**
 * DetergentForm.jsx
 * 
 * Admin form for creating or editing a detergent.
 * Fully recreated with:
 * - Real‑time client‑side validation
 * - Detailed error handling (API, network, validation)
 * - Success message with auto‑redirect
 * - Debug panel to inspect payload
 * - Loading states and disabled submit button
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  X,
  AlertCircle,
  Plus,
  Trash2,
  Droplet,
  Leaf,
  AlertTriangle,
  Building2,
  Bug,
  CheckCircle,
} from 'lucide-react';
import { createDetergent, updateDetergent, getDetergentById } from '../../../services/detergentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { detergentCategories, detergentForms, surfaceTypes, dirtTypes } from '../../../utils/constants';

const intensityOptions = [
  { value: 'light', label: 'Light Duty (Domestic / Residential)' },
  { value: 'medium', label: 'Medium Duty (Commercial / Professional)' },
  { value: 'heavy', label: 'Heavy Duty (Industrial / Heavy-Duty)' },
];

const detergentDomains = [
  { value: 'domestic', label: 'Domestic / Home Use' },
  { value: 'industrial', label: 'Industrial / Commercial' },
  { value: 'both', label: 'Both (Universal)' },
];

export const DetergentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [debugPayload, setDebugPayload] = useState(null);

  const [formData, setFormData] = useState({
    product_name: '',
    brand_name: '',
    detergent_category: '',
    form: 'liquid',
    ph_value: 7.0,
    unit_size: '',
    surface_compatibility: [],
    dirt_compatibility: [],
    current_price_ugx: '',
    dilution_ratio: '',
    requires_ppe: true,
    intensity: 'medium',
    domain: 'both',
    eco_certified: false,
    biodegradable: false,
    hazard_alerts: [],
    local_supplier: '',
    image_url: '',
  });

  const [newSurface, setNewSurface] = useState('');
  const [newDirt, setNewDirt] = useState('');
  const [newHazard, setNewHazard] = useState('');

  // Field validation errors (per field)
  const [fieldErrors, setFieldErrors] = useState({});

  // Load existing data when editing
  useEffect(() => {
    if (id) {
      const fetchDetergent = async () => {
        setLoading(true);
        try {
          const res = await getDetergentById(id);
          const data = res.data.data;
          setFormData({
            product_name: data.product_name || '',
            brand_name: data.brand_name || '',
            detergent_category: data.detergent_category || '',
            form: data.form || 'liquid',
            ph_value: data.ph_value || 7.0,
            unit_size: data.unit_size || '',
            surface_compatibility: data.surface_compatibility || [],
            dirt_compatibility: data.dirt_compatibility || [],
            current_price_ugx: data.current_price_ugx || '',
            dilution_ratio: data.dilution_ratio || '',
            requires_ppe: data.requires_ppe !== undefined ? data.requires_ppe : true,
            intensity: data.intensity || 'medium',
            domain: data.domain || 'both',
            eco_certified: data.eco_certified || false,
            biodegradable: data.biodegradable || false,
            hazard_alerts: data.hazard_alerts || [],
            local_supplier: data.local_supplier || '',
            image_url: data.image_url || '',
          });
        } catch (err) {
          console.error('Failed to load detergent:', err);
          setError('Failed to load detergent data. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      fetchDetergent();
    }
  }, [id]);

  // Real‑time field validation
  const validateField = (name, value) => {
    switch (name) {
      case 'product_name':
        if (!value?.trim()) return 'Product name is required';
        return null;
      case 'detergent_category':
        if (!value) return 'Category is required';
        return null;
      case 'intensity':
        if (!value) return 'Intensity is required';
        return null;
      case 'domain':
        if (!value) return 'Domain is required';
        return null;
      case 'ph_value':
        const ph = parseFloat(value);
        if (isNaN(ph)) return 'pH value is required';
        if (ph < 0 || ph > 14) return 'pH must be between 0 and 14';
        return null;
      case 'unit_size':
        const size = parseFloat(value);
        if (isNaN(size) || size <= 0) return 'Unit size must be a positive number';
        return null;
      case 'current_price_ugx':
        const price = parseFloat(value);
        if (value && (isNaN(price) || price < 0)) return 'Price cannot be negative';
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleArrayAdd = (field, value) => {
    if (value && !formData[field].includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
      if (field === 'surface_compatibility') setNewSurface('');
      if (field === 'dirt_compatibility') setNewDirt('');
      if (field === 'hazard_alerts') setNewHazard('');
    }
  };

  const handleArrayRemove = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
  };

  // Full form validation before submit
  const validateForm = () => {
    const errors = {};
    const productNameError = validateField('product_name', formData.product_name);
    if (productNameError) errors.product_name = productNameError;

    const categoryError = validateField('detergent_category', formData.detergent_category);
    if (categoryError) errors.detergent_category = categoryError;

    const intensityError = validateField('intensity', formData.intensity);
    if (intensityError) errors.intensity = intensityError;

    const domainError = validateField('domain', formData.domain);
    if (domainError) errors.domain = domainError;

    const phError = validateField('ph_value', formData.ph_value);
    if (phError) errors.ph_value = phError;

    const unitSizeError = validateField('unit_size', formData.unit_size);
    if (unitSizeError) errors.unit_size = unitSizeError;

    const priceError = validateField('current_price_ugx', formData.current_price_ugx);
    if (priceError) errors.current_price_ugx = priceError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDebugPayload(null);

    // Validate form
    if (!validateForm()) {
      setError('Please correct the highlighted fields before saving.');
      return;
    }

    // Build payload with correct data types
    const payload = {
      product_name: formData.product_name.trim(),
      brand_name: formData.brand_name?.trim() || null,
      detergent_category: formData.detergent_category,
      form: formData.form,
      ph_value: parseFloat(formData.ph_value),
      unit_size: parseFloat(formData.unit_size),
      surface_compatibility: formData.surface_compatibility,
      dirt_compatibility: formData.dirt_compatibility,
      current_price_ugx: formData.current_price_ugx ? parseInt(formData.current_price_ugx) : null,
      dilution_ratio: formData.dilution_ratio?.trim() || null,
      requires_ppe: formData.requires_ppe,
      intensity: formData.intensity,
      domain: formData.domain,
      eco_certified: formData.eco_certified,
      biodegradable: formData.biodegradable,
      hazard_alerts: formData.hazard_alerts,
      local_supplier: formData.local_supplier?.trim() || null,
      image_url: formData.image_url?.trim() || null,
    };

    // Show debug info
    setDebugPayload(payload);
    console.log('🚀 Submitting detergent payload:', JSON.stringify(payload, null, 2));

    setSaving(true);

    try {
      let response;
      if (id) {
        response = await updateDetergent(id, payload);
        console.log('✅ Detergent updated:', response.data);
      } else {
        response = await createDetergent(payload);
        console.log('✅ Detergent created:', response.data);
      }

      setSuccess(`✅ Detergent ${id ? 'updated' : 'created'} successfully! Redirecting...`);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/admin/detergents');
      }, 1500);
    } catch (err) {
      console.error('❌ Submit error:', err);
      let errorMessage = 'Failed to save detergent. ';

      if (err.response) {
        // Server responded with error
        if (err.response.status === 401) {
          errorMessage = 'Unauthorized. Please log in again.';
        } else if (err.response.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (err.response.status === 409) {
          errorMessage = 'A detergent with this name already exists.';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data?.error || err.response.data?.message || 'Invalid data.';
        } else {
          errorMessage = err.response.data?.error || err.response.data?.message || 'Server error.';
        }

        // Append validation details if present
        if (err.response.data?.details) {
          errorMessage += ` Details: ${JSON.stringify(err.response.data.details)}`;
        } else if (err.response.data?.errors) {
          errorMessage += ` ${Object.values(err.response.data.errors).join(', ')}`;
        }
      } else if (err.request) {
        // Request was made but no response
        errorMessage = 'No response from server. Check your network connection.';
      } else {
        // Something else
        errorMessage = err.message || 'An unexpected error occurred.';
      }

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 lg:px-6">
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-800">
              {id ? 'Edit Detergent' : 'Add New Detergent'}
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/detergents')}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-5 mt-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mx-5 mt-5 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 text-sm flex items-start gap-3 shadow-sm">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold">Success</p>
              <p>{success}</p>
            </div>
            <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Debug Panel (Toggle) */}
        <div className="px-5 pt-3">
          <button
            type="button"
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs text-slate-400 hover:text-cyan-600 flex items-center gap-1"
          >
            <Bug className="w-3 h-3" /> {showDebug ? 'Hide debug info' : 'Show debug info'}
          </button>
          {showDebug && debugPayload && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs font-mono overflow-auto max-h-48">
              <div className="font-bold text-yellow-700 mb-1">📤 Payload sent to backend:</div>
              <pre className="text-[10px]">{JSON.stringify(debugPayload, null, 2)}</pre>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2.5 focus:outline-none focus:ring-1 ${
                  fieldErrors.product_name
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                    : 'border-slate-200 focus:border-cyan-400 focus:ring-cyan-200'
                }`}
              />
              {fieldErrors.product_name && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.product_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
              <input
                type="text"
                name="brand_name"
                value={formData.brand_name}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="detergent_category"
                value={formData.detergent_category}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2.5 bg-white ${
                  fieldErrors.detergent_category
                    ? 'border-red-400'
                    : 'border-slate-200 focus:border-cyan-400'
                }`}
              >
                <option value="">Select category</option>
                {detergentCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {fieldErrors.detergent_category && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.detergent_category}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Form</label>
              <select
                name="form"
                value={formData.form}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                {detergentForms.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                pH Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="ph_value"
                value={formData.ph_value}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2.5 ${
                  fieldErrors.ph_value
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-slate-200 focus:border-cyan-400'
                }`}
              />
              {fieldErrors.ph_value && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.ph_value}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">0–14</p>
            </div>
          </div>

          {/* Intensity Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Intensity <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {intensityOptions.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer border rounded-lg p-3 text-center transition ${
                    formData.intensity === option.value
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="intensity"
                    value={option.value}
                    checked={formData.intensity === option.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
            {fieldErrors.intensity && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.intensity}</p>
            )}
          </div>

          {/* Domain Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Usage Domain <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {detergentDomains.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer border rounded-lg p-3 text-center transition ${
                    formData.domain === option.value
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="domain"
                    value={option.value}
                    checked={formData.domain === option.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
            {fieldErrors.domain && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.domain}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Unit Size (Liters) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                name="unit_size"
                value={formData.unit_size}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2.5 ${
                  fieldErrors.unit_size
                    ? 'border-red-400'
                    : 'border-slate-200 focus:border-cyan-400'
                }`}
              />
              {fieldErrors.unit_size && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.unit_size}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dilution Ratio</label>
              <input
                type="text"
                name="dilution_ratio"
                value={formData.dilution_ratio}
                onChange={handleChange}
                placeholder="e.g., 1:100"
                className="w-full border border-slate-200 rounded-lg p-2.5"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price (UGX)</label>
            <input
              type="number"
              name="current_price_ugx"
              value={formData.current_price_ugx}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2.5 ${
                fieldErrors.current_price_ugx
                  ? 'border-red-400'
                  : 'border-slate-200 focus:border-cyan-400'
              }`}
            />
            {fieldErrors.current_price_ugx && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.current_price_ugx}</p>
            )}
          </div>

          {/* Surface Compatibility */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Surface Compatibility</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.surface_compatibility.map((s) => (
                <span
                  key={s}
                  className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded-md text-sm flex items-center gap-1"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('surface_compatibility', s)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={newSurface}
                onChange={(e) => setNewSurface(e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg p-2 text-sm bg-white"
              >
                <option value="">Add surface...</option>
                {surfaceTypes
                  .filter((s) => !formData.surface_compatibility.includes(s))
                  .map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={() => handleArrayAdd('surface_compatibility', newSurface)}
                disabled={!newSurface}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Dirt Compatibility */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Dirt Compatibility</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.dirt_compatibility.map((d) => (
                <span
                  key={d}
                  className="px-2 py-1 bg-teal-50 text-teal-700 rounded-md text-sm flex items-center gap-1"
                >
                  {d}
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('dirt_compatibility', d)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={newDirt}
                onChange={(e) => setNewDirt(e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg p-2 text-sm bg-white"
              >
                <option value="">Add dirt type...</option>
                {dirtTypes
                  .filter((d) => !formData.dirt_compatibility.includes(d))
                  .map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={() => handleArrayAdd('dirt_compatibility', newDirt)}
                disabled={!newDirt}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Hazard Alerts */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Hazard Alerts
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.hazard_alerts.map((h) => (
                <span
                  key={h}
                  className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-sm flex items-center gap-1"
                >
                  {h}
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('hazard_alerts', h)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., corrosive, flammable, irritant"
                value={newHazard}
                onChange={(e) => setNewHazard(e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg p-2 text-sm"
              />
              <button
                type="button"
                onClick={() => handleArrayAdd('hazard_alerts', newHazard)}
                disabled={!newHazard}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Local Supplier */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500" /> Local Supplier
            </label>
            <input
              type="text"
              name="local_supplier"
              value={formData.local_supplier}
              onChange={handleChange}
              placeholder="e.g., Power Products Uganda"
              className="w-full border border-slate-200 rounded-lg p-2.5"
            />
          </div>

          {/* Eco & Biodegradable Checkboxes */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="eco_certified"
                checked={formData.eco_certified}
                onChange={handleChange}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <Leaf className="w-4 h-4 text-green-600" /> Eco Certified
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="biodegradable"
                checked={formData.biodegradable}
                onChange={handleChange}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span>♻️ Biodegradable</span>
            </label>
          </div>

          {/* PPE Requirement */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="requires_ppe"
              checked={formData.requires_ppe}
              onChange={handleChange}
              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-700">Requires Personal Protective Equipment (PPE)</span>
          </label>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-slate-200 rounded-lg p-2.5"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/admin/detergents')}
              disabled={saving}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Detergent</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
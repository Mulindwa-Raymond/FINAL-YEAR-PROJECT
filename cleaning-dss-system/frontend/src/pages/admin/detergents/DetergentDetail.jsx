/**
 * DetergentForm.jsx
 * 
 * Admin form for creating or editing a detergent.
 * Supports all fields from the backend model:
 * - name, brand, category, intensity, domain, ph, dilution_ratio
 * - compatible_surfaces, compatible_dirt_types, incompatible_surfaces (optional)
 * - eco_certified, biodegradable, hazard_alerts, requires_ppe
 * - price_ugx, package_size_liters, local_supplier, in_stock
 * - image_url (optional)
 * 
 * Uses GET for edit mode (fetches existing detergent) and POST/PUT for save.
 * Navigates back to list after successful save.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  X, 
  AlertCircle, 
  Leaf,
  Droplet,
  Package,
  Building2,
  Image
} from 'lucide-react';
import { createDetergent, updateDetergent, getDetergentById } from '../../../services/detergentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { detergentCategories, intensityLevels, domains, surfaceTypes, dirtTypes, hazardAlerts } from '../../../utils/constants';

export const DetergentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    intensity: 'medium',
    domain: 'both',
    ph: 7.0,
    dilution_ratio: '',
    compatible_surfaces: [],
    incompatible_surfaces: [],
    compatible_dirt_types: [],
    eco_certified: false,
    biodegradable: false,
    hazard_alerts: [],
    requires_ppe: false,
    price_ugx: '',
    package_size_liters: '',
    local_supplier: '',
    in_stock: true,
    image_url: '',
    active: true,
  });

  // Multi-select helper state
  const [newSurface, setNewSurface] = useState('');
  const [newIncompatibleSurface, setNewIncompatibleSurface] = useState('');
  const [newDirt, setNewDirt] = useState('');

  useEffect(() => {
    if (id) {
      const fetchDetergent = async () => {
        setLoading(true);
        try {
          const res = await getDetergentById(id);
          setFormData(res.data.data);
        } catch (err) {
          setError('Failed to load detergent data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetergent();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleArrayAdd = (field, value) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
    }
  };

  const handleArrayRemove = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value),
    }));
  };

  const handleHazardToggle = (alert) => {
    setFormData(prev => ({
      ...prev,
      hazard_alerts: prev.hazard_alerts.includes(alert)
        ? prev.hazard_alerts.filter(a => a !== alert)
        : [...prev.hazard_alerts, alert],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // Convert price and package size to numbers
      const payload = {
        ...formData,
        price_ugx: parseFloat(formData.price_ugx),
        package_size_liters: parseFloat(formData.package_size_liters),
      };
      if (id) {
        await updateDetergent(id, payload);
      } else {
        await createDetergent(payload);
      }
      navigate('/admin/detergents');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save detergent.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {id ? 'Edit Detergent' : 'Add New Detergent'}
          </h1>
          <button
            onClick={() => navigate('/admin/detergents')}
            className="p-2 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
              >
                <option value="">Select category</option>
                {detergentCategories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Intensity *</label>
              <select
                name="intensity"
                value={formData.intensity}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              >
                {intensityLevels.map(int => (
                  <option key={int} value={int}>{int.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Domain</label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              >
                {domains.map(d => (
                  <option key={d} value={d}>{d.toUpperCase()}</option>
                ))}
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* Chemical properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">pH Value *</label>
              <input
                type="number"
                step="0.1"
                name="ph"
                value={formData.ph}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dilution Ratio *</label>
              <input
                type="text"
                name="dilution_ratio"
                value={formData.dilution_ratio}
                onChange={handleChange}
                placeholder="e.g., 1:100"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
            </div>
          </div>

          {/* Compatibility arrays */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Compatible Surfaces</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.compatible_surfaces.map(surface => (
                <span key={surface} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm flex items-center gap-1">
                  {surface}
                  <button type="button" onClick={() => handleArrayRemove('compatible_surfaces', surface)} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={newSurface}
                onChange={(e) => setNewSurface(e.target.value)}
                className="flex-1 bg-slate-50 border rounded-xl p-2 text-sm"
              >
                <option value="">Add surface...</option>
                {surfaceTypes.filter(s => !formData.compatible_surfaces.includes(s)).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  handleArrayAdd('compatible_surfaces', newSurface);
                  setNewSurface('');
                }}
                disabled={!newSurface}
                className="px-4 py-2 bg-cyan-600 text-white rounded-xl disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Incompatible Surfaces</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.incompatible_surfaces.map(surface => (
                <span key={surface} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                  {surface}
                  <button type="button" onClick={() => handleArrayRemove('incompatible_surfaces', surface)} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={newIncompatibleSurface}
                onChange={(e) => setNewIncompatibleSurface(e.target.value)}
                className="flex-1 bg-slate-50 border rounded-xl p-2 text-sm"
              >
                <option value="">Add incompatible surface...</option>
                {surfaceTypes.filter(s => !formData.incompatible_surfaces.includes(s)).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  handleArrayAdd('incompatible_surfaces', newIncompatibleSurface);
                  setNewIncompatibleSurface('');
                }}
                disabled={!newIncompatibleSurface}
                className="px-4 py-2 bg-red-600 text-white rounded-xl disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Compatible Dirt Types</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.compatible_dirt_types.map(dirt => (
                <span key={dirt} className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-1">
                  {dirt}
                  <button type="button" onClick={() => handleArrayRemove('compatible_dirt_types', dirt)} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={newDirt}
                onChange={(e) => setNewDirt(e.target.value)}
                className="flex-1 bg-slate-50 border rounded-xl p-2 text-sm"
              >
                <option value="">Add dirt type...</option>
                {dirtTypes.filter(d => !formData.compatible_dirt_types.includes(d)).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  handleArrayAdd('compatible_dirt_types', newDirt);
                  setNewDirt('');
                }}
                disabled={!newDirt}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Safety and environmental */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="eco_certified"
                checked={formData.eco_certified}
                onChange={handleChange}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <Leaf className="w-4 h-4 text-green-600" /> Eco Certified
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="biodegradable"
                checked={formData.biodegradable}
                onChange={handleChange}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              Biodegradable
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="requires_ppe"
                checked={formData.requires_ppe}
                onChange={handleChange}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              Requires PPE
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hazard Alerts</label>
            <div className="flex flex-wrap gap-3">
              {hazardAlerts.map(alert => (
                <label key={alert} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.hazard_alerts.includes(alert)}
                    onChange={() => handleHazardToggle(alert)}
                    className="rounded border-slate-300"
                  />
                  <span className="text-sm capitalize">{alert}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pricing and availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (UGX)</label>
              <input
                type="number"
                name="price_ugx"
                value={formData.price_ugx}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Package Size (Liters)</label>
              <input
                type="number"
                step="0.5"
                name="package_size_liters"
                value={formData.package_size_liters}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Local Supplier</label>
              <input
                type="text"
                name="local_supplier"
                value={formData.local_supplier}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (optional)</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="in_stock"
              checked={formData.in_stock}
              onChange={handleChange}
              className="rounded border-slate-300 text-cyan-600"
            />
            In Stock
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/detergents')}
              className="px-6 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition disabled:opacity-70"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Detergent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
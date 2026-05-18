/**
 * DetergentForm.jsx
 * 
 * Admin form for creating or editing a detergent.
 * Supports all fields from the KB-DSS model:
 * - Basic info (product name, brand, category, form, pH)
 * - Compatibility (surface, dirt JSON arrays)
 * - Cost fields (price, unit size, dilution ratio)
 * - Safety (PPE requirement)
 * - Image URL
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, AlertCircle, Plus, Leaf, AlertTriangle } from 'lucide-react';
import { createDetergent, updateDetergent, getDetergentById } from '../../../services/detergentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { detergentCategories, detergentForms, surfaceTypes, dirtTypes } from '../../../utils/constants';

export const DetergentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    image_url: '',
  });

  const [newSurface, setNewSurface] = useState('');
  const [newDirt, setNewDirt] = useState('');

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
            image_url: data.image_url || '',
          });
        } catch (err) {
          setError('Failed to load detergent data.');
          console.error(err);
        } finally { setLoading(false); }
      };
      fetchDetergent();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleArrayAdd = (field, value) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value] }));
      if (field === 'surface_compatibility') setNewSurface('');
      if (field === 'dirt_compatibility') setNewDirt('');
    }
  };

  const handleArrayRemove = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter(item => item !== value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...formData,
        ph_value: parseFloat(formData.ph_value),
        unit_size: parseFloat(formData.unit_size) || null,
        current_price_ugx: parseInt(formData.current_price_ugx) || null,
      };
      if (id) await updateDetergent(id, payload);
      else await createDetergent(payload);
      navigate('/admin/detergents');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save detergent.');
      console.error(err);
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{id ? 'Edit Detergent' : 'Add New Detergent'}</h1>
          <button onClick={() => navigate('/admin/detergents')} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        {error && (<div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>)}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label><input type="text" name="product_name" value={formData.product_name} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Brand</label><input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Category *</label><select name="detergent_category" value={formData.detergent_category} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"><option value="">Select category</option>{detergentCategories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Form *</label><select name="form" value={formData.form} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3">{detergentForms.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">pH Value *</label><input type="number" step="0.1" name="ph_value" value={formData.ph_value} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Unit Size (Liters)</label><input type="number" step="0.5" name="unit_size" value={formData.unit_size} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Dilution Ratio</label><input type="text" name="dilution_ratio" value={formData.dilution_ratio} onChange={handleChange} placeholder="e.g., 1:100" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" /></div>
          </div>

          {/* Compatibility sections */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Surface Compatibility</h3>
            <div className="flex flex-wrap gap-2 mb-2">{formData.surface_compatibility.map(s => (<span key={s} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm flex items-center gap-1">{s}<button type="button" onClick={() => handleArrayRemove('surface_compatibility', s)} className="hover:text-red-600">×</button></span>))}</div>
            <div className="flex gap-2"><select value={newSurface} onChange={(e) => setNewSurface(e.target.value)} className="flex-1 bg-slate-50 border rounded-xl p-2 text-sm"><option value="">Add surface...</option>{surfaceTypes.filter(s => !formData.surface_compatibility.includes(s)).map(s => (<option key={s} value={s}>{s}</option>))}</select><button type="button" onClick={() => handleArrayAdd('surface_compatibility', newSurface)} disabled={!newSurface} className="px-4 py-2 bg-cyan-600 text-white rounded-xl disabled:opacity-50">Add</button></div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Dirt Compatibility</h3>
            <div className="flex flex-wrap gap-2 mb-2">{formData.dirt_compatibility.map(d => (<span key={d} className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-1">{d}<button type="button" onClick={() => handleArrayRemove('dirt_compatibility', d)} className="hover:text-red-600">×</button></span>))}</div>
            <div className="flex gap-2"><select value={newDirt} onChange={(e) => setNewDirt(e.target.value)} className="flex-1 bg-slate-50 border rounded-xl p-2 text-sm"><option value="">Add dirt type...</option>{dirtTypes.filter(d => !formData.dirt_compatibility.includes(d)).map(d => (<option key={d} value={d}>{d}</option>))}</select><button type="button" onClick={() => handleArrayAdd('dirt_compatibility', newDirt)} disabled={!newDirt} className="px-4 py-2 bg-teal-600 text-white rounded-xl disabled:opacity-50">Add</button></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Price (UGX)</label><input type="number" name="current_price_ugx" value={formData.current_price_ugx} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label><input type="url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" /></div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" name="requires_ppe" checked={formData.requires_ppe} onChange={handleChange} className="rounded border-slate-300 text-cyan-600" /><AlertTriangle className="w-4 h-4 text-amber-500" /> Requires PPE</label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => navigate('/admin/detergents')} className="px-6 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition disabled:opacity-70">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Detergent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
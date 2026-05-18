/**
 * EquipmentForm.jsx
 * 
 * Admin form for creating or editing equipment.
 * Supports all fields from the KB-DSS model:
 * - Basic info (brand, model, category, weight, power_source)
 * - Compatibility (surface, dirt JSON arrays)
 * - Cost fields (price, maintenance, running)
 * - Image URL
 * - Dynamic specifications
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { createEquipment, updateEquipment, getEquipmentById } from '../../../services/equipmentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { machineCategories, powerSources, equipmentBrands, surfaceTypes, dirtTypes } from '../../../utils/constants';

export const EquipmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    brand_name: '',
    model_name: '',
    machine_category: '',
    weight_kg: '',
    power_source: 'corded_electric',
    surface_compatibility: [],
    dirt_compatibility: [],
    current_price_ugx: '',
    estimated_maintenance_cost_per_year_ugx: '',
    estimated_running_cost_per_year_ugx: '',
    image_url: '',
  });

  const [specifications, setSpecifications] = useState([]);
  const [newSpec, setNewSpec] = useState({ attribute_name: '', attribute_value: '', unit_of_measure: '' });

  // For multi-select helpers
  const [newSurface, setNewSurface] = useState('');
  const [newDirt, setNewDirt] = useState('');

  useEffect(() => {
    if (id) {
      const fetchEquipment = async () => {
        setLoading(true);
        try {
          const res = await getEquipmentById(id);
          const data = res.data.data;
          setFormData({
            brand_name: data.brand_name || '',
            model_name: data.model_name || '',
            machine_category: data.machine_category || '',
            weight_kg: data.weight_kg || '',
            power_source: data.power_source || 'corded_electric',
            surface_compatibility: data.surface_compatibility || [],
            dirt_compatibility: data.dirt_compatibility || [],
            current_price_ugx: data.current_price_ugx || '',
            estimated_maintenance_cost_per_year_ugx: data.estimated_maintenance_cost_per_year_ugx || '',
            estimated_running_cost_per_year_ugx: data.estimated_running_cost_per_year_ugx || '',
            image_url: data.image_url || '',
          });
          setSpecifications(data.specifications || []);
        } catch (err) {
          setError('Failed to load equipment data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchEquipment();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayAdd = (field, value) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value] }));
    }
  };

  const handleArrayRemove = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter(item => item !== value) }));
  };

  const handleAddSpec = () => {
    if (newSpec.attribute_name && newSpec.attribute_value) {
      setSpecifications([...specifications, { ...newSpec }]);
      setNewSpec({ attribute_name: '', attribute_value: '', unit_of_measure: '' });
    }
  };

  const handleRemoveSpec = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...formData,
        weight_kg: parseFloat(formData.weight_kg) || null,
        current_price_ugx: parseInt(formData.current_price_ugx) || null,
        estimated_maintenance_cost_per_year_ugx: parseInt(formData.estimated_maintenance_cost_per_year_ugx) || null,
        estimated_running_cost_per_year_ugx: parseInt(formData.estimated_running_cost_per_year_ugx) || null,
        specifications: specifications.map(s => ({
          attribute_name: s.attribute_name,
          attribute_value: s.attribute_value,
          unit_of_measure: s.unit_of_measure || null
        })),
      };
      if (id) {
        await updateEquipment(id, payload);
      } else {
        await createEquipment(payload);
      }
      navigate('/admin/equipment');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save equipment.');
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
            {id ? 'Edit Equipment' : 'Add New Equipment'}
          </h1>
          <button onClick={() => navigate('/admin/equipment')} className="p-2 hover:bg-slate-100 rounded-xl transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
              <select name="brand_name" value={formData.brand_name} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3">
                <option value="">Select brand</option>
                {equipmentBrands.map(b => (<option key={b} value={b}>{b}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Model Name *</label>
              <input type="text" name="model_name" value={formData.model_name} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select name="machine_category" value={formData.machine_category} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3">
                <option value="">Select category</option>
                {machineCategories.map(cat => (<option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
              <input type="number" step="0.1" name="weight_kg" value={formData.weight_kg} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Power Source *</label>
              <select name="power_source" value={formData.power_source} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3">
                {powerSources.map(ps => (<option key={ps} value={ps}>{ps.replace(/_/g, ' ')}</option>))}
              </select>
            </div>
          </div>

          {/* Compatibility */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Surface Compatibility</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.surface_compatibility.map(s => (
                <span key={s} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm flex items-center gap-1">
                  {s} <button type="button" onClick={() => handleArrayRemove('surface_compatibility', s)} className="hover:text-red-600">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select value={newSurface} onChange={(e) => setNewSurface(e.target.value)} className="flex-1 bg-slate-50 border rounded-xl p-2 text-sm">
                <option value="">Add surface...</option>
                {surfaceTypes.filter(s => !formData.surface_compatibility.includes(s)).map(s => (<option key={s} value={s}>{s}</option>))}
              </select>
              <button type="button" onClick={() => { handleArrayAdd('surface_compatibility', newSurface); setNewSurface(''); }} disabled={!newSurface} className="px-4 py-2 bg-cyan-600 text-white rounded-xl disabled:opacity-50">Add</button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Dirt Compatibility</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.dirt_compatibility.map(d => (
                <span key={d} className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-1">
                  {d} <button type="button" onClick={() => handleArrayRemove('dirt_compatibility', d)} className="hover:text-red-600">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select value={newDirt} onChange={(e) => setNewDirt(e.target.value)} className="flex-1 bg-slate-50 border rounded-xl p-2 text-sm">
                <option value="">Add dirt type...</option>
                {dirtTypes.filter(d => !formData.dirt_compatibility.includes(d)).map(d => (<option key={d} value={d}>{d}</option>))}
              </select>
              <button type="button" onClick={() => { handleArrayAdd('dirt_compatibility', newDirt); setNewDirt(''); }} disabled={!newDirt} className="px-4 py-2 bg-teal-600 text-white rounded-xl disabled:opacity-50">Add</button>
            </div>
          </div>

          {/* Cost Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (UGX)</label>
              <input type="number" name="current_price_ugx" value={formData.current_price_ugx} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Maintenance Cost/Year (UGX)</label>
              <input type="number" name="estimated_maintenance_cost_per_year_ugx" value={formData.estimated_maintenance_cost_per_year_ugx} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Running Cost/Year (UGX)</label>
              <input type="number" name="estimated_running_cost_per_year_ugx" value={formData.estimated_running_cost_per_year_ugx} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
            <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" />
          </div>

          {/* Dynamic Specifications */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Technical Specifications</h3>
            {specifications.map((spec, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <span className="w-1/3 px-3 py-2 bg-slate-50 rounded-xl text-sm">{spec.attribute_name}</span>
                <span className="w-1/3 px-3 py-2 bg-slate-50 rounded-xl text-sm">{spec.attribute_value}</span>
                <span className="w-1/4 px-3 py-2 bg-slate-50 rounded-xl text-sm">{spec.unit_of_measure || '-'}</span>
                <button type="button" onClick={() => handleRemoveSpec(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <div className="flex gap-2 mt-3">
              <input type="text" placeholder="Attribute name" value={newSpec.attribute_name} onChange={(e) => setNewSpec({ ...newSpec, attribute_name: e.target.value })} className="flex-1 bg-slate-50 border rounded-xl p-2 text-sm" />
              <input type="text" placeholder="Value" value={newSpec.attribute_value} onChange={(e) => setNewSpec({ ...newSpec, attribute_value: e.target.value })} className="flex-1 bg-slate-50 border rounded-xl p-2 text-sm" />
              <input type="text" placeholder="Unit" value={newSpec.unit_of_measure} onChange={(e) => setNewSpec({ ...newSpec, unit_of_measure: e.target.value })} className="w-24 bg-slate-50 border rounded-xl p-2 text-sm" />
              <button type="button" onClick={handleAddSpec} className="px-4 py-2 bg-cyan-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => navigate('/admin/equipment')} className="px-6 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition disabled:opacity-70">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
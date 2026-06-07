/**
 * EquipmentForm.jsx
 * 
 * Admin form for creating or editing equipment.
 * Supports:
 * - Basic info (brand, model, category, sub-type, intensity)
 * - Usage Domain (Domestic / Commercial / Industrial)
 * - Environment (indoor, outdoor, food_grade, hazardous, any)
 * - Minimum aisle width
 * - Dynamic technical specifications
 * - Compatibility (surface, dirt JSON arrays)
 * - Cost fields (price, maintenance, running) + TCO preview
 * - Image upload and URL
 * - Full client-side form validation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  X, 
  AlertCircle, 
  Plus, 
  Trash2,
  Package,
  Image as ImageIcon,
  DollarSign,
  AlertTriangle,
  Settings,
  Info,
  Check,
  Tag,
  MapPin,
  Ruler
} from 'lucide-react';
import { createEquipment, updateEquipment, getEquipmentById } from '../../../services/equipmentService';
import { getSpecsByEquipment, createSpec, deleteSpec } from '../../../services/equipmentSpecsService';
import { getSpecTemplate } from '../../../utils/specTemplates';
import { ImageUploader } from '../../../components/common/ImageUploader';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { 
  machineCategories, 
  intensityLevels, 
  intensityLabels,
  intensityDescriptions,
  powerSources, 
  powerSourceLabels,
  equipmentBrands, 
  surfaceTypes, 
  dirtTypes,
  getValidSubtypes,
  getSubtypeLabel,
  machineCategoryLabels,
  environmentTypes,
  environmentLabels
} from '../../../utils/constants';

// Filter to only the 3 main brands
const mainBrands = equipmentBrands.filter(b => ['Kärcher', 'Nilfisk', 'Numatic'].includes(b));

export const EquipmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validSubtypes, setValidSubtypes] = useState([]);

  const [formData, setFormData] = useState({
    brand_name: '',
    model_name: '',
    machine_category: '',
    machine_subtype: '',
    intensity: 'medium',
    domain: 'commercial',
    environment: 'any',              // NEW
    min_aisle_width_mm: '',          // NEW
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
  const [newSurface, setNewSurface] = useState('');
  const [newDirt, setNewDirt] = useState('');

  // Load equipment data when editing
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
            machine_subtype: data.machine_subtype || '',
            intensity: data.intensity || 'medium',
            domain: data.domain || 'commercial',
            environment: data.environment || 'any',
            min_aisle_width_mm: data.min_aisle_width_mm || '',
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
          
          if (data.brand_name && data.machine_category) {
            const subtypes = getValidSubtypes(data.brand_name, data.machine_category);
            setValidSubtypes(subtypes);
          }
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

  // Update valid sub-types when brand or category changes
  useEffect(() => {
    if (formData.brand_name && formData.machine_category) {
      const subtypes = getValidSubtypes(formData.brand_name, formData.machine_category);
      setValidSubtypes(subtypes);
      
      if (formData.machine_subtype && !subtypes.includes(formData.machine_subtype)) {
        setFormData(prev => ({ ...prev, machine_subtype: '' }));
      }
      
      if (formData.intensity && formData.machine_subtype) {
        const template = getSpecTemplate(formData.machine_category, formData.intensity, formData.machine_subtype);
        if (template && template.length > 0 && specifications.length === 0) {
          setSpecifications(template);
        }
      }
    }
  }, [formData.brand_name, formData.machine_category, formData.intensity, formData.machine_subtype]);

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

  const handleSpecChange = (index, field, value) => {
    setSpecifications(specifications.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    // Validate required fields
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSaving(false);
      return;
    }
    
    // Filter out any specs with empty attribute_name or attribute_value
    const validSpecs = specifications.filter(
      spec => spec.attribute_name?.trim() && spec.attribute_value?.trim()
    );
    
    if (validSpecs.length !== specifications.length) {
      if (!window.confirm('Some specifications have empty name or value. They will be ignored. Continue?')) {
        setSaving(false);
        return;
      }
    }
    
    try {
      const payload = {
        ...formData,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        min_aisle_width_mm: formData.min_aisle_width_mm ? parseInt(formData.min_aisle_width_mm) : null,
        current_price_ugx: formData.current_price_ugx ? parseInt(formData.current_price_ugx) : null,
        estimated_maintenance_cost_per_year_ugx: formData.estimated_maintenance_cost_per_year_ugx 
          ? parseInt(formData.estimated_maintenance_cost_per_year_ugx) 
          : null,
        estimated_running_cost_per_year_ugx: formData.estimated_running_cost_per_year_ugx 
          ? parseInt(formData.estimated_running_cost_per_year_ugx) 
          : null,
      };
      
      let equipmentId;
      if (id) {
        // Update existing equipment
        await updateEquipment(id, payload);
        equipmentId = id;
      } else {
        // Create new equipment
        const res = await createEquipment(payload);
        const createdEquipment = res.data.data;
        equipmentId = createdEquipment?._id || createdEquipment?.equipment_id || createdEquipment?.id;
        
        if (!equipmentId) {
          throw new Error('Failed to retrieve equipment ID from server response');
        }
      }
      
      // Save specifications only if there are valid ones
      if (validSpecs.length > 0) {
        // If editing, delete all existing specs for this equipment
        if (id) {
          try {
            const existingSpecsRes = await getSpecsByEquipment(equipmentId);
            const existingSpecs = existingSpecsRes.data.data || [];
            for (const spec of existingSpecs) {
              await deleteSpec(spec._id);
            }
          } catch (err) {
            console.warn('Could not delete existing specs:', err);
          }
        }
        
        // Create new specs
        for (const spec of validSpecs) {
          await createSpec({
            equipment_id: equipmentId,
            attribute_name: spec.attribute_name.trim(),
            attribute_value: spec.attribute_value.trim(),
            unit_of_measure: spec.unit_of_measure?.trim() || null
          });
        }
      }
      
      navigate('/admin/equipment');
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to save equipment.');
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // FORM VALIDATION
  // ============================================

  const validateForm = () => {
    if (!formData.brand_name?.trim()) return 'Brand is required';
    if (!formData.model_name?.trim()) return 'Model name is required';
    if (formData.model_name.length < 2) return 'Model name must be at least 2 characters';
    if (formData.model_name.length > 100) return 'Model name must be less than 100 characters';
    if (!formData.machine_category) return 'Machine category is required';
    if (!formData.machine_subtype) return 'Machine sub-type is required';
    if (!formData.intensity) return 'Intensity is required';
    if (!formData.domain) return 'Usage domain is required';
    if (!formData.power_source) return 'Power source is required';

    if (formData.weight_kg && (isNaN(parseFloat(formData.weight_kg)) || parseFloat(formData.weight_kg) < 0)) {
      return 'Weight must be a positive number';
    }
    if (formData.min_aisle_width_mm && (isNaN(parseInt(formData.min_aisle_width_mm)) || parseInt(formData.min_aisle_width_mm) < 0)) {
      return 'Aisle width must be a positive number';
    }
    if (formData.current_price_ugx && (isNaN(parseInt(formData.current_price_ugx)) || parseInt(formData.current_price_ugx) < 0)) {
      return 'Price must be a positive number';
    }
    if (formData.estimated_maintenance_cost_per_year_ugx && (isNaN(parseInt(formData.estimated_maintenance_cost_per_year_ugx)) || parseInt(formData.estimated_maintenance_cost_per_year_ugx) < 0)) {
      return 'Maintenance cost must be a positive number';
    }
    if (formData.estimated_running_cost_per_year_ugx && (isNaN(parseInt(formData.estimated_running_cost_per_year_ugx)) || parseInt(formData.estimated_running_cost_per_year_ugx) < 0)) {
      return 'Running cost must be a positive number';
    }

    return null;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 lg:px-6">
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-800">
              {id ? 'Edit Equipment' : 'Add New Equipment'}
            </h1>
          </div>
          <button onClick={() => navigate('/admin/equipment')} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="m-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
              <select 
                name="brand_name" 
                value={formData.brand_name} 
                onChange={handleChange} 
                required 
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              >
                <option value="">Select brand</option>
                {mainBrands.map(b => (<option key={b} value={b}>{b}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Model Name *</label>
              <input 
                type="text" 
                name="model_name" 
                value={formData.model_name} 
                onChange={handleChange} 
                required 
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" 
              />
            </div>
          </div>

          {/* Classification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select 
                name="machine_category" 
                value={formData.machine_category} 
                onChange={handleChange} 
                required 
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                <option value="">Select category</option>
                {machineCategories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sub-Type *</label>
              <select 
                name="machine_subtype" 
                value={formData.machine_subtype} 
                onChange={handleChange} 
                required 
                disabled={!formData.brand_name || !formData.machine_category}
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-white disabled:bg-slate-100"
              >
                <option value="">Select sub-type</option>
                {validSubtypes.map(st => (
                  <option key={st} value={st}>{getSubtypeLabel(formData.brand_name, formData.machine_category, st)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Intensity *</label>
              <select 
                name="intensity" 
                value={formData.intensity} 
                onChange={handleChange} 
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                {intensityLevels.map(int => (
                  <option key={int} value={int}>{intensityLabels[int]}</option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">{intensityDescriptions[formData.intensity]}</p>
            </div>
          </div>

          {/* Usage Domain */}
          <div className="border-t border-slate-200 pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Usage Domain *</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'domestic', label: 'Domestic / Residential', desc: 'Homes, small apartments' },
                { value: 'commercial', label: 'Commercial / Professional', desc: 'Offices, hotels, restaurants' },
                { value: 'industrial', label: 'Industrial / Heavy-Duty', desc: 'Factories, warehouses, construction' }
              ].map(option => (
                <label
                  key={option.value}
                  className={`cursor-pointer border rounded-lg p-3 transition ${
                    formData.domain === option.value
                      ? 'border-cyan-500 bg-cyan-50'
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
                  <div className="text-center">
                    <p className="font-medium text-slate-800">{option.label}</p>
                    <p className="text-xs text-slate-500">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Environment Selection (NEW) */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-cyan-600" />
              <h3 className="text-md font-semibold text-slate-800">Environment</h3>
              <span className="text-xs text-slate-400">Where will this machine be used?</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {environmentTypes.map((env) => (
                <label
                  key={env}
                  className={`cursor-pointer border rounded-lg p-3 text-center transition ${
                    formData.environment === env
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="environment"
                    value={env}
                    checked={formData.environment === env}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-700 capitalize">{env.replace(/_/g, ' ')}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Aisle Width (NEW) */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Ruler className="w-5 h-5 text-cyan-600" />
              <h3 className="text-md font-semibold text-slate-800">Minimum Aisle Width</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  name="min_aisle_width_mm"
                  value={formData.min_aisle_width_mm}
                  onChange={handleChange}
                  placeholder="e.g., 900"
                  min="0"
                  step="10"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-cyan-400"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Narrowest aisle or passage where the machine will operate (in mm).
                </p>
              </div>
            </div>
          </div>

          {/* Technical Specifications Section */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-5 h-5 text-cyan-600" />
              <h3 className="text-md font-semibold text-slate-800">Technical Specifications</h3>
              <Info className="w-4 h-4 text-slate-400" title="These specifications are specific to the selected category and sub-type" />
            </div>
            
            <div className="space-y-2 mb-3">
              {specifications.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Attribute name"
                    value={spec.attribute_name}
                    onChange={(e) => handleSpecChange(idx, 'attribute_name', e.target.value)}
                    className="w-1/3 border border-slate-200 rounded-lg p-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.attribute_value}
                    onChange={(e) => handleSpecChange(idx, 'attribute_value', e.target.value)}
                    className="w-1/3 border border-slate-200 rounded-lg p-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={spec.unit_of_measure || ''}
                    onChange={(e) => handleSpecChange(idx, 'unit_of_measure', e.target.value)}
                    className="w-24 border border-slate-200 rounded-lg p-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Attribute name (e.g., working_width)"
                value={newSpec.attribute_name}
                onChange={(e) => setNewSpec({ ...newSpec, attribute_name: e.target.value })}
                className="flex-1 border border-slate-200 rounded-lg p-2 text-sm"
              />
              <input
                type="text"
                placeholder="Value"
                value={newSpec.attribute_value}
                onChange={(e) => setNewSpec({ ...newSpec, attribute_value: e.target.value })}
                className="flex-1 border border-slate-200 rounded-lg p-2 text-sm"
              />
              <input
                type="text"
                placeholder="Unit (mm, L, kg, etc.)"
                value={newSpec.unit_of_measure}
                onChange={(e) => setNewSpec({ ...newSpec, unit_of_measure: e.target.value })}
                className="w-32 border border-slate-200 rounded-lg p-2 text-sm"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                disabled={!newSpec.attribute_name || !newSpec.attribute_value}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Add technical specifications specific to this machine type. These will appear on the equipment detail page.
            </p>
          </div>

          {/* Compatibility Section */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-cyan-600" />
              <h3 className="text-md font-semibold text-slate-800">Compatibility</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Surface Types</label>
                <select 
                  value={newSurface} 
                  onChange={(e) => setNewSurface(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-cyan-400"
                >
                  <option value="">Select surface type to add</option>
                  {surfaceTypes.map(st => (
                    <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleArrayAdd('surface_compatibility', newSurface)}
                  disabled={!newSurface}
                  className="mt-2 px-3 py-2 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 disabled:opacity-50 transition"
                >
                  <Plus className="w-4 h-4 inline mr-1" /> Add Surface
                </button>

                <div className="mt-3 space-y-2">
                  {formData.surface_compatibility.map((surface, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                      <span className="text-sm text-slate-700">{surface.replace(/_/g, ' ')}</span>
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('surface_compatibility', surface)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dirt/Soil Types</label>
                <select 
                  value={newDirt} 
                  onChange={(e) => setNewDirt(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-cyan-400"
                >
                  <option value="">Select dirt type to add</option>
                  {dirtTypes.map(dt => (
                    <option key={dt} value={dt}>{dt.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleArrayAdd('dirt_compatibility', newDirt)}
                  disabled={!newDirt}
                  className="mt-2 px-3 py-2 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 disabled:opacity-50 transition"
                >
                  <Plus className="w-4 h-4 inline mr-1" /> Add Dirt Type
                </button>

                <div className="mt-3 space-y-2">
                  {formData.dirt_compatibility.map((dirt, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                      <span className="text-sm text-slate-700">{dirt.replace(/_/g, ' ')}</span>
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('dirt_compatibility', dirt)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cost & Pricing Section */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-cyan-600" />
              <h3 className="text-md font-semibold text-slate-800">Pricing & Costs</h3>
              <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">Used for TCO calculation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Price (UGX)</label>
                <input 
                  type="number" 
                  name="current_price_ugx" 
                  value={formData.current_price_ugx} 
                  onChange={handleChange}
                  placeholder="e.g., 2500000"
                  min="0"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-cyan-400"
                />
                <p className="text-xs text-slate-400 mt-1">Equipment purchase price</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Annual Maintenance Cost (UGX)</label>
                <input 
                  type="number" 
                  name="estimated_maintenance_cost_per_year_ugx" 
                  value={formData.estimated_maintenance_cost_per_year_ugx} 
                  onChange={handleChange}
                  placeholder="e.g., 125000"
                  min="0"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-cyan-400"
                />
                <p className="text-xs text-slate-400 mt-1">Servicing, parts, repairs</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Annual Running Cost (UGX)</label>
                <input 
                  type="number" 
                  name="estimated_running_cost_per_year_ugx" 
                  value={formData.estimated_running_cost_per_year_ugx} 
                  onChange={handleChange}
                  placeholder="e.g., 75000"
                  min="0"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-cyan-400"
                />
                <p className="text-xs text-slate-400 mt-1">Electricity, water, chemicals</p>
              </div>
            </div>

            {(formData.current_price_ugx || formData.estimated_maintenance_cost_per_year_ugx || formData.estimated_running_cost_per_year_ugx) && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">
                  💡 Estimated Annual TCO (Total Cost of Ownership):
                </p>
                <p className="text-lg font-semibold text-blue-900 mt-1">
                  UGX {(
                    (parseInt(formData.current_price_ugx) || 0) / 5 +
                    (parseInt(formData.estimated_maintenance_cost_per_year_ugx) || 0) +
                    (parseInt(formData.estimated_running_cost_per_year_ugx) || 0)
                  ).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Weight & Physical Specs */}
          <div className="border-t border-slate-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  name="weight_kg" 
                  value={formData.weight_kg} 
                  onChange={handleChange}
                  placeholder="e.g., 35"
                  min="0"
                  step="0.1"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Power Source *</label>
                <select 
                  name="power_source" 
                  value={formData.power_source} 
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-sm focus:border-cyan-400"
                >
                  {Object.entries(powerSourceLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-cyan-600" />
              <h3 className="text-md font-semibold text-slate-800">Equipment Image</h3>
            </div>
            <ImageUploader 
              onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              currentUrl={formData.image_url}
              maxSizeMB={5}
              allowedFormats={['jpeg', 'jpg', 'png', 'webp']}
              showPreview={true}
            />
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/admin/equipment')}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-cyan-700 transition disabled:opacity-70"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
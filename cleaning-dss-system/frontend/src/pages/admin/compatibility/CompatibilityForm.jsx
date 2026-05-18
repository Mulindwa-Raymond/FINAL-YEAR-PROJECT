/**
 * CompatibilityForm.jsx
 * 
 * Admin form for creating or editing equipment-detergent compatibility records.
 * Features:
 * - Select equipment from dropdown
 * - Select detergent from dropdown
 * - Set recommended status (Recommended vs Just Compatible)
 * - Add compatibility notes
 * - Fetches equipment and detergents from backend
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle,
  Package,
  Droplet,
  HeartHandshake
} from 'lucide-react';
import { 
  createCompatibility, 
  updateCompatibility, 
  getCompatibilityById 
} from '../../../services/compatibilityService';
import { getAllEquipment } from '../../../services/equipmentService';
import { getAllDetergents } from '../../../services/detergentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

export const CompatibilityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);
  const [detergentList, setDetergentList] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    equipment_id: '',
    detergent_id: '',
    is_recommended: true,
    compatibility_notes: '',
  });

  // Fetch equipment and detergents for dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const [equipRes, detRes] = await Promise.all([
          getAllEquipment({ limit: 1000, active: true }),
          getAllDetergents({ limit: 1000, active: true })
        ]);
        
        setEquipmentList(equipRes.data.data?.equipment || equipRes.data.data || []);
        setDetergentList(detRes.data.data?.detergents || detRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch options:', err);
        setError('Failed to load equipment and detergent data.');
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  // Fetch existing compatibility record if editing
  useEffect(() => {
    if (id) {
      const fetchCompatibility = async () => {
        setLoading(true);
        try {
          const res = await getCompatibilityById(id);
          setFormData({
            equipment_id: res.data.data.equipment_id,
            detergent_id: res.data.data.detergent_id,
            is_recommended: res.data.data.is_recommended,
            compatibility_notes: res.data.data.compatibility_notes || '',
          });
        } catch (err) {
          setError('Failed to load compatibility data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCompatibility();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validate selections
    if (!formData.equipment_id) {
      setError('Please select an equipment.');
      setSaving(false);
      return;
    }
    if (!formData.detergent_id) {
      setError('Please select a detergent.');
      setSaving(false);
      return;
    }

    try {
      if (id) {
        await updateCompatibility(id, formData);
      } else {
        await createCompatibility(formData);
      }
      navigate('/admin/compatibility');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save compatibility record.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getEquipmentName = (equipmentId) => {
    const equipment = equipmentList.find(e => e._id === equipmentId);
    return equipment ? `${equipment.brand_name} ${equipment.model_name}` : '';
  };

  const getDetergentName = (detergentId) => {
    const detergent = detergentList.find(d => d._id === detergentId);
    return detergent ? detergent.product_name : '';
  };

  if (loading || loadingOptions) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <HeartHandshake className="w-8 h-8 text-cyan-600" />
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {id ? 'Edit Compatibility' : 'Add Compatibility'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Define which detergents can be safely used with each equipment
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/compatibility')}
            className="p-2 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Equipment Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-600" />
              Equipment *
            </label>
            <select
              name="equipment_id"
              value={formData.equipment_id}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            >
              <option value="">Select equipment...</option>
              {equipmentList.map(eq => (
                <option key={eq._id} value={eq._id}>
                  {eq.brand_name} {eq.model_name} - {eq.machine_category?.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {formData.equipment_id && (
              <p className="text-xs text-slate-400 mt-1">
                Selected: {getEquipmentName(formData.equipment_id)}
              </p>
            )}
          </div>

          {/* Detergent Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-teal-600" />
              Detergent *
            </label>
            <select
              name="detergent_id"
              value={formData.detergent_id}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            >
              <option value="">Select detergent...</option>
              {detergentList.map(det => (
                <option key={det._id} value={det._id}>
                  {det.product_name} ({det.detergent_category}, pH: {det.ph_value})
                </option>
              ))}
            </select>
            {formData.detergent_id && (
              <p className="text-xs text-slate-400 mt-1">
                Selected: {getDetergentName(formData.detergent_id)}
              </p>
            )}
          </div>

          {/* Recommendation Status */}
          <div className="bg-slate-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Compatibility Status *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_recommended: true }))}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  formData.is_recommended
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-green-200'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Recommended</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_recommended: false }))}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  !formData.is_recommended
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-amber-200'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Compatible (Not Recommended)</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              {formData.is_recommended
                ? '✅ Recommended pairings will be prioritized in recommendations.'
                : '⚠️ Compatible but not recommended – use only when necessary.'}
            </p>
          </div>

          {/* Compatibility Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Compatibility Notes (Optional)
            </label>
            <textarea
              name="compatibility_notes"
              value={formData.compatibility_notes}
              onChange={handleChange}
              rows="3"
              placeholder="e.g., Use at 1:50 dilution only, avoid mixing with alkaline detergents, etc."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
            <p className="text-xs text-slate-400 mt-1">
              Add specific instructions or warnings for using this detergent with this equipment.
            </p>
          </div>

          {/* Preview Section */}
          {formData.equipment_id && formData.detergent_id && (
            <div className="border-t border-slate-200 pt-4 mt-2">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Preview</h3>
              <div className={`p-4 rounded-xl border ${
                formData.is_recommended 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-start gap-3">
                  {formData.is_recommended ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {getEquipmentName(formData.equipment_id)} ↔ {getDetergentName(formData.detergent_id)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formData.is_recommended 
                        ? 'This combination is recommended for optimal cleaning results.'
                        : 'This combination works but is not the preferred choice.'}
                    </p>
                    {formData.compatibility_notes && (
                      <p className="text-xs text-slate-600 mt-2 italic">
                        📝 {formData.compatibility_notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/admin/compatibility')}
              className="px-6 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition disabled:opacity-70"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save Compatibility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompatibilityForm;
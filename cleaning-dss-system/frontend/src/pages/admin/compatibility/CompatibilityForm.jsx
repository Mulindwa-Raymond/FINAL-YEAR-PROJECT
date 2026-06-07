/**
 * CompatibilityForm.jsx
 * 
 * Admin form for creating or editing equipment-detergent compatibility records.
 */

import React, { useState, useEffect, useRef } from 'react';
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

  // Search states
  const [equipSearch, setEquipSearch] = useState('');
  const [detSearch, setDetSearch] = useState('');
  const [showEquipDropdown, setShowEquipDropdown] = useState(false);
  const [showDetDropdown, setShowDetDropdown] = useState(false);
  
  // Refs for dropdowns
  const equipDropdownRef = useRef(null);
  const detDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    equipment_id: '',
    detergent_id: '',
    is_recommended: true,
    compatibility_notes: '',
  });

  // Helper to extract ID from various formats
  const extractId = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
      return item._id || item.equipment_id || item.detergent_id || item.id;
    }
    return null;
  };

  // Helper to get equipment display name
  const getEquipmentDisplay = (eq) => {
    if (!eq) return '';
    if (typeof eq === 'object' && eq.brand_name) {
      return `${eq.brand_name} ${eq.model_name || ''}`.trim();
    }
    const found = equipmentList.find(e => extractId(e) === eq);
    if (found) {
      return `${found.brand_name || ''} ${found.model_name || ''}`.trim() || found.name || 'Unknown Equipment';
    }
    return 'Unknown Equipment';
  };

  // Helper to get detergent display name
  const getDetergentDisplay = (det) => {
    if (!det) return '';
    if (typeof det === 'object' && det.product_name) {
      return det.product_name;
    }
    const found = detergentList.find(d => extractId(d) === det);
    if (found) {
      return found.product_name || found.name || 'Unknown Detergent';
    }
    return 'Unknown Detergent';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (equipDropdownRef.current && !equipDropdownRef.current.contains(event.target)) {
        setShowEquipDropdown(false);
      }
      if (detDropdownRef.current && !detDropdownRef.current.contains(event.target)) {
        setShowDetDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        setError('');
        try {
          console.log('Fetching compatibility with ID:', id);
          const res = await getCompatibilityById(id);
          console.log('API Response:', res.data);
          
          const data = res.data.data;
          
          // Extract IDs correctly from the response
          const equipmentId = extractId(data.equipment_id);
          const detergentId = extractId(data.detergent_id);
          
          setFormData({
            equipment_id: equipmentId || '',
            detergent_id: detergentId || '',
            is_recommended: data.is_recommended !== undefined ? data.is_recommended : true,
            compatibility_notes: data.compatibility_notes || '',
          });
          
          // Pre-populate search fields for display
          if (equipmentId) {
            const equip = equipmentList.find(e => extractId(e) === equipmentId);
            if (equip) {
              setEquipSearch(getEquipmentDisplay(equip));
            }
          }
          if (detergentId) {
            const det = detergentList.find(d => extractId(d) === detergentId);
            if (det) {
              setDetSearch(getDetergentDisplay(det));
            }
          }
        } catch (err) {
          console.error('Failed to load compatibility data:', err);
          setError(err.response?.data?.error || err.message || 'Failed to load compatibility data.');
        } finally {
          setLoading(false);
        }
      };
      fetchCompatibility();
    }
  }, [id, equipmentList, detergentList]);

  const selectedEquipment = equipmentList.find(eq => extractId(eq) === formData.equipment_id);
  const selectedDetergent = detergentList.find(det => extractId(det) === formData.detergent_id);

  // Filter equipment based on search
  const filteredEquipment = equipmentList.filter(eq => {
    const displayName = getEquipmentDisplay(eq);
    return displayName.toLowerCase().includes(equipSearch.toLowerCase());
  });

  // Filter detergents based on search
  const filteredDetergents = detergentList.filter(det => {
    const displayName = getDetergentDisplay(det);
    return displayName.toLowerCase().includes(detSearch.toLowerCase());
  });

  const handleSelectEquipment = (eq) => {
    const eqId = extractId(eq);
    setFormData(prev => ({ ...prev, equipment_id: eqId }));
    setEquipSearch(getEquipmentDisplay(eq));
    setShowEquipDropdown(false);
  };

  const handleSelectDetergent = (det) => {
    const detId = extractId(det);
    setFormData(prev => ({ ...prev, detergent_id: detId }));
    setDetSearch(getDetergentDisplay(det));
    setShowDetDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

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
      const payload = {
        equipment_id: formData.equipment_id,
        detergent_id: formData.detergent_id,
        is_recommended: formData.is_recommended,
        compatibility_notes: formData.compatibility_notes,
      };
      
      if (id) {
        console.log('Updating compatibility:', id, payload);
        await updateCompatibility(id, payload);
      } else {
        console.log('Creating compatibility:', payload);
        await createCompatibility(payload);
      }
      navigate('/admin/compatibility');
    } catch (err) {
      console.error('Save failed:', err);
      setError(err.response?.data?.error || err.message || 'Failed to save compatibility record.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingOptions) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 lg:px-6">
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-800">
              {id ? 'Edit Compatibility' : 'Add Compatibility'}
            </h1>
          </div>
          <button onClick={() => navigate('/admin/compatibility')} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Equipment Selection with Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Equipment *</label>
            <div className="relative" ref={equipDropdownRef}>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for equipment..."
                  value={equipSearch}
                  onChange={(e) => {
                    setEquipSearch(e.target.value);
                    setShowEquipDropdown(true);
                  }}
                  onFocus={() => setShowEquipDropdown(true)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                />
              </div>
              {showEquipDropdown && filteredEquipment.length > 0 && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg">
                  {filteredEquipment.map(eq => (
                    <button
                      key={extractId(eq)}
                      type="button"
                      onClick={() => handleSelectEquipment(eq)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                    >
                      <div className="font-medium text-slate-800">{getEquipmentDisplay(eq)}</div>
                      <div className="text-xs text-slate-400">{eq.machine_category?.replace(/_/g, ' ') || ''}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detergent Selection with Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Detergent *</label>
            <div className="relative" ref={detDropdownRef}>
              <div className="relative">
                <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for detergent..."
                  value={detSearch}
                  onChange={(e) => {
                    setDetSearch(e.target.value);
                    setShowDetDropdown(true);
                  }}
                  onFocus={() => setShowDetDropdown(true)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                />
              </div>
              {showDetDropdown && filteredDetergents.length > 0 && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg">
                  {filteredDetergents.map(det => (
                    <button
                      key={extractId(det)}
                      type="button"
                      onClick={() => handleSelectDetergent(det)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                    >
                      <div className="font-medium text-slate-800">{getDetergentDisplay(det)}</div>
                      <div className="text-xs text-slate-400">{det.detergent_category} | pH: {det.ph_value}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommendation Status */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-3">Compatibility Status *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_recommended: true }))}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
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
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Compatibility Notes (Optional)</label>
            <textarea
              name="compatibility_notes"
              value={formData.compatibility_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, compatibility_notes: e.target.value }))}
              rows="3"
              placeholder="e.g., Use at 1:50 dilution only, avoid mixing with alkaline detergents, etc."
              className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
            />
          </div>

          {/* Preview Section */}
          {selectedEquipment && selectedDetergent && (
            <div className={`p-4 rounded-lg border ${
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
                    {getEquipmentDisplay(selectedEquipment)} ↔ {getDetergentDisplay(selectedDetergent)}
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
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/admin/compatibility')}
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
              {saving ? 'Saving...' : 'Save Compatibility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
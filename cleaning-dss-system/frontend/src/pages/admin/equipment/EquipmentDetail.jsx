/**
 * EquipmentDetail.jsx
 * 
 * Admin page for viewing detailed information of a single equipment item.
 * Displays: basic info, intensity, domain, environment, aisle width, technical specs, cost breakdown, TCO, compatibility.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Package, 
  Zap, 
  Clock, 
  DollarSign,
  CheckCircle,
  XCircle,
  Building2,
  Weight,
  Battery,
  Truck,
  Gauge,
  Droplet,
  Brush,
  Tag,
  MapPin,
  Ruler,
  Settings
} from 'lucide-react';
import { getEquipmentById } from '../../../services/equipmentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { formatCurrencyUGX } from '../../../utils/format';
import { 
  intensityLabels, 
  intensityDescriptions,
  environmentLabels,
  getFiltrationLabel,
  getBrushLabel
} from '../../../utils/constants';

export const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!id) {
        setError('No equipment ID provided');
        setLoading(false);
        return;
      }
      try {
        const res = await getEquipmentById(id);
        setEquipment(res.data.data);
      } catch (err) {
        setError('Failed to load equipment details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [id]);

  const getPowerIcon = (source) => {
    switch(source) {
      case 'battery': return <Battery className="w-5 h-5 text-green-600" />;
      case 'corded_electric': return <Zap className="w-5 h-5 text-amber-600" />;
      default: return <Truck className="w-5 h-5 text-slate-600" />;
    }
  };

  const getDomainLabel = (domain) => {
    const map = {
      domestic: 'Domestic / Residential',
      commercial: 'Commercial / Professional',
      industrial: 'Industrial / Heavy-Duty',
    };
    return map[domain] || domain || 'Not specified';
  };

  const getEnvironmentLabel = (environment) => {
    const map = {
      indoor: 'Indoor Only',
      outdoor: 'Outdoor / Semi-outdoor',
      food_grade: 'Food‑Grade / Wet Area',
      hazardous: 'Hazardous / ATEX Zone',
      any: 'Any Environment',
    };
    return map[environment] || environment || 'Not specified';
  };

  // Helper to get spec value by attribute name
  const getSpecValue = (attributeName) => {
    return equipment.specifications?.find(s => s.attribute_name === attributeName)?.attribute_value;
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate('/admin/equipment')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Back to Equipment</button>
        </div>
      </div>
    );
  }
  if (!equipment) return null;

  const equipmentId = equipment._id || equipment.equipment_id;
  const intensityLabel = intensityLabels[equipment.intensity] || equipment.intensity;
  const domainLabel = getDomainLabel(equipment.domain);
  const environmentLabel = getEnvironmentLabel(equipment.environment);
  const filtrationType = getSpecValue('filtration_type');
  const brushType = getSpecValue('brush_type');
  const upholsteryAttachment = getSpecValue('upholstery_attachment') === 'true';

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 lg:px-6">
      <div className="mb-6 flex justify-between items-center">
        <button onClick={() => navigate('/admin/equipment')} className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Equipment
        </button>
        <Link to={`/admin/equipment/${equipmentId}/edit`} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition">
          <Edit className="w-4 h-4" /> Edit Equipment
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 h-48 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
              {equipment.image_url ? (
                <img src={equipment.image_url} alt={equipment.model_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-slate-400" /></div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">{equipment.brand_name} {equipment.model_name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded-md text-xs font-medium">
                  {equipment.machine_category?.replace(/_/g, ' ')}
                </span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium flex items-center gap-1">
                  {getPowerIcon(equipment.power_source)} {equipment.power_source?.replace(/_/g, ' ')}
                </span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {intensityLabel}
                </span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                  {domainLabel}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {environmentLabel}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Price:</span><p className="font-semibold text-slate-800">{formatCurrencyUGX(equipment.current_price_ugx)}</p></div>
                <div><span className="text-slate-500">Status:</span><p className="flex items-center gap-1">{equipment.in_stock !== false ? <><CheckCircle className="w-4 h-4 text-green-600" /> In Stock</> : <><XCircle className="w-4 h-4 text-red-600" /> Out of Stock</>}</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Details sections */}
        <div className="p-6 space-y-6">
          {/* Specifications Section */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4"><Settings className="w-5 h-5 text-cyan-600" /> Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-500 uppercase">Weight</span>
                <p className="font-semibold">{equipment.weight_kg ? `${equipment.weight_kg} kg` : '-'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-500 uppercase">Power Source</span>
                <p className="font-semibold capitalize">{equipment.power_source?.replace(/_/g, ' ')}</p>
              </div>
              {equipment.min_aisle_width_mm && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <span className="text-xs text-slate-500 uppercase">Min Aisle Width</span>
                  <p className="font-semibold">{equipment.min_aisle_width_mm / 10} cm</p>
                </div>
              )}
              {filtrationType && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <span className="text-xs text-slate-500 uppercase">Filtration</span>
                  <p className="font-semibold">{getFiltrationLabel(filtrationType)}</p>
                </div>
              )}
              {brushType && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <span className="text-xs text-slate-500 uppercase">Brush Type</span>
                  <p className="font-semibold">{getBrushLabel(brushType)}</p>
                </div>
              )}
              {upholsteryAttachment && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <span className="text-xs text-slate-500 uppercase">Upholstery Attachment</span>
                  <p className="font-semibold text-green-600">✓ Included</p>
                </div>
              )}
              {equipment.specifications?.map((spec, idx) => {
                // Skip already displayed specs
                const skipAttributes = ['filtration_type', 'brush_type', 'upholstery_attachment'];
                if (skipAttributes.includes(spec.attribute_name)) return null;
                return (
                  <div key={idx} className="bg-slate-50 rounded-lg p-3">
                    <span className="text-xs text-slate-500 uppercase">{spec.attribute_name}</span>
                    <p className="font-semibold">{spec.attribute_value} {spec.unit_of_measure}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4"><DollarSign className="w-5 h-5 text-emerald-600" /> Cost Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-lg p-3"><span className="text-xs text-slate-500 uppercase">Purchase Price</span><p className="font-semibold">{formatCurrencyUGX(equipment.current_price_ugx)}</p></div>
              <div className="bg-slate-50 rounded-lg p-3"><span className="text-xs text-slate-500 uppercase">Maintenance / Year</span><p className="font-semibold">{formatCurrencyUGX(equipment.estimated_maintenance_cost_per_year_ugx)}</p></div>
              <div className="bg-slate-50 rounded-lg p-3"><span className="text-xs text-slate-500 uppercase">Running Cost / Year</span><p className="font-semibold">{formatCurrencyUGX(equipment.estimated_running_cost_per_year_ugx)}</p></div>
            </div>
            <div className="mt-3 p-3 bg-cyan-50 rounded-lg"><span className="text-xs text-slate-500 uppercase">Estimated TCO per Year</span><p className="text-xl font-bold text-cyan-700">{formatCurrencyUGX(equipment.estimated_tco_per_year_ugx)}</p></div>
          </div>

          {/* Compatibility */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4"><Brush className="w-5 h-5 text-purple-600" /> Compatibility</h2>
            <div className="space-y-3">
              <div><span className="text-sm font-medium text-slate-700">Compatible Surfaces</span><div className="flex flex-wrap gap-2 mt-1">{equipment.surface_compatibility?.length ? equipment.surface_compatibility.map(s => <span key={s} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-md text-xs">{s}</span>) : <span className="text-slate-400 text-sm">None specified</span>}</div></div>
              <div><span className="text-sm font-medium text-slate-700">Compatible Dirt Types</span><div className="flex flex-wrap gap-2 mt-1">{equipment.dirt_compatibility?.length ? equipment.dirt_compatibility.map(d => <span key={d} className="px-2 py-1 bg-teal-100 text-teal-700 rounded-md text-xs">{d}</span>) : <span className="text-slate-400 text-sm">None specified</span>}</div></div>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-slate-200 pt-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Metadata</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">Created:</span><p>{new Date(equipment.createdAt).toLocaleString()}</p></div>
              <div><span className="text-slate-500">Last Updated:</span><p>{new Date(equipment.updatedAt).toLocaleString()}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
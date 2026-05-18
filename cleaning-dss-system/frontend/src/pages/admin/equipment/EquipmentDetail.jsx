/**
 * EquipmentDetail.jsx
 * 
 * Admin page for viewing detailed information of a single equipment item.
 * Fetches data from GET /equipment/:id and displays all fields in a structured card layout.
 * Features:
 * - Back button to return to equipment list
 * - Edit button to navigate to edit form
 * - Displays image, basic info, technical specs, compatibility, pricing, etc.
 * - Uses glassmorphism styling and Lucide icons.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Package, 
  Tag, 
  TrendingUp, 
  Zap, 
  Volume2, 
  Clock, 
  DollarSign,
  Leaf,
  CheckCircle,
  XCircle,
  Truck,
  Building2,
  Image as ImageIcon,
  HardDrive,
  AlertTriangle
} from 'lucide-react';
import { getEquipmentById } from '../../../services/equipmentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { formatCurrencyUGX } from '../../../utils/format';

export const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEquipment = async () => {
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

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/equipment')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl"
          >
            Back to Equipment List
          </button>
        </div>
      </div>
    );
  }
  if (!equipment) return null;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/admin/equipment')}
          className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Equipment
        </button>
        <Link
          to={`/admin/equipment/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition"
        >
          <Edit className="w-4 h-4" /> Edit Equipment
        </Link>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        {/* Header with image and basic info */}
        <div className="p-6 md:p-8 border-b border-slate-200">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="w-full md:w-48 h-48 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
              {equipment.image_url ? (
                <img src={equipment.image_url} alt={equipment.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>
            {/* Basic info */}
            <div className="flex-1">
              <h1 className="text-2xl font-black text-slate-800">{equipment.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {equipment.brand}
                </span>
                <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs capitalize">
                  {equipment.intensity} duty
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  {equipment.category.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Price:</span>
                  <p className="font-semibold text-slate-800">{formatCurrencyUGX(equipment.price_ugx)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <p className="flex items-center gap-1">
                    {equipment.in_stock ? (
                      <><CheckCircle className="w-4 h-4 text-green-600" /> In Stock</>
                    ) : (
                      <><XCircle className="w-4 h-4 text-red-600" /> Out of Stock</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details sections */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Technical Specifications */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-cyan-600" /> Technical Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-3">
                <span className="text-xs text-slate-500 uppercase">Power</span>
                <p className="font-semibold">{equipment.power_req?.kW} kW ({equipment.power_req?.type})</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <span className="text-xs text-slate-500 uppercase">Motor Type</span>
                <p className="font-semibold">{equipment.motor_type || '-'}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <span className="text-xs text-slate-500 uppercase">Noise Level</span>
                <p className="font-semibold">{equipment.noise_level_db} dB</p>
              </div>
            </div>
          </div>

          {/* Logistics & Maintenance */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-teal-600" /> Logistics & Maintenance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-3">
                <span className="text-xs text-slate-500 uppercase">Spare Part Lead Time</span>
                <p className="font-semibold">{equipment.spare_part_lead_time_days} days</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <span className="text-xs text-slate-500 uppercase">Local Supplier</span>
                <p className="font-semibold">{equipment.local_supplier || '-'}</p>
              </div>
            </div>
          </div>

          {/* Compatibility */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" /> Compatibility
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-slate-700">Compatible Surfaces</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {equipment.compatible_surfaces?.length ? (
                    equipment.compatible_surfaces.map(s => (
                      <span key={s} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs">{s}</span>
                    ))
                  ) : <span className="text-slate-400 text-sm">None specified</span>}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Compatible Dirt Types</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {equipment.compatible_dirt_types?.length ? (
                    equipment.compatible_dirt_types.map(d => (
                      <span key={d} className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">{d}</span>
                    ))
                  ) : <span className="text-slate-400 text-sm">None specified</span>}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Materials</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {equipment.materials?.length ? (
                    equipment.materials.map(m => (
                      <span key={m} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">{m}</span>
                    ))
                  ) : <span className="text-slate-400 text-sm">None specified</span>}
                </div>
              </div>
            </div>
          </div>

          {/* TCO & Eco */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-600" /> TCO & Environmental
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-3">
                <span className="text-xs text-slate-500 uppercase">Maintenance Factor</span>
                <p className="font-semibold">{equipment.tco_multipliers?.maintenance_factor || 1.0}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <span className="text-xs text-slate-500 uppercase">Power Factor</span>
                <p className="font-semibold">{equipment.tco_multipliers?.power_factor || 1.0}</p>
              </div>
            </div>
            {equipment.eco_certified && (
              <div className="mt-3 flex items-center gap-2 text-green-700 bg-green-50 rounded-xl p-3">
                <Leaf className="w-4 h-4" /> Eco Certified
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-slate-600" /> Additional Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Created at:</span>
                <p>{new Date(equipment.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-500">Last updated:</span>
                <p>{new Date(equipment.updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-500">Active:</span>
                <p>{equipment.active ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
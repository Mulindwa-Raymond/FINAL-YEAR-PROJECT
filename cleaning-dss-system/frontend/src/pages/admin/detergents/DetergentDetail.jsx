/**
 * DetergentDetail.jsx
 * 
 * Admin page for viewing detailed information of a single detergent.
 * Displays: product info, chemical properties, compatibility, pricing, safety, supplier info.
 * Note: in_stock field removed (informational only, no sales tracking).
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Droplet, 
  Leaf, 
  AlertTriangle,
  Package,
  Building2,
  FlaskConical,
  Scale,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { getDetergentById } from '../../../services/detergentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import DatabaseImage from '../../../components/common/DatabaseImage';
import { formatCurrencyUGX } from '../../../utils/format';

export const DetergentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detergent, setDetergent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getDetergentId = (det) => {
    return det?._id || det?.detergent_id || det?.id;
  };

  useEffect(() => {
    const fetchDetergent = async () => {
      if (!id) {
        setError('No detergent ID provided');
        setLoading(false);
        return;
      }
      try {
        const res = await getDetergentById(id);
        setDetergent(res.data.data);
      } catch (err) {
        setError('Failed to load detergent details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetergent();
  }, [id]);

  const getPhBadge = (ph) => {
    if (ph >= 12) return { label: 'Caustic', color: 'bg-red-100 text-red-700', icon: '🔥' };
    if (ph >= 10) return { label: 'High Alkaline', color: 'bg-orange-100 text-orange-700', icon: '⚡' };
    if (ph >= 8) return { label: 'Alkaline', color: 'bg-yellow-100 text-yellow-700', icon: '🧼' };
    if (ph >= 6) return { label: 'Neutral', color: 'bg-green-100 text-green-700', icon: '💧' };
    if (ph >= 4) return { label: 'Mild Acid', color: 'bg-yellow-100 text-yellow-700', icon: '⚠️' };
    return { label: 'Strong Acid', color: 'bg-red-100 text-red-700', icon: '⚠️' };
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'alkaline': return '🧪';
      case 'acidic': return '⚗️';
      case 'neutral': return '💧';
      case 'solvent_based': return '🧴';
      case 'enzymatic': return '🧬';
      case 'disinfectant': return '🦠';
      case 'degreaser': return '🧼';
      default: return '🧪';
    }
  };

  const getFormLabel = (form) => {
    switch(form) {
      case 'liquid': return 'Liquid';
      case 'powder': return 'Powder';
      case 'tablet': return 'Tablet';
      case 'gel': return 'Gel';
      case 'foam': return 'Foam';
      default: return form;
    }
  };

  const getDomainLabel = (domain) => {
    const map = {
      domestic: 'Domestic / Home Use',
      industrial: 'Industrial / Commercial',
      both: 'Both (Universal)',
    };
    return map[domain] || domain || 'Not specified';
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate('/admin/detergents')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Back to Detergents</button>
        </div>
      </div>
    );
  }
  
  if (!detergent) return null;

  const detergentId = getDetergentId(detergent);
  const phInfo = getPhBadge(detergent.ph_value);
  const domainLabel = getDomainLabel(detergent.domain);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 lg:px-6">
      {/* Header with back and edit buttons */}
      <div className="mb-6 flex justify-between items-center">
        <button onClick={() => navigate('/admin/detergents')} className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Detergents
        </button>
        <Link to={`/admin/detergents/${detergentId}/edit`} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition">
          <Edit className="w-4 h-4" /> Edit Detergent
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {/* Header Section with Image */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="w-full md:w-40 h-40 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
              <DatabaseImage
                src={detergent.image_url}
                alt={detergent.product_name}
                type="detergent"
                className="w-full h-full object-cover"
                fallbackSrc="https://via.placeholder.com/160x160?text=No+Image"
              />
            </div>
            
            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{detergent.product_name}</h1>
                  <p className="text-slate-500 mt-1">{detergent.brand_name || 'No brand specified'}</p>
                  {/* NEW: Domain badge */}
                  <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                    {domainLabel}
                  </span>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${phInfo.color} flex items-center gap-2`}>
                  <span>{phInfo.icon}</span> pH {detergent.ph_value} - {phInfo.label}
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                  <FlaskConical className="w-3 h-3" /> {detergent.detergent_category}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                  <Scale className="w-3 h-3" /> {getFormLabel(detergent.form)}
                </span>
                {detergent.requires_ppe && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" /> PPE Required
                  </span>
                )}
                {detergent.eco_certified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                    <Leaf className="w-3 h-3" /> Eco Certified
                  </span>
                )}
                {detergent.biodegradable && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                    ♻️ Biodegradable
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Sections */}
        <div className="p-6 space-y-6">
          {/* Chemical Properties */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-cyan-600" /> Chemical Properties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-500 uppercase">pH Value</span>
                <p className="font-semibold text-slate-800">{detergent.ph_value}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-500 uppercase">Dilution Ratio</span>
                <p className="font-semibold text-slate-800">{detergent.dilution_ratio || 'Not specified'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-500 uppercase">Form</span>
                <p className="font-semibold text-slate-800 capitalize">{getFormLabel(detergent.form)}</p>
              </div>
            </div>
          </div>

          {/* Compatibility */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" /> Compatibility
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-slate-700">Compatible Surfaces</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {detergent.surface_compatibility?.length ? (
                    detergent.surface_compatibility.map(s => (
                      <span key={s} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-md text-xs">{s}</span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">None specified</span>
                  )}
                </div>
              </div>
              {detergent.incompatible_surfaces?.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-slate-700">Incompatible Surfaces</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {detergent.incompatible_surfaces.map(s => (
                      <span key={s} className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-slate-700">Compatible Dirt Types</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {detergent.dirt_compatibility?.length ? (
                    detergent.dirt_compatibility.map(d => (
                      <span key={d} className="px-2 py-1 bg-teal-100 text-teal-700 rounded-md text-xs">{d}</span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">None specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Safety Information */}
          {detergent.hazard_alerts?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> Safety Information
              </h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {detergent.hazard_alerts.map(alert => (
                    <span key={alert} className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {alert}
                    </span>
                  ))}
                  {detergent.requires_ppe && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">⚠️ PPE Required when handling</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Supplier (removed in_stock) */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-emerald-600" /> Pricing & Supplier
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-500 uppercase">Price</span>
                <p className="font-semibold text-slate-800">{formatCurrencyUGX(detergent.current_price_ugx)}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-500 uppercase">Package Size</span>
                <p className="font-semibold text-slate-800">{detergent.unit_size ? `${detergent.unit_size} L` : 'Not specified'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-500 uppercase">Local Supplier</span>
                <p className="font-semibold text-slate-800">{detergent.local_supplier || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-slate-200 pt-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Metadata</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Created:</span>
                <p>{new Date(detergent.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-500">Last Updated:</span>
                <p>{new Date(detergent.updatedAt).toLocaleString()}</p>
              </div>
              {detergent.active !== undefined && (
                <div>
                  <span className="text-slate-500">Status:</span>
                  <p>{detergent.active ? 'Active' : 'Inactive'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetergentDetail;
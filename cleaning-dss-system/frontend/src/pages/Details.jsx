// frontend/src/pages/Details.jsx
import React, { useState } from 'react';
import DatabaseImage from '../components/common/DatabaseImage';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Battery,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Wrench,
  DollarSign,
  Shield,
  TrendingUp,
  Clock,
  Gauge,
  HardDrive,
  Flame,
  Wind,
  Award,
  Download,
  Share2,
  Printer,
  ThumbsUp,
  ThumbsDown,
  Leaf,
  Volume2,
  Ruler,
  Sparkles,
  Layers,
  Info,
  MessageSquare,
  Image as ImageIcon,
  Tag,
  Package,
  Building2,
  FlaskConical,
  AlertCircle,
  Check
} from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';

const formatCurrency = (amount) => {
  if (!amount) return 'UGX 0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper to get pH badge color
const getPhBadge = (ph) => {
  if (ph >= 12) return { label: 'Caustic', color: 'bg-red-100 text-red-700', icon: '🔥' };
  if (ph >= 10) return { label: 'High Alkaline', color: 'bg-orange-100 text-orange-700', icon: '⚡' };
  if (ph >= 8) return { label: 'Alkaline', color: 'bg-yellow-100 text-yellow-700', icon: '🧼' };
  if (ph >= 6) return { label: 'Neutral', color: 'bg-green-100 text-green-700', icon: '💧' };
  if (ph >= 4) return { label: 'Mild Acid', color: 'bg-yellow-100 text-yellow-700', icon: '⚠️' };
  return { label: 'Strong Acid', color: 'bg-red-100 text-red-700', icon: '⚠️' };
};

// Helper to get category display name
const getCategoryDisplayName = (category) => {
  const map = {
    floor_scrubber: 'Floor Scrubber',
    vacuum_cleaner: 'Vacuum Cleaner',
    pressure_washer: 'Pressure Washer',
    steam_cleaner: 'Steam Cleaner',
    carpet_cleaner: 'Carpet Cleaner',
    sweeper: 'Sweeper',
    scrubber_drier: 'Scrubber Drier',
    window_cleaner: 'Window Cleaner',
  };
  return map[category] || category?.replace(/_/g, ' ') || 'Equipment';
};

export default function Details() {
  const location = useLocation();
  const navigate = useNavigate();
  const { machine, recommendationId, category } = location.state || {};
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  if (!machine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white rounded-2xl shadow-lg">
          <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">No Machine Data</h2>
          <p className="text-slate-500 mt-2">We couldn't find the machine details. Please go back and try again.</p>
          <button onClick={() => navigate('/recommendation-results')} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">Back to Recommendations</button>
        </div>
      </div>
    );
  }

  const matchScore = machine.match_score || machine.final_score || machine.match || 85;
  const purchasePrice = machine.current_price_ugx || 0;
  const operatingCost = machine.estimated_operating_cost_per_year_ugx || 0;
  const specs = machine.specifications || {};
  const categoryName = category?.categoryName || getCategoryDisplayName(machine.machine_category);
  const detergent = machine.detergent;
  const phInfo = detergent ? getPhBadge(detergent.ph) : null;

  // Helper to render image with fallback (matches admin list pattern)
  const renderImage = (imageUrl, alt, containerClass = 'w-full h-full object-cover') => {
    if (!imageUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
          <Package className="w-12 h-12 text-slate-400" />
          <span className="text-xs text-slate-400 mt-1 font-mono">No Image</span>
        </div>
      );
    }
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={containerClass}
        onError={(e) => {
          e.target.style.display = 'none';
          const parent = e.target.parentElement;
          parent.innerHTML = `
            <div class="w-full h-full flex flex-col items-center justify-center bg-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><polyline points="21 15 16 10 5 21" stroke="currentColor"/></svg>
              <span class="text-xs text-slate-400 mt-1 font-mono">No Image</span>
            </div>
          `;
        }}
      />
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.03)_0px,_rgba(59,130,246,0.03)_2px,_transparent_2px,_transparent_20px)]" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
            <span className="text-sm font-medium">Back to Recommendations</span>
          </button>
          <div className="flex gap-2">
            <button onClick={() => setShowFeedback(true)} className="p-2 text-slate-500 hover:text-blue-600 transition rounded-lg hover:bg-blue-50"><ThumbsUp size={18} /></button>
            <button className="p-2 text-slate-500 hover:text-blue-600 transition rounded-lg hover:bg-blue-50"><Share2 size={18} /></button>
            <button className="p-2 text-slate-500 hover:text-blue-600 transition rounded-lg hover:bg-blue-50"><Printer size={18} /></button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden mb-8">
          <div className="relative h-80 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
            {renderImage(machine.image_url, machine.name, 'w-full h-full object-cover opacity-80')}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl px-5 py-3 shadow-lg border border-slate-200">
              <div className="text-center">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Match Score</p>
                <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-blue-600">{matchScore}</span><span className="text-sm text-slate-500">%</span></div>
              </div>
            </div>
            <div className="absolute bottom-6 left-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-[10px] font-mono text-white">
                  {machine.brand || 'Brand'}
                </span>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-[10px] font-mono text-white">
                  {categoryName}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">{machine.name || 'Equipment Name'}</h1>
              <p className="text-sm text-slate-300 mt-1 font-light">{machine.model_name || ''}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Technical Specs & Cost */}
          <div className="lg:col-span-2 space-y-8">
            {/* Technical Specifications Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center"><Gauge size={14} className="text-white" /></div>
                  <h2 className="text-lg font-bold text-slate-800">Technical Specifications</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: <Zap size={14} />, label: 'Power Source', value: machine.power_source?.replace(/_/g, ' ') || 'N/A' },
                    { icon: <Gauge size={14} />, label: 'Intensity', value: `${machine.intensity || 'Medium'} Duty` },
                    { icon: <Ruler size={14} />, label: 'Working Width', value: `${specs.working_width || machine.working_width_cm || 'N/A'} mm` },
                    { icon: <Droplets size={14} />, label: 'Tank Capacity', value: `${specs.tank_capacity || machine.tank_capacity_liters || 'N/A'} L` },
                    { icon: <Volume2 size={14} />, label: 'Noise Level', value: `${specs.noise_level || machine.noise_level_db || 'N/A'} dB` },
                    { icon: <Clock size={14} />, label: 'Area Performance', value: `${specs.area_performance || 'N/A'} m²/h` },
                    { icon: <Battery size={14} />, label: 'Battery Voltage', value: specs.battery_voltage ? `${specs.battery_voltage}V` : 'N/A' },
                    { icon: <HardDrive size={14} />, label: 'Weight', value: machine.weight_kg ? `${machine.weight_kg} kg` : 'N/A' },
                    { icon: <Package size={14} />, label: 'Motor Type', value: machine.motor_type || 'Standard' },
                    { icon: <Clock size={14} />, label: 'Spare Parts Lead Time', value: machine.spare_parts_lead_time_days ? `${machine.spare_parts_lead_time_days} days` : 'N/A' },
                    { icon: <Tag size={14} />, label: 'Subtype', value: machine.machine_subtype?.replace(/_/g, ' ') || 'N/A' },
                    { icon: <Building2 size={14} />, label: 'Domain', value: machine.domain || 'N/A' },
                    { icon: <Shield size={14} />, label: 'Environment', value: machine.environment?.replace(/_/g, ' ') || 'Any' },
                    { icon: <Ruler size={14} />, label: 'Min Aisle Width', value: machine.min_aisle_width_mm ? `${machine.min_aisle_width_mm} mm` : 'N/A' },
                  ].map((spec, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500">{spec.icon}<span className="text-xs">{spec.label}</span></div>
                      <span className="text-xs font-semibold text-slate-800">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cost Breakdown Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center"><DollarSign size={14} className="text-white" /></div>
                  <h2 className="text-lg font-bold text-slate-800">Cost Breakdown</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Purchase Price</span>
                    <span className="text-sm font-bold text-slate-700">{formatCurrency(purchasePrice)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Annual Maintenance</span>
                    <span className="text-sm font-bold text-amber-600">{formatCurrency(machine.estimated_maintenance_cost_per_year_ugx || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Annual Running Cost</span>
                    <span className="text-sm font-bold text-cyan-600">{formatCurrency(machine.estimated_running_cost_per_year_ugx || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-base font-bold text-slate-800">Annual Operating Cost</span>
                    <span className="text-xl font-bold text-emerald-600">{formatCurrency(operatingCost)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <Info size={10} /> Operating cost = maintenance + running (excludes purchase price)
                  </p>
                </div>
              </div>
            </div>

            {/* Reasoning Section (if available) */}
            {machine.reasoning && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
                  <div className="flex items-center gap-2"><MessageSquare size={16} className="text-indigo-600" /><h2 className="text-lg font-bold text-slate-800">Why This Recommendation?</h2></div>
                </div>
                <div className="p-6"><p className="text-sm text-slate-600 leading-relaxed">{machine.reasoning}</p></div>
              </div>
            )}
          </div>

          {/* Right Column - Compatibility & Detergent */}
          <div className="space-y-8">
            {/* Compatibility Alerts */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-amber-100">
                <div className="flex items-center gap-2"><Shield size={16} className="text-amber-600" /><h2 className="text-lg font-bold text-slate-800">Compatibility & Alerts</h2></div>
              </div>
              <div className="p-5">
                {machine.alerts && machine.alerts.length > 0 ? (
                  machine.alerts.map((alert, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-2"><AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" /><p className="text-xs text-amber-700">{alert}</p></div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200"><CheckCircle2 size={14} className="text-emerald-600" /><p className="text-xs text-emerald-700">No compatibility issues identified</p></div>
                )}
              </div>
            </div>

            {/* Detergent Card - Full Details */}
            {detergent ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100">
                  <div className="flex items-center gap-2"><Droplets size={16} className="text-cyan-600" /><h2 className="text-lg font-bold text-slate-800">Recommended Detergent</h2></div>
                </div>
                <div className="p-5">
                  {/* Detergent Image */}
                  <div className="flex gap-5 mb-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border border-cyan-200 flex-shrink-0 shadow-sm">
                      {detergent.image_url ? (
                        <img
                          src={detergent.image_url}
                          alt={detergent.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-cyan-100"><Droplets size={32} className="text-cyan-500" /></div>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-cyan-100"><Droplets size={32} className="text-cyan-500" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-800 truncate">{detergent.name}</h3>
                      <p className="text-sm text-slate-500">{detergent.brand_name || 'No brand'}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {detergent.eco_certified && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full"><Leaf size={12} /> Eco Certified</span>
                        )}
                        {detergent.biodegradable && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full"><CheckCircle2 size={12} /> Biodegradable</span>
                        )}
                        {detergent.requires_ppe && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full"><AlertCircle size={12} /> PPE Required</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detergent Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] text-slate-400 uppercase">Category</p>
                      <p className="font-semibold text-slate-800 capitalize">{detergent.detergent_category || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] text-slate-400 uppercase">pH Value</p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{detergent.ph}</span>
                        {phInfo && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold ${phInfo.color}`}>
                            {phInfo.icon} {phInfo.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] text-slate-400 uppercase">Unit Size</p>
                      <p className="font-semibold text-slate-800">{detergent.unit_size} L</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] text-slate-400 uppercase">Price</p>
                      <p className="font-semibold text-emerald-600">{formatCurrency(detergent.current_price_ugx)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 col-span-2">
                      <p className="text-[10px] text-slate-400 uppercase">Dilution Ratio</p>
                      <p className="font-semibold text-slate-800">{detergent.dilution_ratio || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Surface & Dirt Compatibility */}
                  <div className="mt-4 space-y-2">
                    {detergent.surface_compatibility && detergent.surface_compatibility.length > 0 && (
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Compatible Surfaces</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {detergent.surface_compatibility.map((s, i) => (
                            <span key={i} className="inline-flex items-center text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">✓ {s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {detergent.dirt_compatibility && detergent.dirt_compatibility.length > 0 && (
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Compatible Dirt Types</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {detergent.dirt_compatibility.map((d, i) => (
                            <span key={i} className="inline-flex items-center text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">✓ {d}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hazard Alerts */}
                  {detergent.hazard_alerts && detergent.hazard_alerts.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-[10px] text-red-600 font-bold uppercase">Hazard Alerts</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {detergent.hazard_alerts.map((h, i) => (
                          <span key={i} className="inline-flex items-center text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full"><AlertTriangle size={10} /> {h}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Supplier Info */}
                  {detergent.local_supplier && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase">Local Supplier</p>
                      <p className="font-semibold text-slate-800">{detergent.local_supplier}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center gap-2"><Droplets size={16} className="text-slate-400" /><h2 className="text-lg font-bold text-slate-600">Recommended Detergent</h2></div>
                </div>
                <div className="p-5 text-center">
                  <Droplets size={48} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No specific detergent match found.</p>
                  <p className="text-xs text-slate-400 mt-1">Please consult equipment manual for compatible chemicals.</p>
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-blue-500/20 shadow-lg">
              <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center"><Award size={14} className="text-amber-400" /></div><h3 className="text-sm font-bold text-white">Ready to Proceed?</h3></div>
              <p className="text-xs text-slate-300 mb-5">Request a quote or contact our equipment specialists for more information about this machine.</p>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-md transition">Request Quote</button>
                <button className="flex-1 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition">Contact Expert</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => navigate('/recommendation-results')} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition group">
            Back to all recommendations <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
          </button>
        </div>
      </main>

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} recommendationId={recommendationId} onSuccess={() => { setFeedbackSubmitted(true); setShowFeedback(false); }} />
    </div>
  );
}
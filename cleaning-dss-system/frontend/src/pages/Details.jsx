// frontend/src/pages/Details.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Battery,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Gauge,
  DollarSign,
  Shield,
  Clock,
  HardDrive,
  Package,
  Award,
  Share2,
  Printer,
  Leaf,
  Volume2,
  Ruler,
  Tag,
  Building2,
  AlertCircle,
  Info,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  Wrench,
  Flame,
  Wind,
  Sparkles,
  Layers,
  Image as ImageIcon,
  FlaskConical,
  Check,
  ChevronDown,
  ChevronUp
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

const getPhBadge = (ph) => {
  if (ph >= 12) return { label: 'Caustic', color: 'bg-red-100 text-red-700', icon: '🔥' };
  if (ph >= 10) return { label: 'High Alkaline', color: 'bg-orange-100 text-orange-700', icon: '⚡' };
  if (ph >= 8) return { label: 'Alkaline', color: 'bg-yellow-100 text-yellow-700', icon: '🧼' };
  if (ph >= 6) return { label: 'Neutral', color: 'bg-green-100 text-green-700', icon: '💧' };
  if (ph >= 4) return { label: 'Mild Acid', color: 'bg-yellow-100 text-yellow-700', icon: '⚠️' };
  return { label: 'Strong Acid', color: 'bg-red-100 text-red-700', icon: '⚠️' };
};

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
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);

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

  // --- Enhanced specifications list ---
  const coreSpecs = [
    { icon: <Zap size={16} />, label: 'Power Source', value: machine.power_source?.replace(/_/g, ' ') || 'N/A' },
    { icon: <Gauge size={16} />, label: 'Intensity', value: `${machine.intensity || 'Medium'} Duty` },
    { icon: <Ruler size={16} />, label: 'Working Width', value: `${specs.working_width || machine.working_width_cm || 'N/A'} mm` },
    { icon: <Droplets size={16} />, label: 'Tank Capacity', value: `${specs.tank_capacity || machine.tank_capacity_liters || 'N/A'} L` },
    { icon: <Volume2 size={16} />, label: 'Noise Level', value: `${specs.noise_level || machine.noise_level_db || 'N/A'} dB` },
    { icon: <Clock size={16} />, label: 'Area Performance', value: `${specs.area_performance || 'N/A'} m²/h` },
    { icon: <Battery size={16} />, label: 'Battery Voltage', value: specs.battery_voltage ? `${specs.battery_voltage}V` : 'N/A' },
    { icon: <HardDrive size={16} />, label: 'Weight', value: machine.weight_kg ? `${machine.weight_kg} kg` : 'N/A' },
    { icon: <Package size={16} />, label: 'Motor Type', value: machine.motor_type || 'Standard' },
    { icon: <Clock size={16} />, label: 'Spare Parts Lead Time', value: machine.spare_parts_lead_time_days ? `${machine.spare_parts_lead_time_days} days` : 'N/A' },
    { icon: <Tag size={16} />, label: 'Subtype', value: machine.machine_subtype?.replace(/_/g, ' ') || 'N/A' },
    { icon: <Building2 size={16} />, label: 'Domain', value: machine.domain || 'N/A' },
    { icon: <Shield size={16} />, label: 'Environment', value: machine.environment?.replace(/_/g, ' ') || 'Any' },
    { icon: <Ruler size={16} />, label: 'Min Aisle Width', value: machine.min_aisle_width_mm ? `${machine.min_aisle_width_mm} mm` : 'N/A' },
  ];

  // Additional specs (commonly available)
  const additionalSpecs = [
    { icon: <Award size={16} />, label: 'Warranty', value: machine.warranty_years ? `${machine.warranty_years} years` : (machine.warranty_months ? `${machine.warranty_months} months` : 'N/A') },
    { icon: <Zap size={16} />, label: 'Power Consumption', value: machine.power_consumption_w ? `${machine.power_consumption_w} W` : (machine.motor_power_kw ? `${machine.motor_power_kw} kW` : 'N/A') },
    { icon: <Ruler size={16} />, label: 'Dimensions (L×W×H)', value: machine.dimensions || (machine.dimensions_mm ? `${machine.dimensions_mm} mm` : 'N/A') },
    { icon: <TrendingUp size={16} />, label: 'Energy Rating', value: machine.energy_efficiency_class || machine.energy_rating || 'N/A' },
    { icon: <Shield size={16} />, label: 'Certifications', value: machine.safety_certifications?.join(', ') || machine.certifications?.join(', ') || 'N/A' },
    { icon: <Flame size={16} />, label: 'Operating Temperature', value: machine.operating_temp_c ? `${machine.operating_temp_c} °C` : (machine.temperature_range ? machine.temperature_range : 'N/A') },
    { icon: <Wind size={16} />, label: 'Airflow', value: machine.airflow_m3h ? `${machine.airflow_m3h} m³/h` : (specs.airflow ? `${specs.airflow} m³/h` : 'N/A') },
  ];

  // Combine all specs, filter out those with "N/A" for the "more" section (but we'll show all)
  // We'll keep coreSpecs always visible, and additionalSpecs in an expandable section.

  // For the main display, we show coreSpecs (14 items) and if there are additional, we show a toggle.
  const hasAdditionalSpecs = additionalSpecs.some(s => s.value !== 'N/A');

  // Helper to render image – now larger
  const renderImage = (imageUrl, alt) => {
    if (!imageUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
          <Package className="w-16 h-16 text-slate-400" />
          <span className="text-sm text-slate-400 mt-2 font-mono">No Image</span>
        </div>
      );
    }
    return (
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          const parent = e.target.parentElement;
          parent.innerHTML = `
            <div class="w-full h-full flex flex-col items-center justify-center bg-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><polyline points="21 15 16 10 5 21" stroke="currentColor"/></svg>
              <span class="text-sm text-slate-400 mt-2 font-mono">No Image</span>
            </div>
          `;
        }}
      />
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 py-6 px-4 sm:px-6 lg:py-12">
      {/* Background decorative blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        {/* Navigation and actions */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
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

        {/* Main Card – unified design */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden backdrop-blur-sm">

          {/* --- Image + Header Row --- */}
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/5 bg-gradient-to-br from-slate-100 to-slate-200/50 p-4 flex items-center justify-center">
              <div className="w-full aspect-[4/3] max-h-[400px] rounded-2xl overflow-hidden bg-white shadow-md border border-slate-200">
                {renderImage(machine.image_url, machine.name)}
              </div>
            </div>
            <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                    {machine.brand || 'Brand'}
                  </span>
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200">
                    {categoryName}
                  </span>
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                    {matchScore}% Match
                  </span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{machine.name || 'Equipment Name'}</h1>
                <p className="text-sm text-slate-500 mt-1">{machine.model_name || ''}</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-5">
                <div>
                  <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-medium">Purchase Price</span>
                  <span className="text-xl font-bold text-slate-800">{formatCurrency(purchasePrice)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-medium">Annual Operating Cost</span>
                  <span className="text-xl font-bold text-emerald-600">{formatCurrency(operatingCost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Specs + Cost row (flex with equal height) --- */}
          <div className="p-6 lg:p-8 border-t border-slate-200">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              {/* Specifications - takes 2/3 */}
              <div className="lg:flex-[2] flex flex-col">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Gauge size={18} className="text-blue-600" /> Technical Specifications
                </h2>
                <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    {coreSpecs.map((spec, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-200/70 last:border-0">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <span className="text-blue-500">{spec.icon}</span>
                          <span>{spec.label}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-800">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                  {/* Expandable additional specs */}
                  {hasAdditionalSpecs && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowMoreSpecs(!showMoreSpecs)}
                        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
                      >
                        {showMoreSpecs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {showMoreSpecs ? 'Hide additional specs' : 'Show additional specs'}
                      </button>
                      {showMoreSpecs && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 border-t border-slate-200 pt-3">
                          {additionalSpecs.map((spec, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-200/70 last:border-0">
                              <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <span className="text-blue-500">{spec.icon}</span>
                                <span>{spec.label}</span>
                              </div>
                              <span className="text-sm font-medium text-slate-800">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Cost Breakdown - takes 1/3 */}
              <div className="lg:flex-1 flex flex-col">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <DollarSign size={18} className="text-emerald-600" /> Cost Breakdown
                </h2>
                <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Purchase Price</span>
                      <span className="text-sm font-bold text-slate-700">{formatCurrency(purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                      <span className="text-sm text-slate-600">Maintenance / year</span>
                      <span className="text-sm font-bold text-amber-600">{formatCurrency(machine.estimated_maintenance_cost_per_year_ugx || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                      <span className="text-sm text-slate-600">Running cost / year</span>
                      <span className="text-sm font-bold text-cyan-600">{formatCurrency(machine.estimated_running_cost_per_year_ugx || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200 pt-3 mt-1">
                      <span className="text-sm font-semibold text-slate-700">Annual Operating Cost</span>
                      <span className="text-lg font-bold text-emerald-600">{formatCurrency(operatingCost)}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-4">
                    <Info size={12} /> Operating cost = maintenance + running (excludes purchase price)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Detergent + Alerts row (equal height) --- */}
          <div className="p-6 lg:p-8 border-t border-slate-200">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              {/* Detergent */}
              <div className="lg:flex-1 flex flex-col">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Droplets size={18} className="text-cyan-600" /> Recommended Detergent
                </h2>
                {detergent ? (
                  <div className="bg-gradient-to-br from-cyan-50/70 to-blue-50/70 rounded-2xl p-5 border border-cyan-200/70 shadow-sm flex-1">
                    <div className="flex gap-4 items-start">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-cyan-200 flex-shrink-0 shadow-sm">
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
                        <h4 className="text-base font-bold text-slate-800 truncate">{detergent.name}</h4>
                        <p className="text-xs text-slate-500">{detergent.brand_name || ''}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {detergent.eco_certified && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"><Leaf size={12} /> Eco Certified</span>
                          )}
                          {detergent.biodegradable && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"><CheckCircle2 size={12} /> Biodegradable</span>
                          )}
                          {detergent.requires_ppe && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full"><AlertCircle size={12} /> PPE Required</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-slate-500">Category:</span> <span className="font-semibold capitalize">{detergent.detergent_category}</span></div>
                      <div><span className="text-slate-500">pH:</span> <span className="font-semibold inline-flex items-center gap-1">{detergent.ph} {phInfo && <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${phInfo.color}`}>{phInfo.icon} {phInfo.label}</span>}</span></div>
                      <div><span className="text-slate-500">Unit:</span> <span className="font-semibold">{detergent.unit_size} L</span></div>
                      <div><span className="text-slate-500">Price:</span> <span className="font-semibold text-emerald-600">{formatCurrency(detergent.current_price_ugx)}</span></div>
                      <div className="col-span-2"><span className="text-slate-500">Dilution:</span> <span className="font-semibold">{detergent.dilution_ratio || 'N/A'}</span></div>
                    </div>
                    {detergent.surface_compatibility?.length > 0 && (
                      <div className="mt-3">
                        <span className="text-[10px] text-slate-500 uppercase font-medium">Compatible Surfaces:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {detergent.surface_compatibility.map((s, i) => (
                            <span key={i} className="text-[10px] bg-cyan-100/80 text-cyan-700 px-2 py-0.5 rounded-full">✓ {s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {detergent.dirt_compatibility?.length > 0 && (
                      <div className="mt-2">
                        <span className="text-[10px] text-slate-500 uppercase font-medium">Dirt Types:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {detergent.dirt_compatibility.map((d, i) => (
                            <span key={i} className="text-[10px] bg-teal-100/80 text-teal-700 px-2 py-0.5 rounded-full">✓ {d}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {detergent.hazard_alerts?.length > 0 && (
                      <div className="mt-3 p-3 bg-red-50/80 border border-red-200 rounded-xl">
                        <span className="text-[10px] text-red-600 font-bold uppercase">Hazards:</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {detergent.hazard_alerts.map((h, i) => (
                            <span key={i} className="text-[10px] bg-red-100/80 text-red-700 px-2 py-0.5 rounded-full"><AlertTriangle size={10} /> {h}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {detergent.local_supplier && (
                      <div className="mt-3 text-sm text-slate-500"><span className="font-medium">Supplier:</span> {detergent.local_supplier}</div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 text-center text-slate-500 flex-1 flex flex-col items-center justify-center">
                    <Droplets size={32} className="text-slate-300 mb-2" />
                    <p className="text-sm">No specific detergent match found.</p>
                    <p className="text-xs text-slate-400 mt-1">Consult equipment manual for compatible chemicals.</p>
                  </div>
                )}
              </div>

              {/* Compatibility & Alerts */}
              <div className="lg:flex-1 flex flex-col">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-amber-600" /> Compatibility & Alerts
                </h2>
                <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 flex-1 flex flex-col justify-center">
                  {machine.alerts && machine.alerts.length > 0 ? (
                    machine.alerts.map((alert, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200/70 mb-3 last:mb-0">
                        <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-700">{alert}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50/80 rounded-xl border border-emerald-200/70">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      <p className="text-sm text-emerald-700">No compatibility issues identified</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* --- Reasoning (if available) --- */}
          {machine.reasoning && (
            <div className="p-6 lg:p-8 border-t border-slate-200">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-indigo-600" /> Why This Recommendation?
              </h2>
              <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/70 text-sm text-slate-700 leading-relaxed">
                {machine.reasoning}
              </div>
            </div>
          )}

          {/* --- Call to Action --- */}
          <div className="p-6 lg:p-8 border-t border-slate-200 bg-gradient-to-br from-slate-50/80 to-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Award size={24} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Ready to Proceed?</h3>
                  <p className="text-sm text-slate-500">Request a quote or speak with our specialists.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:shadow-lg hover:scale-[1.02] transition-all">Request Quote</button>
                <button className="px-6 py-3 bg-white border border-slate-300 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-slate-50 hover:shadow-sm transition-all">Contact Expert</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
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
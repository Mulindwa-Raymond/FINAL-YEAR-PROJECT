/**
 * Details.jsx
 * Detailed view of a single equipment recommendation.
 * Shows comprehensive specs, TCO breakdown, and detergent recommendations.
 */

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
  BarChart3,
  Wrench,
  DollarSign,
  Shield,
  Star,
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
  Factory,
  Volume2,
  Ruler,
  Sparkles,
  Layers,
  Info,
  MessageSquare
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

const getIntensityColor = (intensity) => {
  switch(intensity?.toLowerCase()) {
    case 'light': return 'text-emerald-600 bg-emerald-50';
    case 'medium': return 'text-amber-600 bg-amber-50';
    case 'heavy': return 'text-red-600 bg-red-50';
    default: return 'text-slate-600 bg-slate-100';
  }
};

export default function Details() {
  const location = useLocation();
  const navigate = useNavigate();
  const { machine, recommendationId, category } = location.state || {};
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  console.log('Details page - location.state:', location.state);

  if (!machine) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Machine Data</h2>
          <p className="text-slate-500 mb-6">We couldn't find the machine details. Please go back and try again.</p>
          <button
            onClick={() => navigate('/recommendation-results')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Back to Recommendations
          </button>
        </div>
      </div>
    );
  }

  const matchScore = machine.match_score || machine.final_score || machine.match || 85;
  const tcoScore = machine.estimated_tco_per_year_ugx || machine.tco_5year_ugx || 0;
  const specs = machine.specifications || {};

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.03)_0px,_rgba(59,130,246,0.03)_2px,_transparent_2px,_transparent_20px)]"></div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 lg:py-12">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
            <span className="text-sm font-medium">Back to Recommendations</span>
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFeedback(true)}
              className="p-2 text-slate-500 hover:text-blue-600 transition rounded-lg hover:bg-blue-50"
              title="Give Feedback"
            >
              <ThumbsUp size={18} />
            </button>
            <button className="p-2 text-slate-500 hover:text-blue-600 transition rounded-lg hover:bg-blue-50" title="Share">
              <Share2 size={18} />
            </button>
            <button className="p-2 text-slate-500 hover:text-blue-600 transition rounded-lg hover:bg-blue-50" title="Print">
              <Printer size={18} />
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
            {machine.image_url ? (
              <img
                src={machine.image_url}
                alt={machine.name}
                className="w-full h-full object-cover opacity-70"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=Equipment+Image';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Wrench className="w-24 h-24 text-slate-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            
            {/* Match Score Overlay */}
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl px-5 py-3 shadow-lg border border-slate-200">
              <div className="text-center">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Match Score</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-blue-600">{matchScore}</span>
                  <span className="text-sm text-slate-500">%</span>
                </div>
              </div>
            </div>
            
            {/* Title Overlay */}
            <div className="absolute bottom-6 left-6">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-[10px] font-mono text-white mb-2">
                {machine.brand || 'Brand'} • {category?.categoryName || machine.machine_category?.replace(/_/g, ' ') || 'Equipment'}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">{machine.name || 'Equipment Name'}</h1>
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same... */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Key Specifications */}
          <div className="lg:col-span-2 space-y-8">
            {/* Specifications Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Gauge size={14} className="text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Technical Specifications</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: <Zap size={14} />, label: 'Power Source', value: machine.power_source?.replace(/_/g, ' ') || 'N/A' },
                    { icon: <Gauge size={14} />, label: 'Intensity', value: `${machine.intensity || 'Medium'} Duty` },
                    { icon: <Ruler size={14} />, label: 'Working Width', value: `${specs.working_width || machine.working_width || 'N/A'} mm` },
                    { icon: <Droplets size={14} />, label: 'Tank Capacity', value: `${specs.tank_capacity || specs.solution_tank_capacity || machine.tank_capacity || 'N/A'} L` },
                    { icon: <Volume2 size={14} />, label: 'Noise Level', value: `${specs.noise_level || machine.noise_level || 'N/A'} dB` },
                    { icon: <Clock size={14} />, label: 'Area Performance', value: `${specs.area_performance || machine.area_performance || 'N/A'} m²/h` },
                    { icon: <Battery size={14} />, label: 'Battery Voltage', value: specs.battery_voltage ? `${specs.battery_voltage}V` : 'N/A' },
                    { icon: <HardDrive size={14} />, label: 'Weight', value: machine.weight_kg ? `${machine.weight_kg} kg` : 'N/A' },
                  ].map((spec, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500">
                        {spec.icon}
                        <span className="text-xs">{spec.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-800">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TCO Breakdown Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <DollarSign size={14} className="text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Total Cost of Ownership</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { label: 'Purchase Price', value: formatCurrency(machine.current_price_ugx || machine.purchase_price || 0), color: 'text-slate-700' },
                    { label: 'Annual Maintenance', value: formatCurrency(machine.estimated_maintenance_cost_per_year_ugx || 0), color: 'text-amber-600' },
                    { label: 'Annual Running Cost', value: formatCurrency(machine.estimated_running_cost_per_year_ugx || 0), color: 'text-cyan-600' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-sm text-slate-500">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-base font-bold text-slate-800">Projected Annual TCO</span>
                    <span className="text-xl font-bold text-emerald-600">{formatCurrency(tcoScore)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <Info size={10} /> Includes local maintenance multipliers and operational factors
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-8">
            {/* Compatibility & Alerts */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-amber-600" />
                  <h2 className="text-lg font-bold text-slate-800">Compatibility & Alerts</h2>
                </div>
              </div>
              <div className="p-5">
                {machine.alerts && machine.alerts.length > 0 ? (
                  <div className="space-y-3">
                    {machine.alerts.map((alert, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-700">{alert}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <p className="text-xs text-emerald-700">No compatibility issues identified</p>
                  </div>
                )}
              </div>
            </div>

            {/* Detergent Recommendation */}
            {machine.detergent && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100">
                  <div className="flex items-center gap-2">
                    <Droplets size={16} className="text-cyan-600" />
                    <h2 className="text-lg font-bold text-slate-800">Recommended Detergent</h2>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex gap-4">
                    {machine.detergent.image_url ? (
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-cyan-100 flex-shrink-0">
                        <img
                          src={machine.detergent.image_url}
                          alt={machine.detergent.name || 'Detergent'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-700"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg></div>';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                        <Droplets size={24} className="text-cyan-700" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">{machine.detergent.name || machine.detergent.product_name}</h3>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        pH {machine.detergent.ph || machine.detergent.ph_value} · {formatCurrency(machine.detergent.current_price_ugx)}/{machine.detergent.unit_size}L
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {machine.detergent.eco_certified && (
                          <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            <Leaf size={10} /> Eco Certified
                          </span>
                        )}
                        {machine.detergent.biodegradable && (
                          <span className="inline-flex items-center gap-1 text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={10} /> Biodegradable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-blue-500/20 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Award size={14} className="text-amber-400" />
                </div>
                <h3 className="text-sm font-bold text-white">Ready to Proceed?</h3>
              </div>
              <p className="text-xs text-slate-300 mb-5">
                Request a quote or contact our equipment specialists for more information about this machine.
              </p>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-md transition">
                  Request Quote
                </button>
                <button className="flex-1 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition">
                  Contact Expert
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reasoning Section */}
        {machine.reasoning && (
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">Why This Recommendation?</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                {machine.reasoning}
              </p>
            </div>
          </div>
        )}

        {/* Compare More Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/recommendation-results')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition group"
          >
            Back to all recommendations
            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
          </button>
        </div>
      </main>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        recommendationId={recommendationId}
        onSuccess={() => {
          setFeedbackSubmitted(true);
          setShowFeedback(false);
        }}
      />
    </div>
  );
}
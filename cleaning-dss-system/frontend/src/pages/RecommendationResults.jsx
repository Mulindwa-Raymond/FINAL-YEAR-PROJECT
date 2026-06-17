/**
 * RecommendationResults.jsx
 * Displays equipment recommendations from the inference engine.
 * Shows matching score, TCO, alerts, and detergent recommendations.
 * Automatically saves recommendations to user history.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Zap,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  X,
  Wrench,
  DollarSign,
  Shield,
  TrendingUp,
  Clock,
  Leaf,
  Gauge,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Layers,
  Save,
  Check
} from 'lucide-react';
import DatabaseImage from '../components/common/DatabaseImage';
import { useAuth } from '../contexts/AuthContext';
import { saveRecommendationToHistory } from '../services/recommendationHistoryService';

const formatCurrency = (amount) => {
  if (!amount) return 'UGX 0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper to get intensity color
const getIntensityColor = (intensity) => {
  switch(intensity?.toLowerCase()) {
    case 'light': return 'from-emerald-500 to-emerald-600';
    case 'medium': return 'from-amber-500 to-amber-600';
    case 'heavy': return 'from-red-500 to-red-600';
    default: return 'from-slate-500 to-slate-600';
  }
};

// Helper to get match score color
const getMatchScoreColor = (score) => {
  if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

export default function RecommendationResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { recommendations, recommendationId, answers, categoryConfig, categoryInfo } = location.state || {};
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error
  const [saveError, setSaveError] = useState(null);
  
  const category = categoryInfo || categoryConfig || {};
  const [fadeIn, setFadeIn] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const hasSaved = useRef(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Auto-save recommendation to history when component loads
  useEffect(() => {
    const saveRecommendation = async () => {
      // Don't save if already saved, no recommendations, or not authenticated
      if (hasSaved.current || !recommendations || recommendations.length === 0 || !isAuthenticated) {
        return;
      }

      setSaveStatus('saving');
      
      try {
        // Prepare the recommendation data for the backend
        const primaryMachine = recommendations[0];
        const detergentData = recommendations.find(m => m.detergent)?.detergent;
        
        // Get equipment IDs from the recommendation data
        // Note: You'll need to map the actual equipment IDs from your database
        const recommendedEquipmentId = primaryMachine?._id || primaryMachine?.id;
        
        const recommendationData = {
          // Input facts from user
          area_size: answers?.area_size || 0,
          surface_type: answers?.surface_type || category?.surfaceType,
          dirt_type: answers?.dirt_type || category?.dirtType,
          power_stability: answers?.power_stability || 'stable',
          eco_preference: answers?.eco_preference || false,
          
          // Category and brand tracking
          machine_category: category?.categoryId || category?.machineCategory,
          machine_subtype: category?.selectedSubtype,
          brand_name: primaryMachine?.brand,
          
          // Additional user inputs
          usage_hours_per_week: answers?.usage_hours_per_week || 0,
          noise_sensitive: answers?.noise_sensitive || false,
          floor_texture: answers?.floor_texture,
          environment: answers?.environment,
          power_source: primaryMachine?.power_source,
          aisle_width: answers?.aisle_width,
          soil_level: answers?.soil_level,
          use_case: answers?.use_case,
          pressure_required: answers?.pressure_required,
          filtration: answers?.filtration,
          tank_capacity: answers?.tank_capacity,
          noise_sensitivity: answers?.noise_sensitivity,
          
          // Final recommendations
          recommended_equipment_id: recommendedEquipmentId,
          recommended_detergent_id: detergentData?._id || detergentData?.id,
          alternative_equipment_ids: recommendations.slice(1).map(m => m._id || m.id).filter(Boolean),
          
          // TCO and scoring
          estimated_tco_per_year_ugx: primaryMachine?.estimated_tco_per_year_ugx || primaryMachine?.tco_5year_ugx,
          final_score: primaryMachine?.match_score || primaryMachine?.final_score || primaryMachine?.match || 85,
          
          // Alerts and explanations
          alerts_triggered: (() => {
            const alerts = [];
            recommendations.forEach(m => {
              if (m.alerts && m.alerts.length > 0) {
                m.alerts.forEach(alert => {
                  alerts.push({
                    message: alert,
                    explanation: alert,
                    severity: 'warning'
                  });
                });
              }
            });
            return alerts;
          })(),
          summary_explanation: primaryMachine?.reasoning || `Recommended based on ${answers?.surface_type} surface and ${answers?.dirt_type} soil conditions.`,
          
          // Additional fields
          cleaning_frequency: answers?.cleaning_frequency || 'weekly',
          function: answers?.function,
          carpet_type: answers?.carpet_type,
          location: answers?.location
        };
        
        // Remove undefined values
        Object.keys(recommendationData).forEach(key => {
          if (recommendationData[key] === undefined || recommendationData[key] === null) {
            delete recommendationData[key];
          }
        });
        
        console.log('💾 Saving recommendation to history:', recommendationData);
        
        const response = await saveRecommendationToHistory(recommendationData);
        console.log('✅ Recommendation saved successfully:', response.data);
        setSaveStatus('saved');
        hasSaved.current = true;
        
        // Auto-clear saved status after 3 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
        
      } catch (error) {
        console.error('❌ Failed to save recommendation:', error);
        setSaveStatus('error');
        setSaveError(error.response?.data?.error || 'Failed to save recommendation to history');
        
        // Auto-clear error after 5 seconds
        setTimeout(() => {
          setSaveStatus('idle');
          setSaveError(null);
        }, 5000);
      }
    };
    
    saveRecommendation();
  }, [recommendations, answers, category, isAuthenticated]);

  const addToCompare = (machine) => {
    const machineId = machine.id || machine._id;
    if (compareList.length < 2 && !compareList.find(m => (m.id || m._id) === machineId)) {
      setCompareList([...compareList, { ...machine, id: machineId }]);
    }
  };

  const removeFromCompare = (id) => {
    setCompareList(compareList.filter(m => (m.id || m._id) !== id));
  };

  const openCompare = () => setShowCompare(true);
  const closeCompare = () => setShowCompare(false);

  const handleViewDetails = (machine) => {
    console.log('🔍 Navigating to details with machine:', machine);
    navigate('/recommendation-details', {
      state: {
        machine: machine,
        recommendationId: recommendationId,
        category: category
      }
    });
  };

  // Check if recommendations exist
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Recommendations Found</h2>
          <p className="text-slate-500 mb-6">
            No equipment matches your criteria{answers?.use_case ? ` for ${answers.use_case.replace(/_/g, ' ')} use` : ''}.
            Try adjusting your use type or requirements.
          </p>
          <button
            onClick={() => navigate('/site-task-profile')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Back to Site Profile
          </button>
        </div>
      </div>
    );
  }

  const primaryDetergent = recommendations.find(m => m.detergent)?.detergent;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.03)_0px,_rgba(59,130,246,0.03)_2px,_transparent_2px,_transparent_20px)]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
        
        {/* Save Status Toast */}
        {saveStatus === 'saved' && (
          <div className="fixed top-24 right-6 z-50 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-right-5 duration-300">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-600" />
              <span className="text-sm text-emerald-700">Recommendation saved to history!</span>
            </div>
          </div>
        )}
        
        {saveStatus === 'error' && (
          <div className="fixed top-24 right-6 z-50 bg-red-50 border border-red-200 rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-right-5 duration-300">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600" />
              <span className="text-sm text-red-700">{saveError || 'Failed to save recommendation'}</span>
            </div>
          </div>
        )}
        
        {/* Step Tracker */}
        <div className={`mb-8 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center opacity-60">
              <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-slate-500" />
              </div>
              <span className="ml-2 text-xs text-slate-500">Machine Type</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200"></div>
            <div className="flex items-center opacity-60">
              <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-slate-500" />
              </div>
              <span className="ml-2 text-xs text-slate-500">Site Profile</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-md">
                <span className="text-xs font-bold text-white">3</span>
              </div>
              <span className="ml-2 text-xs font-semibold text-blue-700">Results</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-700 delay-100 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 shadow-sm mb-5">
            <Sparkles size={12} className="text-blue-600" />
            <span className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider">Analysis Complete</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Your{' '}
            <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Intelligent Recommendations</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Based on your {category?.categoryName || 'selected equipment'} requirements
          </p>
          
          {/* Save indicator */}
          {saveStatus === 'saving' && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-blue-600">Saving to history...</span>
            </div>
          )}
        </div>

        {/* Selected Equipment Summary Card */}
        <div className={`mb-8 transition-all duration-700 delay-150 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                  <Wrench size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[9px] font-mono font-bold text-blue-600 uppercase tracking-wider">Analysis Parameters</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {answers?.surface_type && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-full text-[9px] text-slate-600">
                        Surface: {answers.surface_type}
                      </span>
                    )}
                    {answers?.dirt_type && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-full text-[9px] text-slate-600">
                        Dirt: {answers.dirt_type}
                      </span>
                    )}
                    {answers?.area_size && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-full text-[9px] text-slate-600">
                        Area: {answers.area_size} m²
                      </span>
                    )}
                    {answers?.use_case && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-full text-[9px] text-slate-600 capitalize">
                        Use: {answers.use_case.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/site-task-profile')}
                className="text-[10px] font-mono text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                Edit <ArrowRight size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Recommendation Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          {recommendations.map((machine, idx) => {
            const matchScore = machine.match_score || machine.final_score || machine.match || 85;
            const machineId = machine.id || machine._id || idx;
            const isExpanded = expandedCard === machineId;
            
            return (
              <div
                key={machineId}
                className="group bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-1.5 bg-gradient-to-r ${getIntensityColor(machine.intensity)}`} />
        
                <div className="h-48 relative bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  <DatabaseImage
                    src={machine.image_url}
                    alt={machine.name}
                    type="equipment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackSrc="https://via.placeholder.com/400x300?text=Equipment"
                  />
                  
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full border shadow-sm ${getMatchScoreColor(matchScore)}`}>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} />
                      <span className="text-sm font-bold">{matchScore}% Match</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span className="text-[10px] font-bold text-white">{machine.brand || 'Generic'}</span>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                    <span className={`text-[9px] font-bold uppercase ${
                      machine.intensity === 'light' ? 'text-emerald-600' :
                      machine.intensity === 'medium' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {machine.intensity || 'Medium'} Duty
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{machine.name || 'Equipment Name'}</h3>
                  <p className="text-[10px] font-mono text-slate-400 mb-3 capitalize">
                    {machine.machine_category?.replace(/_/g, ' ') || category?.categoryName || 'Equipment'}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-50 rounded-xl">
                    <div className="text-center">
                      <Zap size={14} className="mx-auto text-blue-500 mb-1" />
                      <p className="text-[9px] text-slate-400">Power</p>
                      <p className="text-[10px] font-bold text-slate-700 capitalize">
                        {machine.power_source?.replace(/_/g, ' ').substring(0, 8) || 'N/A'}
                      </p>
                    </div>
                    <div className="text-center border-x border-slate-200">
                      <DollarSign size={14} className="mx-auto text-emerald-500 mb-1" />
                      <p className="text-[9px] text-slate-400">Est. TCO/yr</p>
                      <p className="text-[10px] font-bold text-slate-700">
                        {formatCurrency(machine.estimated_tco_per_year_ugx || 0)}
                      </p>
                    </div>
                    <div className="text-center">
                      <Gauge size={14} className="mx-auto text-cyan-500 mb-1" />
                      <p className="text-[9px] text-slate-400">Width</p>
                      <p className="text-[10px] font-bold text-slate-700">
                        {machine.working_width_cm || machine.specifications?.working_width || 'N/A'} cm
                      </p>
                    </div>
                  </div>

                  {/* Quick specs hints */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-[9px]">
                    {machine.hint_weight && (
                      <div className="bg-slate-100 px-2 py-1.5 rounded-lg">{machine.hint_weight}</div>
                    )}
                    {machine.hint_noise && (
                      <div className="bg-slate-100 px-2 py-1.5 rounded-lg">{machine.hint_noise}</div>
                    )}
                    {machine.hint_power && (
                      <div className="bg-slate-100 px-2 py-1.5 rounded-lg">{machine.hint_power}</div>
                    )}
                    {machine.spare_parts_lead_time_days && (
                      <div className="bg-slate-100 px-2 py-1.5 rounded-lg">📦 {machine.spare_parts_lead_time_days}d parts</div>
                    )}
                  </div>

                  {/* Compatible detergent moved to bottom section */}

                  {isExpanded && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
                      <div className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <DollarSign size={12} /> TCO Breakdown (This Machine)
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3 text-[10px]">
                        <div className="flex justify-between py-1.5 px-2 bg-white rounded-lg">
                          <span className="text-slate-500">Purchase</span>
                          <span className="font-bold text-slate-700">{formatCurrency(machine.current_price_ugx || 0)}</span>
                        </div>
                        <div className="flex justify-between py-1.5 px-2 bg-white rounded-lg">
                          <span className="text-slate-500">Est. Maint/yr</span>
                          <span className="font-bold text-amber-600">{formatCurrency(machine.estimated_maintenance_cost_per_year_ugx || 0)}</span>
                        </div>
                        <div className="flex justify-between py-1.5 px-2 bg-white rounded-lg col-span-2">
                          <span className="text-slate-500">Est. Run/yr</span>
                          <span className="font-bold text-cyan-600">{formatCurrency(machine.estimated_running_cost_per_year_ugx || 0)}</span>
                        </div>
                        <div className="flex justify-between py-1.5 px-2 bg-emerald-50 rounded-lg border border-emerald-100 col-span-2">
                          <div>
                            <span className="text-slate-700 font-semibold block">Est. Total TCO/yr</span>
                            <span className="text-[9px] text-slate-500">(Maint + Run)</span>
                          </div>
                          <span className="font-bold text-emerald-600 self-center">{formatCurrency(machine.estimated_tco_per_year_ugx || 0)}</span>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Wrench size={12} /> Detailed Specifications
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[9px] text-slate-500 font-semibold uppercase">Working Width</p>
                          <p className="text-[11px] font-bold text-slate-800">{machine.working_width_cm || machine.specifications?.working_width || 'N/A'} cm</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 font-semibold uppercase">Weight</p>
                          <p className="text-[11px] font-bold text-slate-800">{machine.weight_kg || 'N/A'} kg</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 font-semibold uppercase">Noise Level</p>
                          <p className="text-[11px] font-bold text-slate-800">{machine.noise_level_db || machine.specifications?.noise_level || 'N/A'} dB</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 font-semibold uppercase">Power Req</p>
                          <p className="text-[11px] font-bold text-slate-800">{machine.power_requirement_kw || machine.specifications?.power_requirement_kw || 'N/A'} kW</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 font-semibold uppercase">Tank Capacity</p>
                          <p className="text-[11px] font-bold text-slate-800">{machine.tank_capacity_liters || machine.specifications?.tank_capacity || 'N/A'} L</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 font-semibold uppercase">Motor Type</p>
                          <p className="text-[11px] font-bold text-slate-800 capitalize">{machine.motor_type || machine.specifications?.motor_type || 'Standard'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 font-semibold uppercase">Spare Parts Lead</p>
                          <p className="text-[11px] font-bold text-slate-800">{machine.spare_parts_lead_time_days || machine.specifications?.spare_parts_lead_time_days || 14} days</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 font-semibold uppercase">Aisle Width Min</p>
                          <p className="text-[11px] font-bold text-slate-800">{machine.min_aisle_width_mm ? (machine.min_aisle_width_mm / 10).toFixed(0) : 'N/A'} cm</p>
                        </div>
                      </div>

                      {machine.specifications?.surface_compatibility && machine.specifications.surface_compatibility.length > 0 && (
                        <div className="pt-3 border-t border-slate-200">
                          <p className="text-[9px] text-slate-500 font-semibold uppercase mb-2">Compatible Surfaces</p>
                          <div className="flex flex-wrap gap-1">
                            {machine.specifications.surface_compatibility.map((surface, i) => (
                              <span key={i} className="inline-flex items-center text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                ✓ {surface.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {machine.alerts && machine.alerts.length > 0 && (
                    <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                      {machine.alerts.slice(0, 1).map((alert, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-amber-700">
                          <AlertTriangle size={10} /> {alert}
                        </div>
                      ))}
                      {machine.alerts.length > 1 && (
                        <p className="text-[9px] text-amber-500 mt-1">+{machine.alerts.length - 1} more alert</p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleViewDetails(machine)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      Details <ArrowRight size={12} />
                    </button>
                    <button
                      onClick={() => addToCompare(machine)}
                      disabled={compareList.length >= 2 || compareList.find(m => (m.id || m._id) === (machine.id || machine._id))}
                      className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Compare
                    </button>
                    <button
                      onClick={() => setExpandedCard(isExpanded ? null : machineId)}
                      className="px-3 py-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended Detergent Section (Standalone) */}
        {primaryDetergent && (
          <div className={`mt-8 transition-all duration-700 delay-300 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100">
                <div className="flex items-center gap-2">
                  <Droplets size={16} className="text-cyan-600" />
                  <h2 className="text-lg font-bold text-slate-800">Recommended Detergent</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center shrink-0">
                    <Droplets size={32} className="text-cyan-700" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{primaryDetergent.name || primaryDetergent.product_name}</h3>
                    <p className="text-sm text-slate-500 font-mono mb-3">
                      pH {primaryDetergent.ph || primaryDetergent.ph_value}
                      {primaryDetergent.unit_size && ` · ${primaryDetergent.unit_size}L`}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {primaryDetergent.eco_certified && (
                        <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                          <Leaf size={12} /> Eco Certified
                        </span>
                      )}
                      {primaryDetergent.biodegradable && (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                          <CheckCircle2 size={12} /> Biodegradable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white rounded-full px-5 py-3 shadow-2xl flex items-center gap-5 z-50 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-2">
              <BarChart3 size={14} className="text-cyan-400" />
              <span className="text-xs font-bold">{compareList.length}/2 selected</span>
            </div>
            <div className="flex gap-2">
              {compareList.map(m => (
                <div key={m.id} className="flex items-center gap-2 bg-slate-700 rounded-full px-3 py-1 text-[10px]">
                  <span className="max-w-[100px] truncate">{m.name}</span>
                  <button onClick={() => removeFromCompare(m.id)} className="hover:text-red-400 transition">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={openCompare}
              disabled={compareList.length !== 2}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-[10px] font-bold hover:shadow-lg disabled:opacity-50 transition"
            >
              Compare Now
            </button>
          </div>
        )}

        {/* Compare Modal */}
        {showCompare && compareList.length === 2 && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <BarChart3 size={14} className="text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800">Compare Machines</h3>
                </div>
                <button onClick={closeCompare} className="p-1.5 hover:bg-slate-100 rounded-full transition">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {compareList.map((machine, idx) => {
                    const matchScore = machine.match_score || machine.final_score || machine.match || 85;
                    const cmpId = machine.id || machine._id || idx;
                    return (
                      <div key={cmpId} className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition">
                        <div className={`h-1.5 bg-gradient-to-r ${getIntensityColor(machine.intensity)}`} />
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-slate-800">{machine.name}</h4>
                              <p className="text-[10px] font-mono text-slate-400">{machine.brand}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full border ${getMatchScoreColor(matchScore)}`}>
                              <span className="text-xs font-bold">{matchScore}% Match</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100">
                              <span className="text-slate-500 flex items-center gap-1">
                                <Zap size={12} /> Power Source
                              </span>
                              <span className="font-semibold text-slate-800 capitalize">
                                {machine.power_source?.replace(/_/g, ' ') || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                              <span className="text-slate-500 flex items-center gap-1">
                                <DollarSign size={12} /> Est. TCO / Year
                              </span>
                              <span className="font-bold text-emerald-600">
                                {formatCurrency(machine.estimated_tco_per_year_ugx || machine.tco_5year_ugx)}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                              <span className="text-slate-500 flex items-center gap-1">
                                <Gauge size={12} /> Intensity
                              </span>
                              <span className={`font-semibold capitalize ${
                                machine.intensity === 'light' ? 'text-emerald-600' :
                                machine.intensity === 'medium' ? 'text-amber-600' : 'text-red-600'
                              }`}>
                                {machine.intensity} Duty
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                              <span className="text-slate-500 flex items-center gap-1">
                                <Clock size={12} /> Working Width
                              </span>
                              <span className="font-semibold text-slate-800">
                                {machine.specifications?.working_width || 'N/A'} mm
                              </span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-slate-500 flex items-center gap-1">
                                <Droplets size={12} /> Tank Capacity
                              </span>
                              <span className="font-semibold text-slate-800">
                                {machine.specifications?.tank_capacity || 'N/A'} L
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleViewDetails(machine)}
                            className="mt-5 w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-center gap-1.5"
                          >
                            View Full Details <ExternalLink size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={closeCompare} className="px-5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                  Close Comparison
                </button>
                <button
                  onClick={() => {
                    closeCompare();
                    setCompareList([]);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="mt-12 flex justify-center gap-4">
          <button
            onClick={() => navigate('/site-task-profile')}
            className="px-6 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2"
          >
            ← Edit Criteria
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
          >
            Back to Home
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-10 text-center text-[10px] text-slate-400 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-1.5"><Shield size={12} className="text-emerald-500" /> Enterprise Security</div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-1.5"><Zap size={12} className="text-amber-500" /> Real-time Processing</div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-1.5"><Layers size={12} className="text-purple-500" /> Knowledge-Based Engine</div>
        </div>
      </main>
    </div>
  );
}
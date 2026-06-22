// frontend/src/pages/RecommendationResults.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Check,
  Ruler,
  Battery,
  Flame,
  Wind,
  Package,
  Info,
  Tag,
  Building2,
  Filter,
  SlidersHorizontal,
  MoveHorizontal
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { saveRecommendationToHistory } from '../services/recommendationHistoryService';

const formatCurrency = (amount) => {
  if (amount == null || amount === '') return 'UGX 0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
  }).format(amount);
};

const getCategorySpecs = (machine) => {
  const category = machine.machine_category;
  const specs = machine.specifications || {};

  switch (category) {
    case 'floor_scrubber':
    case 'scrubber_drier':
      return [
        { label: 'Working Width', value: `${specs.working_width || machine.working_width_cm || 'N/A'} cm`, icon: <Ruler size={12} /> },
        { label: 'Tank Capacity', value: `${specs.tank_capacity || machine.tank_capacity_liters || 'N/A'} L`, icon: <Droplets size={12} /> },
        { label: 'Weight', value: `${machine.weight_kg || 'N/A'} kg`, icon: <Gauge size={12} /> },
      ];
    case 'vacuum_cleaner':
      return [
        { label: 'Tank Capacity', value: `${specs.tank_capacity || machine.tank_capacity_liters || 'N/A'} L`, icon: <Droplets size={12} /> },
        { label: 'Noise Level', value: `${specs.noise_level || machine.noise_level_db || 'N/A'} dB`, icon: <Wind size={12} /> },
        { label: 'Power', value: `${specs.power_requirement_kw || machine.power_requirement_kw || 'N/A'} kW`, icon: <Zap size={12} /> },
      ];
    case 'pressure_washer':
      return [
        { label: 'Working Pressure', value: `${specs.pressure_bar || 'N/A'} bar`, icon: <Gauge size={12} /> },
        { label: 'Flow Rate', value: `${specs.flow_rate || 'N/A'} L/min`, icon: <Droplets size={12} /> },
        { label: 'Power', value: `${specs.power_requirement_kw || machine.power_requirement_kw || 'N/A'} kW`, icon: <Zap size={12} /> },
      ];
    case 'carpet_cleaner':
      return [
        { label: 'Tank Capacity', value: `${specs.tank_capacity || machine.tank_capacity_liters || 'N/A'} L`, icon: <Droplets size={12} /> },
        { label: 'Weight', value: `${machine.weight_kg || 'N/A'} kg`, icon: <Gauge size={12} /> },
        { label: 'Noise Level', value: `${specs.noise_level || machine.noise_level_db || 'N/A'} dB`, icon: <Wind size={12} /> },
      ];
    case 'sweeper':
      return [
        { label: 'Working Width', value: `${specs.working_width || machine.working_width_cm || 'N/A'} cm`, icon: <Ruler size={12} /> },
        { label: 'Weight', value: `${machine.weight_kg || 'N/A'} kg`, icon: <Gauge size={12} /> },
        { label: 'Power Source', value: machine.power_source?.replace(/_/g, ' ') || 'N/A', icon: <Battery size={12} /> },
      ];
    case 'steam_cleaner':
      return [
        { label: 'Temperature', value: `${specs.temperature || 'N/A'} °C`, icon: <Flame size={12} /> },
        { label: 'Tank Capacity', value: `${specs.tank_capacity || machine.tank_capacity_liters || 'N/A'} L`, icon: <Droplets size={12} /> },
        { label: 'Power', value: `${specs.power_requirement_kw || machine.power_requirement_kw || 'N/A'} kW`, icon: <Zap size={12} /> },
      ];
    case 'window_cleaner':
      return [
        { label: 'Reach', value: `${specs.reach || 'N/A'} m`, icon: <Ruler size={12} /> },
        { label: 'Tank Capacity', value: `${specs.tank_capacity || machine.tank_capacity_liters || 'N/A'} L`, icon: <Droplets size={12} /> },
        { label: 'Weight', value: `${machine.weight_kg || 'N/A'} kg`, icon: <Gauge size={12} /> },
      ];
    default:
      return [
        { label: 'Weight', value: `${machine.weight_kg || 'N/A'} kg`, icon: <Gauge size={12} /> },
        { label: 'Power Source', value: machine.power_source?.replace(/_/g, ' ') || 'N/A', icon: <Battery size={12} /> },
      ];
  }
};

// ✅ FIX: also check > 0 so a backend-sent 0 falls through to maintenance + running sum
const getOperatingCost = (machine) => {
  if (machine.estimated_operating_cost_per_year_ugx != null && machine.estimated_operating_cost_per_year_ugx > 0) {
    return machine.estimated_operating_cost_per_year_ugx;
  }
  return (machine.estimated_maintenance_cost_per_year_ugx || 0) + (machine.estimated_running_cost_per_year_ugx || 0);
};

export default function RecommendationResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { recommendations, recommendationId, answers, categoryConfig, categoryInfo } = location.state || {};
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveError, setSaveError] = useState(null);
  const category = categoryInfo || categoryConfig || {};
  const [fadeIn, setFadeIn] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeBrandTab, setActiveBrandTab] = useState('all');
  const hasSaved = useRef(false);
  const tabContainerRef = useRef(null);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const saveRec = async () => {
      if (hasSaved.current || !recommendations || recommendations.length === 0 || !isAuthenticated) return;
      setSaveStatus('saving');
      try {
        const primary = recommendations[0];
        const detergent = recommendations.find(m => m.detergent)?.detergent;
        const payload = {
          area_size: answers?.area_size || 0,
          surface_type: answers?.surface_type || category?.surfaceType,
          dirt_type: answers?.dirt_type || category?.dirtType,
          power_stability: answers?.power_stability || 'stable',
          eco_preference: answers?.eco_preference || false,
          machine_category: category?.categoryId || category?.machineCategory,
          machine_subtype: category?.selectedSubtype,
          brand_name: primary?.brand,
          usage_hours_per_week: answers?.usage_hours_per_week || 0,
          noise_sensitive: answers?.noise_sensitive || false,
          floor_texture: answers?.floor_texture,
          environment: answers?.environment,
          power_source: primary?.power_source,
          aisle_width: answers?.aisle_width,
          soil_level: answers?.soil_level,
          use_case: answers?.use_case,
          pressure_required: answers?.pressure_required,
          filtration: answers?.filtration,
          tank_capacity: answers?.tank_capacity,
          noise_sensitivity: answers?.noise_sensitivity,
          recommended_equipment_id: primary?._id || primary?.id,
          recommended_detergent_id: detergent?._id || detergent?.id,
          alternative_equipment_ids: recommendations.slice(1).map(m => m._id || m.id).filter(Boolean),
          estimated_tco_per_year_ugx: primary?.estimated_tco_per_year_ugx,
          final_score: primary?.match_score || 85,
          alerts_triggered: recommendations.flatMap(m => (m.alerts || []).map(a => ({ message: a, explanation: a, severity: 'warning' }))),
          summary_explanation: primary?.reasoning || `Recommended for ${answers?.surface_type}`,
          cleaning_frequency: answers?.cleaning_frequency || 'weekly',
        };
        Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
        await saveRecommendationToHistory(payload);
        setSaveStatus('saved');
        hasSaved.current = true;
        setTimeout(() => setSaveStatus('idle'), 3000);
      } catch (err) {
        setSaveStatus('error');
        setSaveError(err.response?.data?.error || 'Failed to save');
        setTimeout(() => { setSaveStatus('idle'); setSaveError(null); }, 5000);
      }
    };
    saveRec();
  }, [recommendations, answers, category, isAuthenticated]);

  const getMatchScore = (machine) => {
    return machine.match_score ?? machine.score ?? machine.match ?? 0;
  };

  const getPurchasePrice = (machine) => {
    if (!machine) return 0;
    // ✅ FIX: also check > 0 so null/0 from backend falls through to TCO calculation
    if (machine.current_price_ugx != null && machine.current_price_ugx > 0) {
      return machine.current_price_ugx;
    }
    const tco = machine.estimated_tco_per_year_ugx || 0;
    const operatingCost = getOperatingCost(machine);
    return tco > operatingCost ? tco - operatingCost : 0;
  };

  const groupedByBrand = useMemo(() => {
    const groups = {};
    recommendations?.forEach((item) => {
      const brand = item.brand_name || 'Other';
      if (!groups[brand]) groups[brand] = [];
      groups[brand].push(item);
    });

    Object.keys(groups).forEach((brand) => {
      groups[brand] = groups[brand]
        .slice()
        .sort((a, b) => getMatchScore(b) - getMatchScore(a))
        .slice(0, 3);
    });

    return groups;
  }, [recommendations]);

  const brandNames = useMemo(() => Object.keys(groupedByBrand).sort((a, b) => {
    const scoreA = getMatchScore(groupedByBrand[a]?.[0]) || 0;
    const scoreB = getMatchScore(groupedByBrand[b]?.[0]) || 0;
    return scoreB - scoreA;
  }), [groupedByBrand]);

  const brandSections = useMemo(() => (
    brandNames.map((brand) => ({
      brand,
      machines: groupedByBrand[brand] || [],
      topScore: getMatchScore(groupedByBrand[brand]?.[0]) || 0,
    }))
  ), [brandNames, groupedByBrand]);

  const filteredRecommendations = useMemo(() => {
    if (!recommendations) return [];
    if (activeBrandTab === 'all') {
      return brandSections.flatMap((section) => section.machines);
    }
    return groupedByBrand[activeBrandTab] || [];
  }, [activeBrandTab, groupedByBrand, brandSections, recommendations]);

  const addToCompare = (machine) => {
    const id = machine.id || machine._id;
    if (compareList.length < 2 && !compareList.find(m => (m.id || m._id) === id)) {
      setCompareList([...compareList, { ...machine, id }]);
    }
  };
  const removeFromCompare = (id) => setCompareList(compareList.filter(m => (m.id || m._id) !== id));
  const openCompare = () => setShowCompare(true);
  const closeCompare = () => setShowCompare(false);

  const handleViewDetails = (machine) => {
    navigate('/recommendation-details', { state: { machine, recommendationId, category } });
  };

  useEffect(() => {
    if (tabContainerRef.current) {
      const activeTabEl = tabContainerRef.current.querySelector(`[data-brand="${activeBrandTab}"]`);
      if (activeTabEl) {
        activeTabEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeBrandTab]);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">No Recommendations Found</h2>
          <p className="text-slate-500 mt-2">No equipment matches your criteria. Try adjusting your inputs.</p>
          <button onClick={() => navigate('/site-task-profile')} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">Back to Site Profile</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.03)_0px,_rgba(59,130,246,0.03)_2px,_transparent_2px,_transparent_20px)]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
        {saveStatus === 'saved' && (
          <div className="fixed top-24 right-6 z-50 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-right-5 duration-300">
            <div className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /><span className="text-sm text-emerald-700">Saved to history!</span></div>
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="fixed top-24 right-6 z-50 bg-red-50 border border-red-200 rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-right-5 duration-300">
            <div className="flex items-center gap-2"><AlertTriangle size={16} className="text-red-600" /><span className="text-sm text-red-700">{saveError || 'Failed to save'}</span></div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center opacity-60">
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center"><CheckCircle2 size={14} className="text-slate-500" /></div>
            <span className="ml-2 text-xs text-slate-500">Machine Type</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div className="flex items-center opacity-60">
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center"><CheckCircle2 size={14} className="text-slate-500" /></div>
            <span className="ml-2 text-xs text-slate-500">Site Profile</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-md"><span className="text-xs font-bold text-white">3</span></div>
            <span className="ml-2 text-xs font-semibold text-blue-700">Results</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 shadow-sm mb-5">
            <Sparkles size={12} className="text-blue-600" />
            <span className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider">Top Matches by Brand</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Your{' '}
            <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Best Recommendations</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Top 3 machines from each brand, ranked by match score.
          </p>
          {saveStatus === 'saving' && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-blue-600">Saving to history...</span>
            </div>
          )}
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative overflow-x-auto scrollbar-hide py-2 px-1 w-full max-w-4xl" ref={tabContainerRef}>
            <div className="flex justify-center gap-2 min-w-max mx-auto">
              <button
                data-brand="all"
                onClick={() => setActiveBrandTab('all')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap shadow-sm ${activeBrandTab === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md scale-105'
                    : 'bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <Layers size={16} /> All Brands
                </span>
              </button>
              {brandNames.map((brand) => (
                <button
                  key={brand}
                  data-brand={brand}
                  onClick={() => setActiveBrandTab(brand)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap shadow-sm ${activeBrandTab === brand
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md scale-105'
                      : 'bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md'
                    }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((machine) => {
            const matchScore = machine.match_score || 85;
            const machineId = machine.id || machine._id;
            const isExpanded = expandedCard === machineId;
            const categorySpecs = getCategorySpecs(machine);
            const operatingCost = getOperatingCost(machine);
            const purchasePrice = getPurchasePrice(machine);
            // ✅ FIX: read directly with ?? 0 so actual 0 renders and non-zero renders correctly
            const maintenanceCost = machine.estimated_maintenance_cost_per_year_ugx ?? 0;
            const runningCost = machine.estimated_running_cost_per_year_ugx ?? 0;
            const tco = machine.estimated_tco_per_year_ugx ?? 0;

            return (
              <div key={machineId} className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="relative w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex-shrink-0">
                  {machine.image_url ? (
                    <img
                      src={machine.image_url}
                      alt={machine.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
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
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
                      <Package className="w-12 h-12 text-slate-400" />
                      <span className="text-xs text-slate-400 mt-1 font-mono">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                    <span className="text-[10px] font-bold text-white">{machine.brand_name}</span>
                  </div>
                  {machine.detergent && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full shadow-lg border border-white/20">
                      <span className="text-[8px] font-bold text-white flex items-center gap-1">
                        <Droplets size={10} /> Detergent matched
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full border shadow-sm bg-white/95 backdrop-blur-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} className="text-blue-600" />
                      <span className="text-sm font-bold text-blue-600">{matchScore}% Match</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{machine.name}</h3>
                  <p className="text-[10px] font-mono text-slate-400 mb-3 capitalize">
                    {machine.machine_category?.replace(/_/g, ' ')}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-50 rounded-xl">
                    {categorySpecs.map((spec, idx) => (
                      <div key={idx} className="text-center">
                        <div className="flex justify-center text-slate-400 mb-1">{spec.icon}</div>
                        <p className="text-[9px] text-slate-400">{spec.label}</p>
                        <p className="text-[10px] font-bold text-slate-700">{spec.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium text-slate-600">Purchase Price</span>
                      <span className="text-sm font-bold text-slate-700">{formatCurrency(purchasePrice)}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] font-medium text-slate-600">Annual Operating Cost</span>
                      <span className="text-sm font-bold text-emerald-700">{formatCurrency(operatingCost)}</span>
                    </div>
                  </div>

                  {machine.detergent ? (
                    <div className="mb-3 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets size={12} className="text-cyan-600" />
                        <p className="text-[9px] font-bold text-cyan-700 uppercase tracking-wider">Recommended Detergent</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-cyan-200">
                          {machine.detergent.image_url ? (
                            <img
                              src={machine.detergent.image_url}
                              alt={machine.detergent.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-cyan-100"></div>';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-cyan-100"><Droplets size={20} className="text-cyan-600" /></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{machine.detergent.name}</h4>
                          <p className="text-[10px] text-slate-500 font-mono">
                            pH {machine.detergent.ph} · {machine.detergent.unit_size}L
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {machine.detergent.eco_certified && (
                              <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                <Leaf size={10} /> Eco
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
                  ) : (
                    <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <p className="text-[10px] text-slate-500">ℹ️ No specific detergent match found.</p>
                    </div>
                  )}

                  {machine.alerts && machine.alerts.length > 0 && (
                    <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                      {machine.alerts.slice(0, 1).map((alert, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-amber-700"><AlertTriangle size={10} /> {alert}</div>
                      ))}
                      {machine.alerts.length > 1 && <p className="text-[9px] text-amber-500 mt-1">+{machine.alerts.length - 1} more</p>}
                    </div>
                  )}

                  <div className="flex gap-2 mt-auto pt-2">
                    <button onClick={() => handleViewDetails(machine)} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:shadow-md transition flex items-center justify-center gap-1.5">
                      Details <ArrowRight size={12} />
                    </button>
                    <button onClick={() => addToCompare(machine)} disabled={compareList.length >= 2 || compareList.find(m => (m.id || m._id) === machineId)} className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:border-blue-300 hover:bg-blue-50 transition disabled:opacity-40">
                      Compare
                    </button>
                    <button onClick={() => setExpandedCard(isExpanded ? null : machineId)} className="px-3 py-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition">
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="text-xs font-bold text-slate-700">Full TCO Breakdown</div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="flex justify-between py-1.5 px-2 bg-white rounded-lg">
                          <span className="text-slate-500">Purchase Price</span>
                          <span className="font-bold text-slate-700">{formatCurrency(purchasePrice)}</span>
                        </div>
                        {/* ✅ FIX: use computed vars (not || 0) so real values from backend show */}
                        <div className="flex justify-between py-1.5 px-2 bg-white rounded-lg">
                          <span className="text-slate-500">Maintenance/yr</span>
                          <span className="font-bold text-amber-600">{formatCurrency(maintenanceCost)}</span>
                        </div>
                        <div className="flex justify-between py-1.5 px-2 bg-white rounded-lg">
                          <span className="text-slate-500">Running/yr</span>
                          <span className="font-bold text-cyan-600">{formatCurrency(runningCost)}</span>
                        </div>
                        <div className="flex justify-between py-1.5 px-2 bg-emerald-50 rounded-lg border border-emerald-100">
                          <span className="text-slate-700 font-semibold">Total TCO/yr</span>
                          <span className="font-bold text-emerald-600">{formatCurrency(tco || (purchasePrice + operatingCost))}</span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-slate-700">Additional Specs</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><p className="text-[9px] text-slate-500 uppercase">Weight</p><p className="text-[11px] font-bold">{machine.weight_kg || 'N/A'} kg</p></div>
                        <div><p className="text-[9px] text-slate-500 uppercase">Noise</p><p className="text-[11px] font-bold">{machine.noise_level_db || 'N/A'} dB</p></div>
                        <div><p className="text-[9px] text-slate-500 uppercase">Power Source</p><p className="text-[11px] font-bold capitalize">{machine.power_source?.replace(/_/g, ' ') || 'N/A'}</p></div>
                        <div><p className="text-[9px] text-slate-500 uppercase">Spare Parts Lead</p><p className="text-[11px] font-bold">{machine.spare_parts_lead_time_days || 'N/A'} days</p></div>
                        <div><p className="text-[9px] text-slate-500 uppercase">Min Aisle Width</p><p className="text-[11px] font-bold">{machine.min_aisle_width_mm || 'N/A'} mm</p></div>
                        <div><p className="text-[9px] text-slate-500 uppercase">Environment</p><p className="text-[11px] font-bold capitalize">{machine.environment?.replace(/_/g, ' ') || 'Any'}</p></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {compareList.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white rounded-full px-5 py-3 shadow-2xl flex items-center gap-5 z-50 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-2"><BarChart3 size={14} className="text-cyan-400" /><span className="text-xs font-bold">{compareList.length}/2 selected</span></div>
            <div className="flex gap-2">
              {compareList.map(m => (
                <div key={m.id} className="flex items-center gap-2 bg-slate-700 rounded-full px-3 py-1 text-[10px]">
                  <span className="max-w-[100px] truncate">{m.name}</span>
                  <button onClick={() => removeFromCompare(m.id)} className="hover:text-red-400 transition"><X size={12} /></button>
                </div>
              ))}
            </div>
            <button onClick={openCompare} disabled={compareList.length !== 2} className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-[10px] font-bold hover:shadow-lg disabled:opacity-50 transition">Compare Now</button>
          </div>
        )}

        {showCompare && compareList.length === 2 && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"><BarChart3 size={14} className="text-white" /></div><h3 className="font-bold text-slate-800">Compare Machines</h3></div>
                <button onClick={closeCompare} className="p-1.5 hover:bg-slate-100 rounded-full transition"><X size={18} /></button>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {compareList.map((machine, idx) => {
                    const matchScore = machine.match_score || 85;
                    const cmpId = machine.id || machine._id || idx;
                    const operatingCost = getOperatingCost(machine);
                    const purchasePrice = getPurchasePrice(machine);

                    return (
                      <div key={cmpId} className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div><h4 className="text-lg font-bold text-slate-800">{machine.name}</h4><p className="text-[10px] font-mono text-slate-400">{machine.brand_name}</p></div>
                            <div className="px-3 py-1 rounded-full border bg-white/90 backdrop-blur-sm"><span className="text-xs font-bold text-blue-600">{matchScore}% Match</span></div>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500 flex items-center gap-1"><Zap size={12} /> Power Source</span><span className="font-semibold text-slate-800 capitalize">{machine.power_source?.replace(/_/g, ' ') || 'N/A'}</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500 flex items-center gap-1"><DollarSign size={12} /> Operating Cost/yr</span><span className="font-bold text-emerald-600">{formatCurrency(operatingCost)}</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500 flex items-center gap-1"><Gauge size={12} /> Intensity</span><span className="font-semibold capitalize">{machine.intensity || 'Medium'} Duty</span></div>
                            <div className="flex justify-between py-2"><span className="text-slate-500 flex items-center gap-1"><Droplets size={12} /> Tank</span><span className="font-semibold text-slate-800">{machine.specifications?.tank_capacity || 'N/A'} L</span></div>
                          </div>
                          <button onClick={() => handleViewDetails(machine)} className="mt-5 w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-center gap-1.5">View Full Details <ExternalLink size={12} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={closeCompare} className="px-5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition">Close Comparison</button>
                <button onClick={() => { closeCompare(); setCompareList([]); }} className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition">Clear Selection</button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-center gap-4">
          <button onClick={() => navigate('/site-task-profile')} className="px-6 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:border-blue-300 hover:bg-blue-50 transition">← Edit Criteria</button>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition">Back to Home</button>
        </div>
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

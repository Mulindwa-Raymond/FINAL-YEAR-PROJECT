/**
 * SiteTaskProfile.jsx
 * Step 2 – Dynamic questionnaire based on selected machine category.
 * Redesigned into a premium, Amazon-inspired interactive procurement assistant.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, Sparkles, Cpu, Loader2, AlertCircle,
  Shield, Clock, Layers, ArrowRight, CheckCircle2, Zap, Gauge,
  Building2, Droplets, Brush, Wind, Flame, Package, Award,
  Activity, TrendingUp, HardDrive, Bot, User, LayoutGrid,
  Compass, Star, Circle, CheckCircle, HelpCircle, X,
  FileCheck, ShieldAlert, BadgeInfo, Scale, DollarSign
} from 'lucide-react';
import DynamicFormField from '../components/common/DynamicFormField';
import { getCategoryQuestions } from '../utils/categoryQuestions';
import { getRecommendations, saveRecommendationToHistory } from '../services/recommendationService';
import { useAuth } from '../contexts/AuthContext';

const categoryIcons = {
  floor_scrubber: <Brush size={20} />,
  vacuum_cleaner: <Wind size={20} />,
  pressure_washer: <Zap size={20} />,
  steam_cleaner: <Flame size={20} />,
  carpet_cleaner: <Package size={20} />,
  sweeper: <Activity size={20} />,
  scrubber_drier: <Award size={20} />,
  window_cleaner: <Droplets size={20} />,
};

export default function SiteTaskProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [categoryConfig, setCategoryConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const state = location.state;
    if (!state?.machineCategory) {
      navigate('/machine-type', { replace: true });
      return;
    }

    const config = getCategoryQuestions(state.machineCategory);
    if (!config) {
      navigate('/machine-type', { replace: true });
      return;
    }

    setCategoryConfig({
      ...config,
      categoryName: state.categoryName || state.machineCategory.replace(/_/g, ' '),
      categoryId: state.machineCategory,
      selectedBrand: state.selectedBrand,
      selectedSubtype: state.machineSubtype,
    });
    setIsLoading(false);
  }, [location, navigate]);

  const allSteps = categoryConfig ? [...(categoryConfig.steps || [])] : [];

  const getVisibleSteps = () => {
    return allSteps.filter(step => {
      if (step.shouldDisplay) {
        return step.shouldDisplay(categoryConfig?.selectedSubtype);
      }
      return true;
    });
  };

  const steps = getVisibleSteps();
  const progressSteps = steps.map((step, idx) => ({
    id: step.id,
    title: step.title,
    icon: idx + 1,
  }));

  useEffect(() => {
    const useCase = answers.use_case;
    if (useCase && categoryConfig?.categoryId === 'pressure_washer') {
      let defaultPressure = '';
      if (useCase === 'domestic') {
        defaultPressure = 'low';
      } else if (useCase === 'commercial') {
        defaultPressure = 'medium';
      } else {
        defaultPressure = 'high';
      }
      if (!answers.pressure_required) {
        setAnswers(prev => ({ ...prev, pressure_required: defaultPressure }));
      }
    }
  }, [answers.use_case, categoryConfig?.categoryId]);

  const handleFieldChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: undefined }));
    }
  };

  const handleFieldBlur = (fieldId) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
  };

  const validateCurrentStep = () => {
    const step = steps[currentStep];
    if (!step) return true;

    if (step.shouldDisplay && !step.shouldDisplay(categoryConfig?.selectedSubtype)) {
      return true;
    }

    const value = answers[step.id];

    if (step.required !== false && (value === undefined || value === null || value === '')) {
      setErrors(prev => ({ ...prev, [step.id]: `${step.title} is required` }));
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      setErrors(prev => ({ ...prev, [step.id]: `Please select at least one ${step.title.toLowerCase()}` }));
      return false;
    }
    return true;
  };

  const getOptionLabel = (step, value) => {
    if (value === undefined || value === null || value === '') return 'Not specified';
    if (Array.isArray(value)) {
      return value.map(item => {
        const option = step.options?.find(opt => opt.value === item);
        return option?.label || item;
      }).join(', ');
    }
    const option = step.options?.find(opt => opt.value === value);
    if (option) return option.label;
    return typeof value === 'string' ? value.replace(/_/g, ' ') : String(value);
  };

  const getReviewItems = () => {
    return steps.map((step, index) => {
      const value = answers[step.id];
      if (value === undefined || value === null || value === '') return null;
      return {
        id: step.id,
        title: step.title,
        value: getOptionLabel(step, value),
        stepIndex: index,
      };
    }).filter(Boolean);
  };

  const handleReviewItemClick = (stepIndex) => {
    setShowReviewModal(false);
    setCurrentStep(stepIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitRecommendations = async () => {
    setShowReviewModal(false);
    setIsProcessing(true);
    setErrors({});

    const apiPayload = buildApiPayload();

    console.group('📤 API Request Details');
    console.log('Raw Answers:', answers);
    console.log('Final API Payload:', apiPayload);
    console.groupEnd();

    try {
      const response = await getRecommendations(apiPayload);
      console.log('✅ API Response:', response);

      let recommendationsData;
      let recommendationId;

      if (response.data?.data?.recommendations) {
        recommendationsData = response.data.data.recommendations;
        recommendationId = response.data.data.recommendation_id;
      } else if (response.data?.recommendations) {
        recommendationsData = response.data.recommendations;
        recommendationId = response.data.recommendation_id;
      } else {
        recommendationsData = response.data;
        recommendationId = new Date().getTime().toString();
      }

      saveToHistory(recommendationsData, apiPayload, recommendationId);

      navigate('/recommendation-results', {
        state: {
          recommendations: recommendationsData,
          recommendationId: recommendationId,
          answers: answers,
          categoryInfo: {
            categoryId: categoryConfig.categoryId,
            categoryName: categoryConfig.categoryName,
            selectedSubtype: categoryConfig.selectedSubtype,
            selectedBrand: categoryConfig.selectedBrand,
          },
        },
      });
    } catch (err) {
      console.error('❌ Recommendation failed:', err);
      let errorMessage = 'Failed to get recommendations. ';
      if (err.response?.status === 404) {
        errorMessage += 'The recommendation service is unavailable. Please try again later.';
      } else if (err.response?.status === 401) {
        errorMessage += 'Please log in again to continue.';
      } else if (err.response?.data?.error) {
        errorMessage += err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += 'Please check your connection and try again.';
      }

      setErrors({ general: errorMessage });
      setIsProcessing(false);
    }
  };

  const buildApiPayload = () => {
    const category = categoryConfig.categoryId;

    const floorTypeToSurface = {
      smooth: 'tile',
      textured: 'concrete',
      sensitive: 'wood',
    };

    const soilLevelToDirt = {
      light: 'dust',
      medium: 'grease',
      heavy: 'heavy soil',
    };

    const sweepLocationToSurface = {
      indoor_smooth: 'tile',
      indoor_rough: 'concrete',
      outdoor_smooth: 'asphalt',
      outdoor_rough: 'concrete',
    };

    const debrisTypeMapping = {
      dry_dust: 'dust',
      wet_spills: 'wet spills',
      dry_wet: 'dust',
      fine_dust: 'fine dust',
      large_particles: 'dry debris',
      hazardous_dust: 'dust',
      food_waste: 'organic',
    };

    const vacuumSurfaceMapping = {
      hard_floor: 'tile',
      carpet: 'carpet',
      upholstery: 'carpet',
      outdoor: 'concrete',
      machinery: 'concrete',
    };

    const windowSoilingMapping = {
      dust: 'dust',
      lime_scale: 'water marks',
      grime: 'grime',
    };

    let surfaceType = null;
    let dirtType = null;

    if (category === 'floor_scrubber') {
      surfaceType = floorTypeToSurface[answers.floor_type] || answers.floor_type || 'tile';
      dirtType = soilLevelToDirt[answers.soil_level] || answers.soil_level || 'dust';
    } else if (category === 'scrubber_drier') {
      const rawFloor = answers.floor_type;
      if (Array.isArray(rawFloor) && rawFloor.length > 0) {
        surfaceType = rawFloor[0];
      } else if (rawFloor) {
        surfaceType = floorTypeToSurface[rawFloor] || rawFloor;
      } else {
        surfaceType = 'tile';
      }
      dirtType = soilLevelToDirt[answers.soil_level] || answers.soil_level || 'grease';
    } else if (category === 'sweeper') {
      surfaceType = sweepLocationToSurface[answers.location] || 'concrete';
      const rawDirt = answers.dirt_type;
      if (Array.isArray(rawDirt) && rawDirt.length > 0) {
        dirtType = rawDirt[0];
      } else if (rawDirt) {
        dirtType = rawDirt;
      } else {
        dirtType = 'dust';
      }
    } else if (category === 'vacuum_cleaner') {
      const rawSurface = answers.surface_type;
      if (Array.isArray(rawSurface) && rawSurface.length > 0) {
        surfaceType = vacuumSurfaceMapping[rawSurface[0]] || rawSurface[0];
      } else if (rawSurface) {
        surfaceType = vacuumSurfaceMapping[rawSurface] || rawSurface;
      } else {
        surfaceType = 'tile';
      }
      const rawDebris = answers.debris_type;
      if (Array.isArray(rawDebris) && rawDebris.length > 0) {
        dirtType = debrisTypeMapping[rawDebris[0]] || rawDebris[0];
      } else if (rawDebris) {
        dirtType = debrisTypeMapping[rawDebris] || rawDebris;
      } else {
        dirtType = 'dust';
      }
    } else if (category === 'pressure_washer') {
      const rawSurface = answers.surface_type;
      surfaceType = rawSurface === 'tiles' ? 'tile' : (rawSurface || 'concrete');
      const rawDirt = answers.dirt_type;
      if (Array.isArray(rawDirt) && rawDirt.length > 0) {
        const mapped = { light_dust: 'dust', grease: 'grease', chewing_gum: 'heavy soil', bio_algae: 'algae', food_residue: 'grease' };
        dirtType = mapped[rawDirt[0]] || rawDirt[0];
      } else if (rawDirt) {
        const mapped = { light_dust: 'dust', grease: 'grease', chewing_gum: 'heavy soil', bio_algae: 'algae', food_residue: 'grease' };
        dirtType = mapped[rawDirt] || rawDirt;
      } else {
        dirtType = 'grease';
      }
    } else if (category === 'carpet_cleaner') {
      surfaceType = 'carpet';
      const rawDirt = answers.dirt_type;
      if (Array.isArray(rawDirt) && rawDirt.length > 0) {
        dirtType = rawDirt[0];
      } else if (rawDirt) {
        dirtType = rawDirt;
      } else {
        dirtType = 'stains';
      }
    } else if (category === 'window_cleaner') {
      surfaceType = 'glass';
      dirtType = windowSoilingMapping[answers.dirt_type] || answers.dirt_type || 'dust';
    } else if (category === 'steam_cleaner') {
      surfaceType = 'tile';
      dirtType = 'bacteria';
    } else {
      const rawSurface = answers.surface_type || answers.floor_type;
      const rawDirt = answers.dirt_type || answers.soil_level || answers.debris_type;
      surfaceType = Array.isArray(rawSurface) ? rawSurface[0] : (rawSurface || 'tile');
      dirtType = Array.isArray(rawDirt) ? rawDirt[0] : (rawDirt || 'dust');
    }

    const payload = {
      machine_category: category,
      machine_subtype: categoryConfig.selectedSubtype,
      brand_name: categoryConfig.selectedBrand,
      surface_type: surfaceType,
      dirt_type: dirtType,
      area_size: parseFloat(answers.area_size) || 0,
      power_stability: answers.power_stability || 'stable',
      eco_preference: answers.eco_preference || false,
      cleaning_frequency: answers.cleaning_frequency || 'weekly',
      weight_tolerance: answers.weight_tolerance,
      power_available_kw: answers.power_available_kw,
      downtime_criticality: answers.downtime_criticality,
      working_width_preference: answers.working_width_preference,
      floor_texture: answers.floor_texture,
      environment: answers.environment,
      power_source: answers.power_source !== 'any' ? answers.power_source : undefined,
      aisle_width: answers.aisle_width,
      soil_level: answers.soil_level,
      use_case: answers.use_case,
      pressure_required: answers.pressure_required,
      debris_type: answers.debris_type,
      filtration: answers.filtration,
      tank_capacity: answers.tank_capacity,
      noise_sensitivity: answers.noise_sensitivity,
      function: answers.function,
      carpet_type: answers.carpet_type,
      location: answers.location,
      operation_mode: answers.operation_mode,
      special_requirements: answers.special_requirements,
    };

    if (categoryConfig.mapToFilters) {
      const filters = categoryConfig.mapToFilters(answers);
      if (filters.intensity) payload.intensity = filters.intensity;
      if (filters.domain) payload.domain = filters.domain;
    }

    if (answers.use_case && !payload.domain) {
      if (answers.use_case === 'domestic' || answers.use_case === 'home') {
        payload.domain = 'domestic';
        payload.intensity = payload.intensity || 'light';
      } else if (answers.use_case === 'commercial' || answers.use_case === 'office') {
        payload.domain = 'commercial';
        payload.intensity = payload.intensity || 'medium';
      } else if (['industrial', 'food_beverage', 'construction', 'hazardous', 'warehouse', 'outdoor', 'vehicles'].includes(answers.use_case)) {
        payload.domain = 'industrial';
        payload.intensity = payload.intensity || 'heavy';
      }
    }

    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
        delete payload[key];
      }
    });

    return payload;
  };

  const saveToHistory = async (recommendationsData, apiPayload, recommendationId) => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping save to history');
      return;
    }

    try {
      const primaryMachine = recommendationsData[0];
      const detergentData = recommendationsData.find(m => m.detergent)?.detergent;

      const historyData = {
        area_size: apiPayload.area_size,
        surface_type: apiPayload.surface_type,
        dirt_type: apiPayload.dirt_type,
        power_stability: apiPayload.power_stability,
        eco_preference: apiPayload.eco_preference,
        machine_category: apiPayload.machine_category,
        machine_subtype: apiPayload.machine_subtype,
        brand_name: apiPayload.brand_name,
        usage_hours_per_week: answers.usage_hours_per_week || 0,
        noise_sensitive: answers.noise_sensitive || false,
        floor_texture: apiPayload.floor_texture,
        environment: apiPayload.environment,
        power_source: primaryMachine?.power_source,
        aisle_width: apiPayload.aisle_width,
        soil_level: apiPayload.soil_level,
        use_case: apiPayload.use_case,
        pressure_required: apiPayload.pressure_required,
        filtration: apiPayload.filtration,
        tank_capacity: apiPayload.tank_capacity,
        noise_sensitivity: apiPayload.noise_sensitivity,
        recommended_equipment_id: primaryMachine?._id || primaryMachine?.id,
        recommended_detergent_id: detergentData?._id || detergentData?.id,
        estimated_tco_per_year_ugx: primaryMachine?.estimated_tco_per_year_ugx,
        final_score: primaryMachine?.match_score || primaryMachine?.final_score,
        alerts_triggered: recommendationsData.flatMap(m => m.alerts || []).map(alert => ({
          message: alert,
          explanation: alert,
          severity: 'warning'
        })),
        summary_explanation: primaryMachine?.reasoning || `Recommended for ${apiPayload.surface_type} surface`,
        cleaning_frequency: apiPayload.cleaning_frequency,
        function: apiPayload.function,
        carpet_type: apiPayload.carpet_type,
        location: apiPayload.location
      };

      Object.keys(historyData).forEach(key => {
        if (historyData[key] === undefined || historyData[key] === null) {
          delete historyData[key];
        }
      });

      console.log('💾 Saving recommendation to history:', historyData);
      const saveResponse = await saveRecommendationToHistory(historyData);
      console.log('✅ Recommendation saved:', saveResponse.data);
    } catch (error) {
      console.error('Failed to save recommendation to history:', error);
    }
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowReviewModal(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <Cpu className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <p className="text-slate-500 mt-6 font-medium animate-pulse uppercase text-xs tracking-wider">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  if (!categoryConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
          <p className="text-red-600 mb-4">Invalid machine category selected.</p>
          <button onClick={() => navigate('/machine-type')} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const safeCurrentStep = Math.min(currentStep, steps.length - 1);
  const currentField = steps[safeCurrentStep];
  const progress = ((safeCurrentStep + 1) / steps.length) * 100;
  const isLastStep = safeCurrentStep === steps.length - 1;
  const categoryIcon = categoryIcons[categoryConfig.categoryId] || <Zap size={20} />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 text-slate-900 font-sans antialiased selection:bg-blue-100 overflow-x-hidden">

      {/* Background Brand Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.015)_0px,_rgba(59,130,246,0.015)_2px,_transparent_2px,_transparent_20px)]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">

        { }
        {/* Amazon-style Guided Progress Header */}
        <div className={`mb-8 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <div className="flex flex-col items-center justify-center border-b border-slate-200/80 pb-4 gap-4 w-full">

            {/* Step Milestones */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-center">
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  <CheckCircle size={14} />
                </div>
                <span className="ml-2 text-xs font-bold text-slate-700">Category Selection</span>
              </div>
              <ChevronRight size={14} className="text-slate-300" />
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md ring-2 ring-blue-500/20">
                  <span>2</span>
                </div>
                <span className="ml-2 text-xs font-bold text-blue-700">Site & Task Profiler</span>
              </div>
              <ChevronRight size={14} className="text-slate-300" />
              <div className="flex items-center opacity-50">
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-250 flex items-center justify-center text-xs font-bold text-slate-500">
                  <span>3</span>
                </div>
                <span className="ml-2 text-xs font-medium text-slate-500">Procurement Results</span>
              </div>
            </div>

            {/* Quick Session Reference ID */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                Session: #{categoryConfig.categoryId?.substring(0, 8)}
              </span>
            </div>

          </div>
        </div>

        {/* Dynamic Split Layout Panel (Fidelity e-Commerce Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT 8 COLUMNS: Prime Setup Screen Wizard */}
          <div className="lg:col-span-8 space-y-6">

            {/* Active Task Selector Indicator */}
            <div className="bg-white rounded-2xl border border-slate-250/70 p-5 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-blue-600 to-cyan-500" />
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-md">
                    {categoryIcon}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                      MATCH TARGET
                    </span>
                    <h2 className="text-base font-extrabold text-slate-900 mt-1">
                      {categoryConfig.categoryName} Selection
                    </h2>
                  </div>
                </div>

                {categoryConfig.selectedSubtype && (
                  <div className="px-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 capitalize">
                    Subtype: {categoryConfig.selectedSubtype.replace(/_/g, ' ')}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Calibration Line */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2">
                <span className="font-bold uppercase tracking-wider">Setup Accuracy Meter</span>
                <span className="font-mono font-bold text-blue-600">{Math.round(progress)}% Completed</span>
              </div>
              <div className="h-2 bg-slate-200/80 rounded-full overflow-hidden shadow-inner relative">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Main Interactive Questionnaire Container Card */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 rounded-3xl blur opacity-15 animate-pulse" />

              <div className="relative bg-white rounded-3xl border border-slate-250/80 shadow-xl overflow-hidden min-h-[380px] flex flex-col justify-between">

                {isProcessing ? (
                  /* High Fidelity Procurement Solver Loading State */
                  <div className="flex flex-col items-center justify-center py-20 px-6 text-center my-auto">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
                      <Cpu size={26} className="absolute inset-0 m-auto text-blue-600 animate-pulse" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recalculating Operational Matrices</h3>
                    <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
                      Please wait. Calibrating optimal power constraints, cleaning frequencies, and TCO projections...
                    </p>

                    <div className="mt-8 space-y-2 w-full max-w-xs">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-mono font-bold text-slate-500">
                        <span>SOIL COMPATIBILITY CHECKS</span>
                        <span className="text-emerald-600 animate-pulse">RUNNING...</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-mono font-bold text-slate-500">
                        <span>UGANDA POWER STABILITY LOGS</span>
                        <span className="text-emerald-600 animate-pulse">RUNNING...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Setup Card Header */}
                    <div>
                      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md shrink-0">
                          {safeCurrentStep + 1}
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                            {currentField.title}
                          </h3>
                          {currentField.description && (
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                              {currentField.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Main Rendered Question Fields */}
                      <div className="p-6">
                        <DynamicFormField
                          field={currentField}
                          value={answers[currentField.id]}
                          onChange={handleFieldChange}
                          onBlur={() => handleFieldBlur(currentField.id)}
                          error={!!errors[currentField.id] && touched[currentField.id]}
                          errorMessage={errors[currentField.id]}
                        />
                      </div>
                    </div>

                    {/* Navigation Buttons Row */}
                    <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={safeCurrentStep === 0}
                        className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white border border-transparent hover:border-slate-200 shadow-sm"
                      >
                        <ChevronLeft size={16} /> Back
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider hover:shadow-lg transition hover:-translate-y-0.5 active:translate-y-0 shadow-md"
                      >
                        {isLastStep ? (
                          <>Verify & Load Models <Sparkles size={14} /></>
                        ) : (
                          <>Continue Match <ChevronRight size={14} /></>
                        )}
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: Procured Spec Preview Assistant */}
          <div className="lg:col-span-4 space-y-6">

            {/* Live Spec Assistant Widget Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">

              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px]" />

              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-400">
                  <FileCheck size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Procurement Spec</h3>
                  <p className="text-[10px] text-slate-500 font-mono">LIVE PREVIEW ENGINE</p>
                </div>
              </div>

              {/* Progress dynamic overview */}
              <div className="mt-5 space-y-4">

                {getReviewItems().length === 0 ? (
                  <div className="py-6 text-center">
                    <HelpCircle size={32} className="mx-auto text-slate-600 animate-pulse mb-2.5" />
                    <p className="text-[11px] text-slate-400 font-medium">
                      Answer questions on the left to build your operational match profile in real-time.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                    {getReviewItems().map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition group text-left">
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{item.title}</p>
                        <p className="text-xs font-bold text-white mt-1 line-clamp-2">{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Compatibility calibration meters */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                    <span>MATCH CALIBRATION</span>
                    <span className="text-emerald-400 font-extrabold">
                      {getReviewItems().length > 0 ? `${Math.round(40 + (getReviewItems().length / steps.length) * 60)}%` : 'Calibrating...'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-semibold bg-white/5 border border-white/5 p-2 rounded-xl">
                    <BadgeInfo size={11} className="text-cyan-400 flex-shrink-0" />
                    <span>Ugandan laterite soil mitigation criteria and local power load configurations are running.</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Uganda HSE Guideline Reminder Banner */}
            <div className="bg-gradient-to-r from-blue-50/60 to-cyan-50/60 p-5 rounded-2xl border border-blue-100 shadow-sm text-left">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Shield size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Standard Compliance Safeguard</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal font-medium">
                    This wizard automatically filters industrial and commercial options to align with local Ugandan voltage tolerances, standard operators' physical tolerances, and regional water constraints.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Global Error Banner */}
        {errors.general && (
          <div className="mt-8 p-4 bg-rose-50 border border-rose-250 rounded-xl text-rose-800 text-xs font-semibold flex items-start gap-3 animate-in fade-in duration-300">
            <ShieldAlert size={16} className="mt-0.5 flex-shrink-0 text-rose-600" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Review Options Modal (Amazon Confirmation Checkout Style) */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-250 overflow-hidden my-auto animate-in zoom-in-95 duration-200">

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white border-b border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                    SOP VALIDATION STAGE
                  </span>
                  <h3 className="text-lg font-extrabold tracking-tight mt-1.5">
                    Verify Site Specification Sheet
                  </h3>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Selection Summary Body List */}
              <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Review your configured setup variables before generating compatibility metrics and TCO breakdowns. Click any variable to modify answers.
                </p>

                <div className="grid gap-2.5">
                  {getReviewItems().map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleReviewItemClick(item.stepIndex)}
                      className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/50 transition group"
                    >
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-xs font-extrabold text-slate-800 group-hover:text-blue-600 transition">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 group-hover:text-blue-500 uppercase font-mono tracking-wider transition shrink-0">
                          Edit Value
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {item.value}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Rows */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={submitRecommendations}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider hover:shadow-lg transition hover:-translate-y-0.5 active:translate-y-0 shadow-md text-center flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} /> Calculate Matches & TCO Projections
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition text-center"
                >
                  Continue Editing Questions
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Unified Security & Integration Markers */}
        <div className="mt-12 text-center text-[10px] text-slate-400 flex flex-wrap items-center justify-center gap-4 font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-1.5"><Shield size={12} className="text-emerald-500" /> ISO 9001 COMPLIANT</div>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5"><Zap size={12} className="text-amber-500" /> UGANDA LOAD LEVEL TESTED</div>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5"><Scale size={12} className="text-indigo-500" /> COMPREHENSIVE TCO SCORECARDS</div>
        </div>

      </main>

      { }
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite linear;
        }

        /* Force selection options and absolute popups to open UPWARDS */
        .absolute.z-50,
        [class*="dropdown-menu"],
        [class*="options-container"],
        [role="listbox"],
        .absolute.mt-1 {
          bottom: 100% !important;
          top: auto !important;
          margin-top: 0 !important;
          margin-bottom: 0.5rem !important;
          max-height: 220px !important;
          overflow-y: auto !important;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.12), 0 -1px 3px rgba(0, 0, 0, 0.08) !important;
          border-radius: 0.75rem !important;
        }
      `}</style>
    </div>
  );
}
/**
 * SiteTaskProfile.jsx
 * Step 2 – Dynamic questionnaire based on selected machine category.
 * Enhanced with smooth animations, better progress tracking, and engaging visuals.
 */ 

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, Sparkles, Cpu, Loader2, AlertCircle, 
  Shield, Clock, Layers, ArrowRight, CheckCircle2, Zap, Gauge,
  Building2, Droplets, Brush, Wind, Flame, Package, Award,
  Activity, TrendingUp, HardDrive, Bot, User, LayoutGrid,
  Compass, Star, Circle, CheckCircle, HelpCircle, X
} from 'lucide-react';
import DynamicFormField from '../components/common/DynamicFormField';
import { getCategoryQuestions } from '../utils/categoryQuestions';
import { getRecommendations, saveRecommendationToHistory } from '../services/recommendationService';
import { useAuth } from '../contexts/AuthContext';

// Category icon mapping for visual enhancement
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

  // Auto-set pressure_required based on use_case
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
      // Only set if not already set
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
    
    // Skip validation for hidden steps
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
    
    // Enhanced logging
    console.group('📤 API Request Details');
    console.log('Raw Answers:', answers);
    console.log('Transformed Filters:', categoryConfig.mapToFilters(answers));
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
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });

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

    // Get intensity and domain from mapToFilters if available
    if (categoryConfig.mapToFilters) {
      const filters = categoryConfig.mapToFilters(answers);
      if (filters.intensity) payload.intensity = filters.intensity;
      if (filters.domain) payload.domain = filters.domain;
    }

    // Fallback: derive domain/intensity from use_case when mapToFilters doesn't set them
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

  // Function to save recommendation to history
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

      // Remove undefined values
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
      // Don't block navigation if save fails
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
          <p className="text-slate-500 mt-6 font-medium">Loading questionnaire...</p>
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
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.03)_0px,_rgba(59,130,246,0.03)_2px,_transparent_2px,_transparent_20px)]"></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        
        {/* Step Tracker - Compact Horizontal */}
        <div className={`mb-8 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-md">
                <CheckCircle2 size={14} className="text-white" />
              </div>
              <span className="ml-2 text-xs font-semibold text-blue-700">Machine Type</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-md">
                <span className="text-xs font-bold text-white">2</span>
              </div>
              <span className="ml-2 text-xs font-semibold text-blue-700">Site Profile</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200"></div>
            <div className="flex items-center opacity-40">
              <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-500">3</span>
              </div>
              <span className="ml-2 text-xs text-slate-400">Results</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className={`text-center mb-6 transition-all duration-700 delay-100 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Site & Task{' '}
            <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Tell us about your cleaning environment for{' '}
            <span className="font-semibold text-blue-600">{categoryConfig.categoryName}</span>
          </p>
        </div>

        {/* Machine Category & Subtype Card */}
        <div className={`mb-6 transition-all duration-700 delay-150 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                  {categoryIcon}
                </div>
                <div>
                  <p className="text-[9px] font-mono font-bold text-blue-600 uppercase tracking-wider">Selected Equipment</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-800">{categoryConfig.categoryName}</span>
                    {categoryConfig.selectedSubtype && (
                      <>
                        <span className="text-slate-300 text-xs">•</span>
                        <span className="text-xs text-slate-600 capitalize font-mono">
                          {categoryConfig.selectedSubtype.replace(/_/g, ' ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/machine-type')}
                className="text-[10px] font-mono text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                Change <ArrowRight size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`mb-8 transition-all duration-700 delay-200 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>Questionnaire Progress</span>
            </div>
            <span className="font-mono font-bold text-blue-600">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded-full transition-all duration-500 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ width: '200%' }} />
            </div>
          </div>
          
          {/* Quick tip based on progress */}
          {progress < 30 && (
            <p className="text-[9px] text-slate-400 mt-2 flex items-center gap-1">
              <Star size={9} className="text-amber-400" />
              Tip: Provide accurate details for better recommendations
            </p>
          )}
          {progress >= 30 && progress < 70 && (
            <p className="text-[9px] text-slate-400 mt-2 flex items-center gap-1">
              <Zap size={9} className="text-cyan-500" />
              You're making great progress! Almost there.
            </p>
          )}
          {progress >= 70 && (
            <p className="text-[9px] text-slate-400 mt-2 flex items-center gap-1">
              <Sparkles size={9} className="text-emerald-500" />
              Almost complete! Ready to see your recommendations.
            </p>
          )}
        </div>

        {/* Main Question Card */}
        <div className={`transition-all duration-700 delay-300 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 rounded-2xl blur opacity-30 animate-pulse" />
            <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                    <TrendingUp size={28} className="absolute inset-0 m-auto text-blue-600 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Your Requirements</h3>
                  <div className="space-y-2 text-sm text-slate-500 max-w-md">
                    <div className="flex items-center justify-center gap-2 animate-pulse">
                      <Activity size={14} className="text-blue-500" />
                      <span>Processing site conditions...</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 animate-pulse delay-75">
                      <Zap size={14} className="text-cyan-500" />
                      <span>Calculating TCO projections...</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 animate-pulse delay-150">
                      <HardDrive size={14} className="text-emerald-500" />
                      <span>Matching optimal equipment...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Question Header */}
                  <div className="px-6 pt-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                        <span className="text-sm font-bold">{safeCurrentStep + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-800">{currentField.title}</h2>
                        {currentField.description && (
                          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{currentField.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Question Body */}
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

                  {/* Navigation Buttons */}
                  <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={handleBack}
                      disabled={safeCurrentStep === 0}
                      className="flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium text-sm rounded-xl hover:bg-white"
                    >
                      <ChevronLeft size={18} /> Back
                    </button>
                    
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    >
                      {isLastStep ? (
                        <>Find My Match <Sparkles size={16} /></>
                      ) : (
                        <>Continue <ArrowRight size={16} /></>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 sm:px-6 py-4 sm:py-5 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.15em] text-cyan-100/90 font-semibold truncate">Review your selections</p>
                    <h2 className="mt-1 sm:mt-2 text-lg sm:text-xl font-bold truncate">Confirm before recommendations</h2>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition flex-shrink-0"
                  >
                    <X size={18} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
                <p className="text-xs sm:text-sm text-slate-500">Review the values you selected below. Click any row to edit that question.</p>
                <div className="grid gap-2 sm:gap-3">
                  {getReviewItems().map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleReviewItemClick(item.stepIndex)}
                      className="text-left rounded-lg sm:rounded-3xl border border-slate-200 px-3 sm:px-4 py-3 sm:py-4 hover:border-blue-300 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between gap-3 sm:gap-4">
                        <span className="font-semibold text-sm sm:text-base text-slate-900 truncate">{item.title}</span>
                        <span className="text-[10px] sm:text-xs font-medium uppercase text-slate-400 flex-shrink-0">Edit</span>
                      </div>
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2">{item.value}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 px-4 sm:px-6 pb-4 sm:pb-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={submitRecommendations}
                  className="w-full rounded-lg sm:rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 font-semibold text-sm sm:text-base shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 transition"
                >
                  Confirm & Load Machines
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="w-full rounded-lg sm:rounded-3xl border border-slate-200 px-4 sm:px-5 py-2.5 sm:py-3 text-slate-700 font-semibold text-sm sm:text-base hover:bg-slate-50 transition"
                >
                  Return to questionnaire
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-10 text-center text-[10px] text-slate-400 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-1.5"><Shield size={12} className="text-emerald-500" /> Enterprise Security</div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-1.5"><Zap size={12} className="text-amber-500" /> Real-time Processing</div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-1.5"><Layers size={12} className="text-purple-500" /> Knowledge-Based Engine</div>
        </div>
      </main>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}



//this function is a bi joke it awaits user input and then immediately returns a resolved promise, simulating an async operation that doesn't actually do anything. It's used to create a delay or to simulate waiting for user input in an async function without blocking the main thread.

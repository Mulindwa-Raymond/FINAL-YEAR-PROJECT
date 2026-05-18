/**
 * SiteTaskProfile.jsx
 * 
 * Step 2 of the user flow – collects site and task details.
 * Uses the machine category selected in the previous step (MachineTypeSelection).
 * Fields align with the ERD Recommendation model:
 * - area_size (m²)
 * - surface_type (enum)
 * - dirt_type (enum)
 * - power_stability (enum)
 * - budget (used for filtering)
 * - cleaning_frequency (used for intensity calculation)
 * - eco_preference (filter for detergents)
 * 
 * Navigates to /recommendation-results with all collected data.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Cpu,
  Activity,
  Layers,
  DollarSign,
  Shield,
  Sparkles,
  ArrowRight,
  Clock,
  Ruler,
  Droplet,
  Battery,
  Leaf,
  Calendar
} from 'lucide-react';
import Navbar from '../components/Navbar';

// Surface type options (matching Equipment model)
const surfaceOptions = [
  { value: 'tile', label: 'Ceramic Tile / Vinyl', icon: '🔲' },
  { value: 'concrete', label: 'Concrete / Industrial Floor', icon: '🏭' },
  { value: 'wood', label: 'Hardwood / Laminate', icon: '🪵' },
  { value: 'carpet', label: 'Textile / Carpet', icon: '🧺' },
  { value: 'marble', label: 'Marble / Natural Stone', icon: '💎' },
  { value: 'glass', label: 'Glass / Window', icon: '🪟' },
];

// Dirt type options (matching Equipment model)
const dirtOptions = [
  { value: 'red laterite soil', label: 'Red Laterite (Uganda Standard)', icon: '🔴' },
  { value: 'grease', label: 'Industrial Grease / Oil', icon: '⚙️' },
  { value: 'dust', label: 'General Dust / Construction', icon: '💨' },
  { value: 'heavy soil', label: 'Heavy Soil / Mud', icon: '🌍' },
  { value: 'organic', label: 'Organic Stains / Food', icon: '🍽️' },
  { value: 'lime scale', label: 'Lime Scale / Mineral Deposits', icon: '🧂' },
];

// Power stability options
const powerOptions = [
  { value: 'stable', label: 'Regulated / Stable Grid', description: 'Recommended for corded machines', icon: '⚡' },
  { value: 'unstable', label: 'Fluctuating / Generator Based', description: 'Battery‑powered machines recommended', icon: '🔋' },
];

export default function SiteTaskProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    machineCategory: '',
    categoryName: '',
    areaSize: '',
    surfaceType: 'tile',
    dirtType: 'dust',
    powerStability: 'stable',
    budget: '',
    ecoPreference: false,
    cleaningFrequency: 'daily',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Load machine category from navigation state
  useEffect(() => {
    const state = location.state;
    if (state?.machineCategory) {
      setFormData(prev => ({
        ...prev,
        machineCategory: state.machineCategory,
        categoryName: state.categoryName || state.machineCategory.replace(/_/g, ' '),
      }));
    } else {
      // Redirect back to machine type selection if no category selected
      navigate('/machine-type', { replace: true });
    }
  }, [location, navigate]);

  const steps = [
    { id: 'area', title: 'Area & Surface', icon: <Ruler size={18} /> },
    { id: 'soil', title: 'Soil & Dirt', icon: <Droplet size={18} /> },
    { id: 'power', title: 'Power & Budget', icon: <Battery size={18} /> },
    { id: 'preferences', title: 'Preferences', icon: <Sparkles size={18} /> },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Validate required fields
      if (!formData.areaSize || !formData.budget) {
        alert('Please fill in all required fields (Area and Budget).');
        return;
      }
      // Final step – process and navigate to results
      setIsProcessing(true);
      setTimeout(() => {
        navigate('/recommendation-results', { state: { formData } });
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  // Check if the current step has required fields filled
  const isStepValid = () => {
    if (currentStep === 0) return formData.areaSize && formData.surfaceType;
    if (currentStep === 1) return formData.dirtType;
    if (currentStep === 2) return formData.powerStability && formData.budget;
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-cyan-200">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,0.4)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 lg:py-16">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 border border-cyan-200 text-cyan-700 text-[10px] font-mono font-bold tracking-[0.2em] uppercase rounded-full mb-4">
            <Activity size={12} className="animate-pulse" /> Step 2 of 3
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            Site & Task Profile
          </h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Tell us about your cleaning environment for <span className="font-semibold text-cyan-700">{formData.categoryName || 'selected machine'}</span>
          </p>
        </div>

        {/* Step Progress */}
        <div className="relative mb-12 px-4">
          <div className="flex justify-between items-center relative z-10">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                  idx <= currentStep ? 'bg-cyan-600 border-cyan-600 text-white shadow-lg shadow-cyan-100' : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {idx < currentStep ? <CheckCircle2 size={20} /> : step.icon}
                </div>
                <span className={`text-[10px] font-mono uppercase tracking-widest mt-3 font-bold transition-colors ${idx <= currentStep ? 'text-cyan-600' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-6 left-12 right-12 h-0.5 bg-slate-100 -z-0">
            <div className="h-full bg-cyan-600 transition-all duration-700" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-[2rem] blur opacity-10 transition duration-1000"></div>
          <div className="relative bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
            
            <div className="p-8 md:p-12">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin"></div>
                    <Cpu size={32} className="absolute inset-0 m-auto text-cyan-600 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Processing your profile...</h3>
                  <div className="space-y-1 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                    <p className="animate-pulse">Analyzing surface compatibility</p>
                    <p className="animate-pulse delay-75">Calculating TCO projections</p>
                    <p className="animate-pulse delay-150">Matching detergents to soil type</p>
                  </div>
                </div>
              ) : (
                <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{steps[currentStep].title}</h2>
                  <p className="text-slate-400 text-sm mb-8">
                    {currentStep === 0 && "Enter the area size and select the surface type you'll be cleaning."}
                    {currentStep === 1 && "What type of dirt or soil do you need to remove?"}
                    {currentStep === 2 && "Tell us about your power situation and budget."}
                    {currentStep === 3 && "Set your preferences for eco-friendly options and cleaning frequency."}
                  </p>

                  <div className="space-y-6">
                    {/* Step 0: Area Size & Surface Type */}
                    {currentStep === 0 && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                            Operational Area (m²) *
                          </label>
                          <div className="relative">
                            <Ruler size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="number"
                              name="areaSize"
                              value={formData.areaSize}
                              onChange={handleChange}
                              placeholder="e.g., 500"
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:bg-white focus:border-cyan-500 transition-all outline-none"
                              required
                            />
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1">* Used to match machine capacity and runtime requirements.</p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                            Surface Type *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {surfaceOptions.map(option => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, surfaceType: option.value }))}
                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                                  formData.surfaceType === option.value
                                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <span className="text-xl">{option.icon}</span>
                                <span className="text-sm font-medium">{option.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 1: Dirt Type */}
                    {currentStep === 1 && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                          Primary Soil / Dirt Type *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {dirtOptions.map(option => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, dirtType: option.value }))}
                              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                                formData.dirtType === option.value
                                  ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <span className="text-xl">{option.icon}</span>
                              <div className="text-left">
                                <p className="text-sm font-medium">{option.label}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Power Stability & Budget */}
                    {currentStep === 2 && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                            Power Stability *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {powerOptions.map(option => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, powerStability: option.value }))}
                                className={`flex flex-col items-start gap-2 p-4 rounded-2xl border-2 transition-all ${
                                  formData.powerStability === option.value
                                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <span className="text-xl">{option.icon}</span>
                                <div>
                                  <p className="text-sm font-medium">{option.label}</p>
                                  <p className="text-[10px] text-slate-400 mt-1">{option.description}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                            Estimated Budget (UGX) *
                          </label>
                          <div className="relative">
                            <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="number"
                              name="budget"
                              value={formData.budget}
                              onChange={handleChange}
                              placeholder="e.g., 5000000"
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:bg-white focus:border-cyan-500 transition-all outline-none"
                              required
                            />
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1">* Used to filter equipment within your price range.</p>
                        </div>
                      </>
                    )}

                    {/* Step 3: Eco Preference & Cleaning Frequency */}
                    {currentStep === 3 && (
                      <>
                        <div className="space-y-2">
                          <label className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-cyan-50/50 hover:border-cyan-200 transition-all group">
                            <div className="flex items-center gap-4">
                              <Leaf className={`w-6 h-6 ${formData.ecoPreference ? 'text-green-600' : 'text-slate-400'}`} />
                              <div>
                                <span className="text-sm font-bold text-slate-800 block">Eco‑Efficiency Filter</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Prioritise biodegradable detergents</span>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              name="ecoPreference"
                              checked={formData.ecoPreference}
                              onChange={handleChange}
                              className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                            />
                          </label>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                            Cleaning Frequency
                          </label>
                          <div className="relative">
                            <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                              name="cleaningFrequency"
                              value={formData.cleaningFrequency}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:bg-white focus:border-cyan-500 transition-all outline-none appearance-none"
                            >
                              <option value="daily">Daily (High traffic / Intensive use)</option>
                              <option value="weekly">Weekly (Moderate / Commercial)</option>
                              <option value="monthly">Monthly (Light / Occasional)</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button 
                onClick={handleBack}
                disabled={currentStep === 0 || isProcessing}
                className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-slate-900 disabled:opacity-0 transition-all font-bold text-xs uppercase tracking-widest"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button 
                onClick={handleNext}
                disabled={isProcessing || !isStepValid()}
                className={`flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-cyan-600 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:hover:translate-y-0 shadow-lg shadow-slate-200`}
              >
                {currentStep === steps.length - 1 ? 'Generate Recommendations' : 'Continue'}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-10 text-center text-[10px] text-slate-400 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2"><Shield size={12} /> Data encrypted</div>
          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
          <div className="flex items-center gap-2"><Clock size={12} /> 4‑step process</div>
          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
          <div className="flex items-center gap-2"><Layers size={12} /> Accurate recommendations</div>
        </div>
      </main>
    </div>
  );
}
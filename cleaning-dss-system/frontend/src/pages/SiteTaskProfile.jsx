import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Cpu,
  Activity,
  Layers,
  DollarSign,
  Shield,
  Droplet,
  Battery,
  Wrench,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SiteTaskProfile() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    surfaceType: 'tile',
    dirtType: 'red laterite',
    area: '500',
    budget: '5000000',
    powerStability: 'unstable',
    sparePartsTolerance: 'high',
    ecoPreference: false,
    cleaningFrequency: 'daily'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 'surface', title: 'Surface & Soil', icon: <Layers size={18} /> },
    { id: 'scale', title: 'Scale & Budget', icon: <DollarSign size={18} /> },
    { id: 'logistics', title: 'Power & Spares', icon: <Battery size={18} /> },
    { id: 'preferences', title: 'Eco & Frequency', icon: <Sparkles size={18} /> }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
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
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-cyan-200">
      {/* Background (matching home) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,0.4)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: `radial-gradient(#0ea5e9 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 lg:py-16">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 border border-cyan-200 text-cyan-700 text-[10px] font-mono font-bold tracking-[0.2em] uppercase rounded-full mb-4">
            <Activity size={12} className="animate-pulse" /> Site & Task Profiling
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            Tell us about your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">cleaning environment</span>
          </h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">We'll use this data to find the most efficient machines and detergents for your specific site.</p>
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
                    <p className="animate-pulse">Analysing surface compatibility</p>
                    <p className="animate-pulse delay-75">Calculating TCO projections</p>
                    <p className="animate-pulse delay-150">Matching detergents to soil type</p>
                  </div>
                </div>
              ) : (
                <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{steps[currentStep].title}</h2>
                  <p className="text-slate-400 text-sm mb-8">Please provide accurate details for this section.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {currentStep === 0 && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Surface Composition</label>
                          <select name="surfaceType" value={formData.surfaceType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 focus:bg-white focus:border-cyan-500 transition-all outline-none">
                            <option value="tile">Ceramic Tile / Vinyl</option>
                            <option value="concrete">Concrete / Industrial Floor</option>
                            <option value="carpet">Textile / Carpet</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Primary Soil Type</label>
                          <select name="dirtType" value={formData.dirtType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 focus:bg-white focus:border-cyan-500 transition-all outline-none">
                            <option value="red laterite">Red Laterite (Uganda Standard)</option>
                            <option value="grease">Industrial Grease / Oil</option>
                            <option value="dust">General Dust / Construction</option>
                          </select>
                        </div>
                      </>
                    )}

                    {currentStep === 1 && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Operational Area (m²)</label>
                          <div className="relative">
                            <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 focus:bg-white focus:border-cyan-500 transition-all outline-none" />
                            <Layers size={16} className="absolute right-4 top-4 text-slate-300" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Budget (UGX)</label>
                          <div className="relative">
                            <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 focus:bg-white focus:border-cyan-500 transition-all outline-none" />
                            <DollarSign size={16} className="absolute right-4 top-4 text-slate-300" />
                          </div>
                        </div>
                      </>
                    )}

                    {currentStep === 2 && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Grid Stability</label>
                          <select name="powerStability" value={formData.powerStability} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 focus:bg-white focus:border-cyan-500 transition-all outline-none">
                            <option value="stable">Regulated / Stable</option>
                            <option value="unstable">Fluctuating / Generator Based</option>
                          </select>
                          <p className="text-[9px] text-slate-400 mt-1">* Battery‑powered machines are recommended for unstable grids.</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Spare Parts Support</label>
                          <select name="sparePartsTolerance" value={formData.sparePartsTolerance} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 focus:bg-white focus:border-cyan-500 transition-all outline-none">
                            <option value="high">Immediate Local Availability</option>
                            <option value="medium">10-14 Day Lead Time</option>
                            <option value="low">Global Sourcing Accepted</option>
                          </select>
                        </div>
                      </>
                    )}

                    {currentStep === 3 && (
                      <>
                        <div className="md:col-span-2 space-y-2">
                          <label className="flex items-center gap-4 cursor-pointer group bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 hover:bg-cyan-50/50 hover:border-cyan-200 transition-all">
                            <div className="relative">
                              <input type="checkbox" name="ecoPreference" checked={formData.ecoPreference} onChange={handleChange} className="sr-only peer" />
                              <div className="w-12 h-6 bg-slate-200 rounded-full peer-checked:bg-cyan-600 transition-colors"></div>
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-sm"></div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">Eco‑Efficiency Filter</span>
                              <span className="text-[11px] text-slate-400 uppercase tracking-tighter">Prioritise biodegradable detergents</span>
                            </div>
                            <Sparkles size={18} className="ml-auto text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </label>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Cleaning Frequency</label>
                          <select name="cleaningFrequency" value={formData.cleaningFrequency} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 focus:bg-white focus:border-cyan-500 transition-all outline-none">
                            <option value="daily">Daily (High traffic)</option>
                            <option value="weekly">Weekly (Moderate)</option>
                            <option value="monthly">Monthly (Low use)</option>
                          </select>
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
                disabled={isProcessing}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-cyan-600 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 shadow-lg shadow-slate-200"
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
        </div>
      </main>
    </div>
  );
}
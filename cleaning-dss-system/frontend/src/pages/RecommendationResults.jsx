import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Zap,
  Battery,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  X,
  Plus,
  Minus,
  TrendingDown,
  Wrench,
  DollarSign,
  Shield,
  Star,
  MessageSquare,
  Bug
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeedbackModal from '../components/FeedbackModal';
import { getRecommendations } from '../services/recommendationService';

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'UGX', minimumFractionDigits: 0 }).format(amount);
};

export default function RecommendationResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};

  const [filteredMachines, setFilteredMachines] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendationId, setRecommendationId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  // DEBUG: Force feedback modal for testing (Method 2)
  const [forceFeedback, setForceFeedback] = useState(false);

  // Fetch recommendations from backend
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!formData) {
        setError('No site profile data found. Please start over.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Prepare request body according to ERD
        const requestBody = {
          machine_category: formData.machineCategory,
          area_size: parseFloat(formData.areaSize),
          surface_type: formData.surfaceType,
          dirt_type: formData.dirtType,
          power_stability: formData.powerStability,
          budget: parseFloat(formData.budget),
          eco_preference: formData.ecoPreference || false,
          cleaning_frequency: formData.cleaningFrequency || 'weekly',
        };

        const response = await getRecommendations(requestBody);
        const data = response.data.data;
        
        setFilteredMachines(data.recommendations || []);
        setRecommendationId(data.recommendation_id || `rec_${Date.now()}`);
        setAnimate(true);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setError(err.response?.data?.error || 'Failed to load recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [formData]);

  // Show feedback modal after recommendations are displayed (automatic)
  useEffect(() => {
    if (!loading && filteredMachines.length > 0 && !feedbackSubmitted && recommendationId && !forceFeedback) {
      // Delay a bit to let user see the results first
      const timer = setTimeout(() => {
        setShowFeedback(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, filteredMachines.length, feedbackSubmitted, recommendationId, forceFeedback]);

  // DEBUG: Force feedback modal when debug button is clicked
  useEffect(() => {
    if (forceFeedback) {
      setShowFeedback(true);
    }
  }, [forceFeedback]);

  const addToCompare = (machine) => {
    if (compareList.length < 2 && !compareList.find(m => m.id === machine.id)) {
      setCompareList([...compareList, machine]);
    }
  };

  const removeFromCompare = (id) => {
    setCompareList(compareList.filter(m => m.id !== id));
  };

  const openCompare = () => setShowCompare(true);
  const closeCompare = () => setShowCompare(false);

  const handleFeedbackSuccess = () => {
    setFeedbackSubmitted(true);
    setShowFeedback(false);
    setForceFeedback(false); // Reset debug flag
  };

  const handleForceFeedback = () => {
    // Create a mock recommendation ID if none exists
    if (!recommendationId) {
      setRecommendationId(`debug_rec_${Date.now()}`);
    }
    setForceFeedback(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500">Analyzing your site profile...</p>
          <p className="text-xs text-slate-400 mt-2">Matching equipment and calculating TCO</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Recommendations</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/site-task-profile')}
            className="px-6 py-2 bg-cyan-600 text-white rounded-xl"
          >
            Go Back to Site Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-cyan-200">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,0.4)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
        {/* DEBUG: Force Feedback Button - visible at bottom right corner */}
        <div className="fixed bottom-20 right-4 z-50">
          <button
            onClick={handleForceFeedback}
            className="flex items-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-xs font-bold shadow-lg transition-all"
            title="Debug: Force open feedback modal (Method 2)"
          >
            <Bug size={14} /> Test Feedback
          </button>
        </div>

        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold tracking-[0.2em] uppercase rounded-full mb-4">
            <CheckCircle2 size={12} /> Analysis Complete
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Intelligent Recommendations</span>
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Based on your site profile for {formData?.categoryName || formData?.machineCategory?.replace(/_/g, ' ') || 'selected equipment'}
          </p>
        </div>

        {/* Summary Cards */}
        <div className={`grid md:grid-cols-3 gap-4 mb-12 transition-all duration-700 delay-100 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Area Size</p>
            <p className="text-xl font-black text-slate-800">{formData?.areaSize} m²</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Surface Type</p>
            <p className="text-xl font-black text-slate-800 capitalize">{formData?.surfaceType}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Power Stability</p>
            <p className="text-xl font-black text-slate-800 capitalize">{formData?.powerStability}</p>
          </div>
        </div>

        {/* Machine Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 delay-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {filteredMachines.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500">No matching equipment found. Try adjusting your criteria.</p>
              <button
                onClick={() => navigate('/site-task-profile')}
                className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-xl"
              >
                Back to Site Profile
              </button>
            </div>
          ) : (
            filteredMachines.map((machine, idx) => (
              <div key={machine.id || idx} className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                <div className="h-56 relative bg-slate-100 overflow-hidden">
                  {machine.image_url ? (
                    <img src={machine.image_url} alt={machine.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100">
                      <Wrench className="w-16 h-16 text-cyan-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-black text-cyan-600 shadow-sm">
                    {machine.final_score || machine.match || 85}% MATCH
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-900">{machine.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{machine.brand} · {machine.category?.replace(/_/g, ' ') || machine.type}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 flex items-center gap-1"><DollarSign size={14} className="text-emerald-500" /> TCO (5‑year)</span>
                      <span className="font-bold text-slate-800">{formatCurrency(machine.tco_5year_ugx || machine.tco)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 flex items-center gap-1"><Zap size={14} className="text-cyan-500" /> Power</span>
                      <span className="font-bold text-slate-800">{machine.specifications?.power_kW || machine.power_req?.kW || 'N/A'} kW</span>
                    </div>
                  </div>

                  {/* Alerts */}
                  {machine.alerts && machine.alerts.length > 0 && (
                    <div className="mb-3 p-2 bg-yellow-50 rounded-xl">
                      {machine.alerts.map((alert, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs text-yellow-700">
                          <AlertTriangle size={12} /> {alert}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => addToCompare(machine)}
                      disabled={compareList.length >= 2 || compareList.find(m => m.id === machine.id)}
                      className="flex-1 py-2 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-50 hover:border-cyan-300 transition-all disabled:opacity-40"
                    >
                      Compare
                    </button>
                    <button 
                      onClick={() => {/* View details */}}
                      className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center justify-center gap-1"
                    >
                      Details <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detergent Section */}
        {filteredMachines.some(m => m.detergent) && (
          <div className={`mt-20 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden transition-all duration-700 delay-400 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-8 py-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Droplets size={20} className="text-cyan-600" />
                <h2 className="text-xl font-black text-slate-800">Recommended Detergents</h2>
              </div>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              {filteredMachines.map((machine, idx) => machine.detergent && (
                <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <Droplets size={24} className="text-cyan-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{machine.detergent.name}</h3>
                    <p className="text-[10px] text-slate-500">pH {machine.detergent.ph} · {formatCurrency(machine.detergent.price_ugx)}/{machine.detergent.package_size_liters}L</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {machine.detergent.eco_certified && (
                        <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Eco Certified</span>
                      )}
                      {machine.detergent.biodegradable && (
                        <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Biodegradable</span>
                      )}
                    </div>
                    {machine.detergent.compatibility_alerts?.length > 0 && (
                      <div className="mt-2 text-[9px] text-yellow-600 flex items-center gap-1">
                        <AlertTriangle size={10} /> {machine.detergent.compatibility_alerts[0]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white rounded-full px-6 py-3 shadow-2xl flex items-center gap-6 z-50">
            <span className="text-xs font-bold">{compareList.length}/2 selected</span>
            <div className="flex gap-2">
              {compareList.map(m => (
                <div key={m.id} className="flex items-center gap-2 bg-slate-700 rounded-full px-3 py-1 text-[10px]">
                  {m.name}
                  <button onClick={() => removeFromCompare(m.id)}><X size={12} /></button>
                </div>
              ))}
            </div>
            <button 
              onClick={openCompare}
              disabled={compareList.length !== 2}
              className="px-4 py-1.5 bg-cyan-600 rounded-full text-xs font-bold hover:bg-cyan-500 disabled:opacity-50"
            >
              Compare Now
            </button>
          </div>
        )}

        {/* Compare Modal */}
        {showCompare && compareList.length === 2 && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center">
                <h3 className="font-black text-slate-800 flex items-center gap-2"><BarChart3 size={18} /> Compare Machines</h3>
                <button onClick={closeCompare} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-8">
                {compareList.map(m => (
                  <div key={m.id} className="border border-slate-200 rounded-xl p-5">
                    <h4 className="text-lg font-black">{m.name}</h4>
                    <div className="space-y-3 mt-4 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Brand</span><span className="font-bold">{m.brand}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Power</span><span className="font-bold">{m.specifications?.power_kW || m.power_req?.kW} kW</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">5‑year TCO</span><span className="font-bold">{formatCurrency(m.tco_5year_ugx || m.tco)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Spare Parts Lead</span><span className="font-bold">{m.spare_part_lead_time_days || 'N/A'} days</span></div>
                    </div>
                    {m.alerts && m.alerts.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <span className="text-[10px] uppercase text-yellow-600">Alerts</span>
                        <ul className="mt-2 space-y-1">
                          {m.alerts.map((alert, i) => (
                            <li key={i} className="text-xs flex gap-2 text-yellow-600"><AlertTriangle size={12} />{alert}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back to Home Button */}
        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-white border border-slate-200 rounded-full text-slate-700 font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all"
          >
            ← Back to Home
          </button>
        </div>
      </main>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => {
          setShowFeedback(false);
          setForceFeedback(false);
        }}
        recommendationId={recommendationId}
        onSuccess={handleFeedbackSuccess}
      />
    </div>
  );
}
/**
 * History.jsx
 * User page for viewing recommendation history.
 * Fetches real data from backend API.
 * Features:
 * - List all user's past recommendations with pagination
 * - Search and filter by saved status
 * - View details, re-run recommendations, delete
 * - Stats summary and recent activity
 * - Enhanced display of machine details, brands, and categories
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  History as HistoryIcon,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Download,
  RotateCcw,
  Trash2,
  Filter,
  Search,
  ChevronRight,
  Zap,
  Droplet,
  BarChart3,
  Activity,
  FileText,
  Star,
  StarOff,
  Loader2,
  ChevronLeft,
  X,
  Sparkles,
  Gauge,
  Layers,
  TrendingUp,
  HardDrive,
  Lock,
  Brush,
  Wind,
  Flame,
  Package,
  Award,
  DollarSign,
  Wrench,
  Building2
} from 'lucide-react';
import { getRecommendationHistory, deleteRecommendation, toggleSaveRecommendation } from '../services/recommendationHistoryService';
import { ConfirmModal } from '../components/common/ConfirmModal';

// Helper to format currency
const formatCurrency = (amount) => {
  if (!amount) return 'UGX 0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper to format time
const formatTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get category icon
const getCategoryIcon = (category) => {
  switch(category) {
    case 'floor_scrubber': return <Brush size={14} />;
    case 'vacuum_cleaner': return <Wind size={14} />;
    case 'pressure_washer': return <Zap size={14} />;
    case 'steam_cleaner': return <Flame size={14} />;
    case 'carpet_cleaner': return <Package size={14} />;
    case 'sweeper': return <Activity size={14} />;
    case 'scrubber_drier': return <Award size={14} />;
    case 'window_cleaner': return <Droplet size={14} />;
    default: return <Wrench size={14} />;
  }
};

// Get category display name
const getCategoryDisplayName = (category) => {
  switch(category) {
    case 'floor_scrubber': return 'Floor Scrubber';
    case 'vacuum_cleaner': return 'Vacuum Cleaner';
    case 'pressure_washer': return 'Pressure Washer';
    case 'steam_cleaner': return 'Steam Cleaner';
    case 'carpet_cleaner': return 'Carpet Cleaner';
    case 'sweeper': return 'Sweeper';
    case 'scrubber_drier': return 'Scrubber Drier';
    case 'window_cleaner': return 'Window Cleaner';
    default: return category?.replace(/_/g, ' ') || 'Equipment';
  }
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSaved, setFilterSaved] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const limit = 10;

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Fetch recommendation history from backend
  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        saved_only: filterSaved || undefined,
        search: searchTerm || undefined,
      };
      
      console.log('Fetching history with params:', params);
      const response = await getRecommendationHistory(params);
      console.log('API Response:', response.data);
      
      let data = response.data?.data || response.data;
      
      setRecommendations(data.recommendations || []);
      setTotal(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / limit));
    } catch (err) {
      console.error('Failed to fetch history:', err);
      if (err.response?.status === 404) {
        setRecommendations([]);
        setTotal(0);
        setTotalPages(1);
        setError(null);
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load recommendation history.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterSaved, searchTerm, isAuthenticated]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleToggleSave = async (id, currentSaved) => {
    try {
      await toggleSaveRecommendation(id, !currentSaved);
      setRecommendations(prev =>
        prev.map(rec => rec._id === id ? { ...rec, saved: !currentSaved } : rec)
      );
    } catch (err) {
      console.error('Failed to toggle save:', err);
      alert(err.response?.data?.error || 'Failed to update saved status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRecommendation(deleteTarget._id);
      fetchHistory();
    } catch (err) {
      console.error('Failed to delete:', err);
      alert(err.response?.data?.error || 'Failed to delete recommendation. Please try again.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleViewDetails = (rec) => {
    navigate('/recommendation-details', { 
      state: { 
        machine: rec.recommendations?.[0] || rec,
        recommendationId: rec._id,
        category: { 
          categoryName: getCategoryDisplayName(rec.machine_category),
          categoryId: rec.machine_category
        }
      } 
    });
  };

  const handleReRun = (rec) => {
    navigate('/site-task-profile', {
      state: {
        machineCategory: rec.machine_category,
        categoryName: getCategoryDisplayName(rec.machine_category),
        areaSize: rec.area_size,
        surfaceType: rec.surface_type,
        dirtType: rec.dirt_type,
        powerStability: rec.power_stability,
        budget: rec.budget_ugx,
        ecoPreference: rec.eco_preference,
        cleaningFrequency: rec.cleaning_frequency,
        selectedSubtype: rec.machine_subtype,
      },
    });
  };

  const handleExportPDF = async (rec) => {
    alert(`Export PDF for recommendation #${rec._id} (feature coming soon)`);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <HistoryIcon className="absolute inset-0 m-auto w-5 h-5 text-blue-600" />
          </div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Loading history...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <Lock size={32} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Authentication Required</h2>
          <p className="text-slate-500 mb-6">Please log in to view your recommendation history.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.03)_0px,_rgba(59,130,246,0.03)_2px,_transparent_2px,_transparent_20px)]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
        
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 shadow-sm mb-5">
            <HistoryIcon size={12} className="text-blue-600" />
            <span className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider">Your Activity</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Recommendation{' '}
            <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">History</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            View, manage, and re-run your past equipment and detergent recommendations.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className={`mb-8 flex flex-wrap items-center justify-between gap-4 transition-all duration-700 delay-100 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by site, surface, soil..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm w-72 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition shadow-sm"
              />
            </div>
            <button
              onClick={() => {
                setFilterSaved(!filterSaved);
                setPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                filterSaved
                  ? 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star size={14} className={filterSaved ? 'fill-amber-500' : ''} />
              Saved only
            </button>
            {(searchTerm || filterSaved) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterSaved(false);
                  setPage(1);
                }}
                className="flex items-center gap-1 px-3 py-2 text-xs text-slate-400 hover:text-red-500 transition"
              >
                <X size={14} /> Clear filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
            <HardDrive size={12} className="text-slate-400" />
            <span className="text-xs font-mono text-slate-500">{total} recommendation{total !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {/* Recommendations List */}
        <div className="space-y-6">
          {recommendations.length === 0 && !loading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-lg">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <FileText size={40} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No recommendations yet</h3>
              <p className="text-slate-500 text-sm mb-6">
                {filterSaved ? "You haven't saved any recommendations." : "You haven't generated any recommendations yet."}
              </p>
              <button
                onClick={() => navigate('/machine-type')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-sm hover:shadow-lg transition"
              >
                Start a Recommendation
              </button>
            </div>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec._id || rec.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <HistoryIcon size={14} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {rec.site_name || `${rec.surface_type || 'Surface'} Cleaning`}
                        </h3>
                        {/* Category Badge */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[9px] font-semibold">
                          {getCategoryIcon(rec.machine_category)}
                          {getCategoryDisplayName(rec.machine_category)}
                        </span>
                        <button
                          onClick={() => handleToggleSave(rec._id, rec.saved)}
                          className="text-amber-500 hover:text-amber-600 transition p-1"
                          title={rec.saved ? 'Unsave' : 'Save'}
                        >
                          {rec.saved ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-400" /> {formatDate(rec.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className="text-slate-400" /> {formatTime(rec.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Building2 size={12} className="text-blue-500" /> {rec.surface_type || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Droplet size={12} className="text-cyan-500" /> {rec.dirt_type || 'N/A'}
                        </span>
                        {rec.area_size && (
                          <span className="flex items-center gap-1.5">
                            <Gauge size={12} className="text-slate-400" /> {rec.area_size} m²
                          </span>
                        )}
                        {rec.budget_ugx && (
                          <span className="flex items-center gap-1.5">
                            <DollarSign size={12} className="text-emerald-500" /> {formatCurrency(rec.budget_ugx)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(rec)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye size={12} /> View
                      </button>
                      <button
                        onClick={() => handleReRun(rec)}
                        className="px-3 py-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:from-blue-600 hover:to-cyan-600 transition flex items-center gap-1.5 shadow-sm"
                      >
                        <RotateCcw size={12} /> Re-run
                      </button>
                      <button
                        onClick={() => setDeleteTarget(rec)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Body - Recommended Machines - Enhanced Display */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center">
                      <Layers size={10} className="text-blue-600" />
                    </div>
                    <p className="text-[9px] font-mono uppercase text-slate-400 tracking-wider font-bold">Recommended Equipment</p>
                  </div>
                  
                  {rec.recommendations && rec.recommendations.length > 0 ? (
                    <div className="space-y-3">
                      {rec.recommendations.map((machine, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <Wrench size={16} className="text-blue-700" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-800">{machine.machine_name || machine.name || 'Equipment'}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-mono text-slate-500">{machine.brand || 'Brand'}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-[9px] text-slate-400 capitalize">{machine.power_source || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1.5">
                              <TrendingUp size={10} className="text-emerald-500" />
                              <p className="text-sm font-bold text-emerald-600">{machine.match || machine.score || 85}% match</p>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{formatCurrency(machine.tco || machine.estimated_tco_per_year_ugx)}/year</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 py-4 text-center">No equipment data available</p>
                  )}

                  {/* Recommended Detergent - Enhanced */}
                  {rec.detergent_name && (
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-md bg-cyan-50 flex items-center justify-center">
                          <Droplet size={10} className="text-cyan-600" />
                        </div>
                        <p className="text-[9px] font-mono uppercase text-slate-400 tracking-wider font-bold">Recommended Detergent</p>
                      </div>
                      <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded-xl border border-cyan-100">
                        <div className="w-10 h-10 rounded-lg bg-white border border-cyan-200 flex items-center justify-center shadow-sm">
                          <Droplet size={18} className="text-cyan-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-slate-800">{rec.detergent_name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            pH {rec.detergent_ph || 'N/A'} · {formatCurrency(rec.detergent_price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Recommended</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Alerts */}
                  {rec.alerts && rec.alerts.length > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={10} className="text-amber-600" />
                        <p className="text-[9px] font-mono uppercase text-amber-600 tracking-wider font-bold">Alerts</p>
                      </div>
                      {rec.alerts.map((alert, i) => (
                        <p key={i} className="text-xs text-amber-700 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                          {alert}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <div className="px-4 py-2 text-sm text-slate-600 bg-white rounded-lg border border-slate-200 shadow-sm">
              <span className="font-bold text-blue-600">{page}</span> of {totalPages}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Stats Section */}
        {recommendations.length > 0 && (
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <BarChart3 size={14} className="text-white" />
                </div>
                <h3 className="font-bold text-slate-800">Your Summary</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-slate-500">Total recommendations</span>
                  <span className="font-bold text-slate-800">{total}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-slate-500">Saved reports</span>
                  <span className="font-bold text-slate-800">{recommendations.filter(r => r.saved).length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Most used category</span>
                  <span className="font-bold text-blue-600 capitalize">
                    {(() => {
                      const categories = recommendations.map(r => r.machine_category).filter(Boolean);
                      const mostFrequent = categories.sort((a, b) =>
                        categories.filter(v => v === a).length - categories.filter(v => v === b).length
                      ).pop();
                      return getCategoryDisplayName(mostFrequent) || 'N/A';
                    })()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-blue-500/20 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Zap size={12} className="text-amber-400" />
                </div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400">Pro Tip</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Re-run a past recommendation to adjust parameters like budget or surface type — the system will refresh the matching and TCO.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Recommendation"
        message={`Are you sure you want to delete this recommendation from "${deleteTarget?.site_name || deleteTarget?.surface_type || 'this session'}"? This action cannot be undone.`}
        confirmVariant="danger"
        confirmText={deleting ? 'Deleting...' : 'Delete'}
      />
    </div>
  );
}
// frontend/src/pages/History.jsx
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
  Building2,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { getRecommendationHistory, deleteRecommendation, toggleSaveRecommendation } from '../services/recommendationHistoryService';
import { ConfirmModal } from '../components/common/ConfirmModal';

const formatCurrency = (amount) => {
  if (!amount) return 'UGX 0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'floor_scrubber': return <Brush size={13} />;
    case 'vacuum_cleaner': return <Wind size={13} />;
    case 'pressure_washer': return <Zap size={13} />;
    case 'steam_cleaner': return <Flame size={13} />;
    case 'carpet_cleaner': return <Package size={13} />;
    case 'sweeper': return <Activity size={13} />;
    case 'scrubber_drier': return <Award size={13} />;
    case 'window_cleaner': return <Droplet size={13} />;
    default: return <Wrench size={13} />;
  }
};

const getCategoryDisplayName = (category) => {
  switch (category) {
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

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit, saved_only: filterSaved || undefined, search: searchTerm || undefined };
      const response = await getRecommendationHistory(params);
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
      setRecommendations(prev => prev.map(rec => rec._id === id ? { ...rec, saved: !currentSaved } : rec));
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
        category: { categoryName: getCategoryDisplayName(rec.machine_category), categoryId: rec.machine_category }
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

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <HistoryIcon className="absolute inset-0 m-auto w-5 h-5 text-blue-600" />
          </div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Accessing Decisional Registry...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="text-center p-8 max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-amber-200 text-amber-500">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Authentication Required</h2>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed">Please log in to review standard DSS recommendation logs or audit configurations in your region.</p>
          <button onClick={() => navigate('/login')} className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-xs font-semibold hover:shadow-lg transition">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 text-slate-900 font-sans antialiased selection:bg-blue-100 overflow-x-hidden">

      {/* Background Decorative Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.015)_0px,_rgba(59,130,246,0.015)_2px,_transparent_2px,_transparent_20px)]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Dynamic Header Section */}
        <div className={`max-w-4xl mx-auto text-center mb-10 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 mb-3">
            <HistoryIcon size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">DSS Decisional Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
            Recommendation <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">History Logs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto mt-2 leading-relaxed font-medium">
            Review, evaluate, and re-trigger past analytical reports. Adjust soil profiles, standard power grid stability levels, or target pricing metrics to maintain compliance.
          </p>
        </div>

        {/* Filters & Control Dashboard */}
        <div className={`mb-8 bg-white p-4 rounded-2xl border border-slate-250/60 shadow-sm transition-all duration-700 delay-100 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs by site, surface, soils, or region..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-10 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(''); setPage(1); }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2 flex items-center gap-1">
                <SlidersHorizontal size={11} /> Quick Filter:
              </span>

              <button
                onClick={() => { setFilterSaved(!filterSaved); setPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition shadow-sm ${filterSaved
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <Star size={13} className={filterSaved ? 'fill-white' : 'text-amber-500'} />
                Saved Reports
              </button>

              {(searchTerm || filterSaved) && (
                <button
                  onClick={() => { setSearchTerm(''); setFilterSaved(false); setPage(1); }}
                  className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition ml-auto lg:ml-0"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Total Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm w-full lg:w-auto justify-center lg:justify-start">
              <HardDrive size={13} className="text-slate-400" />
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {total} REPORT LOGS INDEXED
              </span>
            </div>

          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-250/60 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle size={15} />
            {error}
          </div>
        )}

        {/* Main List Workspace */}
        <div className="space-y-6">
          {recommendations.length === 0 && !loading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                <FileText size={32} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No recommendations matched</h3>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                {filterSaved
                  ? "You haven't flagged any recommendation logs as saved yet."
                  : "No DSS parameters have been run or match your current filter query."}
              </p>
              <button
                onClick={() => navigate('/machine-type')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-xs font-semibold hover:shadow-md transition"
              >
                Start Technical Match Session
              </button>
            </div>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec._id || rec.id}
                className="bg-white rounded-2xl border border-slate-250/65 overflow-hidden hover:shadow-md transition-all duration-200 group relative"
              >
                {/* Save Flag Indicator */}
                {rec.saved && (
                  <div className="absolute top-0 right-10 w-6 h-6 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b flex items-center justify-center text-white shadow-sm z-10">
                    <Star size={11} fill="currentColor" />
                  </div>
                )}

                {/* Log Meta Bar */}
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* Header Left Title */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                          {getCategoryIcon(rec.machine_category)}
                          {getCategoryDisplayName(rec.machine_category)}
                        </span>

                        <h3 className="font-extrabold text-slate-900 text-base tracking-tight truncate max-w-xs">
                          {rec.site_name || `${getCategoryDisplayName(rec.machine_category)} Scenario`}
                        </h3>

                        <button
                          onClick={() => handleToggleSave(rec._id, rec.saved)}
                          className="text-amber-500 hover:scale-110 transition p-1"
                          title={rec.saved ? 'Unsave Report' : 'Save Report'}
                        >
                          {rec.saved ? <Star size={15} fill="currentColor" /> : <StarOff size={15} />}
                        </button>
                      </div>

                      {/* Config Param Badges */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium mt-2">
                        <span className="flex items-center gap-1"><Calendar size={11} className="text-slate-400" /> {formatDate(rec.created_at)}</span>
                        <span className="flex items-center gap-1"><Clock size={11} className="text-slate-400" /> {formatTime(rec.created_at)}</span>
                        <span className="flex items-center gap-1"><Building2 size={11} className="text-indigo-500" /> Surface: {rec.surface_type || 'N/A'}</span>
                        <span className="flex items-center gap-1"><Droplet size={11} className="text-cyan-500" /> Soil: {rec.dirt_type || 'N/A'}</span>
                        {rec.area_size && <span className="flex items-center gap-1"><Gauge size={11} className="text-slate-400" /> {rec.area_size} m²</span>}
                        {rec.budget_ugx && <span className="flex items-center gap-1 font-bold text-slate-700"><DollarSign size={11} className="text-emerald-500" /> {formatCurrency(rec.budget_ugx)}</span>}
                      </div>
                    </div>

                    {/* Header Right Action Box */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleViewDetails(rec)}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition flex items-center gap-1 shadow-sm text-slate-600"
                      >
                        <Eye size={12} /> View Details
                      </button>
                      <button
                        onClick={() => handleReRun(rec)}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-slate-800 transition flex items-center gap-1 shadow-sm"
                      >
                        <RotateCcw size={12} /> Re-run Params
                      </button>
                      <button
                        onClick={() => setDeleteTarget(rec)}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 text-rose-600 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition flex items-center shadow-sm"
                        title="Delete Session"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                  </div>
                </div>

                {/* Decisional Outcomes Rendered Area */}
                <div className="p-6">

                  {/* Recommended Equipment */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center">
                        <Layers size={10} className="text-blue-600" />
                      </div>
                      <p className="text-[9px] font-mono uppercase text-slate-400 tracking-wider font-extrabold">Recommended Equipment Match</p>
                    </div>

                    {rec.recommendations && rec.recommendations.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-3">
                        {rec.recommendations.slice(0, 2).map((machine, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/20 transition duration-150"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
                                <Wrench size={14} />
                              </div>
                              <div>
                                <p className="font-extrabold text-xs text-slate-800">
                                  {machine.machine_name || machine.name || 'Equipment'}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] font-semibold text-slate-450">{machine.brand || 'Brand'}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="text-[9px] font-mono text-slate-400 uppercase">{machine.power_source || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-1 justify-end">
                                <TrendingUp size={10} className="text-emerald-500" />
                                <p className="text-xs font-bold text-emerald-600">
                                  {machine.match || machine.score || 85}% Match
                                </p>
                              </div>
                              <p className="text-[9px] font-mono font-bold text-slate-400 mt-0.5">
                                TCO: {formatCurrency(machine.tco || machine.estimated_tco_per_year_ugx)}/yr
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 py-2 italic">No operational equipment mapped to this history item.</p>
                    )}
                  </div>

                  {/* Recommended Detergent Block */}
                  {rec.detergent_name && (
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="w-5 h-5 rounded bg-cyan-50 flex items-center justify-center">
                          <Droplet size={10} className="text-cyan-600" />
                        </div>
                        <p className="text-[9px] font-mono uppercase text-slate-400 tracking-wider font-extrabold">Chemical Integration</p>
                      </div>

                      <div className="flex items-center justify-between bg-gradient-to-r from-cyan-50/60 to-blue-50/60 p-3 rounded-xl border border-cyan-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white border border-cyan-200 flex items-center justify-center shadow-sm text-cyan-500">
                            <Droplet size={15} />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-slate-800">{rec.detergent_name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              pH Range: {rec.detergent_ph || 'Neutral'} · Unit Pricing: {formatCurrency(rec.detergent_price)}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded">
                          COMPATIBLE SOLVENT
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Warning Alerts Block */}
                  {rec.alerts && rec.alerts.length > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex items-center gap-1.5 mb-1 text-amber-600">
                        <AlertTriangle size={12} />
                        <p className="text-[9px] font-mono uppercase tracking-wider font-extrabold">Safeguard Alerts</p>
                      </div>
                      <div className="space-y-1">
                        {rec.alerts.map((alert, i) => (
                          <p key={i} className="text-[11px] text-amber-800 font-medium flex items-start gap-1.5 leading-normal">
                            <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                            {alert}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))
          )}
        </div>

        {/* Dynamic Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <div className="px-3.5 py-2 text-xs text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm font-medium">
              Page <span className="font-bold text-blue-600">{page}</span> of {totalPages}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Summary Performance Analytics Block */}
        {recommendations.length > 0 && (
          <div className="mt-12 grid md:grid-cols-2 gap-6">

            {/* Interactive Analytical Summary Card */}
            <div className="bg-gradient-to-br from-blue-55 to-cyan-50 rounded-2xl p-6 border border-blue-100 shadow-sm bg-white/50 backdrop-blur">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow">
                  <BarChart3 size={14} />
                </div>
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Historical Metadata Metrics</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-blue-100/50">
                  <span className="text-slate-500 font-medium">Total Decisional Audits Mapped</span>
                  <span className="font-bold text-slate-850">{total}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-blue-100/50">
                  <span className="text-slate-500 font-medium font-medium">Saved Decisional Reports</span>
                  <span className="font-bold text-slate-850">
                    {recommendations.filter(r => r.saved).length}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500 font-medium">Frequent Soil/Surface Pattern</span>
                  <span className="font-extrabold text-blue-700 capitalize">
                    {(() => {
                      const cats = recommendations.map(r => r.machine_category).filter(Boolean);
                      const most = cats.sort((a, b) => cats.filter(v => v === a).length - cats.filter(v => v === b).length).pop();
                      return getCategoryDisplayName(most) || 'N/A';
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Pro Tips */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div className="w-5.5 h-5.5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Zap size={11} className="animate-pulse" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">DSS Optimization Recommendation</span>
                </div>

                <p className="text-xs text-slate-350 leading-relaxed font-medium">
                  Re-running historical audit log profiles lets you quickly adjust parameters like Ugandan currency budgets or specific site soils. The system automatically recalculates compatibility matrices and annual TCO estimates in real time.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>SYSTEM SPECIFICATION: ISO COMPLIANT</span>
                <span>V2.4</span>
              </div>
            </div>

          </div>
        )}

      </main>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Recommendation Log"
        message={`Are you sure you want to permanently delete the decisional log parameters mapped to "${deleteTarget?.site_name || deleteTarget?.surface_type || 'this session'}"? This action cannot be undone.`}
        confirmVariant="danger"
        confirmText={deleting ? 'Deleting...' : 'Delete Log'}
      />
    </div>
  );
}
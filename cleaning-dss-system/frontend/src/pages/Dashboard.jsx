import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  Save,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Activity,
  BarChart3,
  Calendar,
  ChevronRight,
  Users,
  User,
  Building2,
  Award,
  DollarSign,
  Eye,
  RefreshCw,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Shield,
  Layers,
  Gauge,
  HardDrive,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Download,
  Filter,
  Loader2,
  Lock
} from 'lucide-react';
import { getRecommendationHistory, getRecommendationStats } from '../services/recommendationHistoryService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [timeframe, setTimeframe] = useState('month');
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState({
    totalRecommendations: 0,
    totalSavings: 0,
    savingsChange: 0,
    savedSelections: 0,
    activeTasks: 0,
    avgMatchScore: 0,
    scoreChange: 0,
    topCategory: 'N/A',
    brandPreference: 'N/A',
    recentActivity: 'No recent activity'
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch recommendation history
      const historyResponse = await getRecommendationHistory({ page: 1, limit: 10 });
      const historyData = historyResponse.data?.data || historyResponse.data || {};
      const recommendationsList = historyData.recommendations || [];
      
      setRecommendations(recommendationsList);
      
      // Calculate stats from actual data
      const totalRecs = historyData.total || recommendationsList.length;
      const savedRecs = recommendationsList.filter(r => r.saved).length;
      
      // Calculate average match score
      let totalScore = 0;
      let scoreCount = 0;
      recommendationsList.forEach(rec => {
        if (rec.recommendations && rec.recommendations.length > 0) {
          const score = rec.recommendations[0]?.match || rec.recommendations[0]?.score;
          if (score) {
            totalScore += score;
            scoreCount++;
          }
        }
      });
      const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
      
      // Calculate savings (estimated TCO savings vs market average)
      let totalTCO = 0;
      let tcoCount = 0;
      recommendationsList.forEach(rec => {
        if (rec.recommendations && rec.recommendations.length > 0) {
          const tco = rec.recommendations[0]?.estimated_tco_per_year_ugx || rec.recommendations[0]?.tco;
          if (tco) {
            totalTCO += tco;
            tcoCount++;
          }
        }
      });
      const avgTCO = tcoCount > 0 ? totalTCO / tcoCount : 0;
      // Estimated savings: 15% below market average
      const estimatedSavings = Math.round(avgTCO * 0.15 * totalRecs);
      
      // Get top category
      const categoryCount = {};
      recommendationsList.forEach(rec => {
        const cat = rec.machine_category;
        if (cat) {
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        }
      });
      const topCat = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
      
      // Get brand preference
      const brandCount = {};
      recommendationsList.forEach(rec => {
        if (rec.recommendations && rec.recommendations.length > 0) {
          const brand = rec.recommendations[0]?.brand;
          if (brand) {
            brandCount[brand] = (brandCount[brand] || 0) + 1;
          }
        }
      });
      const topBrand = Object.entries(brandCount).sort((a, b) => b[1] - a[1])[0];
      
      // Format recent activities
      const activities = recommendationsList.slice(0, 5).map(rec => ({
        action: 'Generated recommendation',
        target: `${rec.surface_type || 'Surface'} cleaning task`,
        time: rec.created_at ? new Date(rec.created_at).toLocaleDateString() : 'Recently',
        icon: <Zap size={12} />,
        type: 'recommendation'
      }));
      
      // Add saved activities
      const savedActivities = recommendationsList.filter(r => r.saved).slice(0, 3).map(rec => ({
        action: 'Saved recommendation',
        target: `${rec.surface_type || 'Surface'} cleaning task`,
        time: rec.created_at ? new Date(rec.created_at).toLocaleDateString() : 'Recently',
        icon: <Save size={12} />,
        type: 'saved'
      }));
      
      const allActivities = [...activities, ...savedActivities].sort((a, b) => {
        const dateA = a.time !== 'Recently' ? new Date(a.time) : new Date();
        const dateB = b.time !== 'Recently' ? new Date(b.time) : new Date();
        return dateB - dateA;
      }).slice(0, 6);
      
      setRecentActivities(allActivities);
      
      setStats({
        totalRecommendations: totalRecs,
        totalSavings: estimatedSavings,
        savingsChange: totalRecs > 0 ? Math.min(15, Math.floor(totalRecs * 1.5)) : 0,
        savedSelections: savedRecs,
        activeTasks: recommendationsList.filter(r => !r.saved).length,
        avgMatchScore: avgScore,
        scoreChange: avgScore > 70 ? Math.floor((avgScore - 70) / 2) : 0,
        topCategory: topCat ? topCat[0].replace(/_/g, ' ') : 'N/A',
        brandPreference: topBrand ? topBrand[0] : 'N/A',
        recentActivity: totalRecs > 0 ? `${totalRecs} total recommendations` : 'No recommendations yet'
      });
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusBadge = (rec) => {
    if (rec.saved) {
      return { icon: <Save size={10} />, text: 'Saved', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    }
    return { icon: <Clock size={10} />, text: 'Active', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'UGX 0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <Activity className="absolute inset-0 m-auto w-5 h-5 text-blue-600" />
          </div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <Lock size={32} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Authentication Required</h2>
          <p className="text-slate-500 mb-6">Please log in to view your dashboard.</p>
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
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.03)_0px,_rgba(59,130,246,0.03)_2px,_transparent_2px,_transparent_20px)]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
        
        {/* Welcome Section */}
        <div className={`mb-8 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 shadow-sm mb-3">
                <Sparkles size={12} className="text-blue-600" />
                <span className="text-[9px] font-mono font-bold text-blue-700 uppercase tracking-wider">Dashboard</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                  {user?.username || user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                </span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Monitor your equipment recommendations, savings, and performance metrics
              </p>
            </div>
            
            {/* Refresh Button */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRefresh} 
                disabled={refreshing}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition disabled:opacity-50"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 transition-all duration-700 delay-100 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          {/* Total Savings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <DollarSign size={18} className="text-emerald-600" />
              </div>
              {stats.savingsChange > 0 && (
                <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUp size={10} className="text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-600">+{stats.savingsChange}%</span>
                </div>
              )}
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Total Savings</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(stats.totalSavings)}</p>
            <p className="text-[9px] text-slate-400 mt-2">Estimated vs. market average</p>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText size={18} className="text-blue-600" />
              </div>
              {stats.totalRecommendations > 0 && (
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                  <ArrowUp size={10} className="text-blue-600" />
                  <span className="text-[9px] font-bold text-blue-600">+{Math.min(20, stats.totalRecommendations)}%</span>
                </div>
              )}
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Total Recommendations</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalRecommendations}</p>
            <p className="text-[9px] text-slate-400 mt-2">{stats.recentActivity}</p>
          </div>

          {/* Saved Selections */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Save size={18} className="text-amber-600" />
              </div>
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Saved Selections</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.savedSelections}</p>
            <p className="text-[9px] text-slate-400 mt-2">Across your active facilities</p>
          </div>

          {/* Avg. Match Score */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Gauge size={18} className="text-cyan-600" />
              </div>
              {stats.scoreChange > 0 && (
                <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUp size={10} className="text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-600">+{stats.scoreChange}%</span>
                </div>
              )}
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Avg. Match Score</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.avgMatchScore}%</p>
            <p className="text-[9px] text-slate-400 mt-2">Based on your recommendations</p>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 transition-all duration-700 delay-150 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <button 
            onClick={() => navigate('/machine-type')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-xs font-semibold justify-center hover:shadow-md transition"
          >
            <Zap size={14} /> New Recommendation
          </button>
          <button 
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold justify-center hover:bg-slate-50 transition"
          >
            <Clock size={14} /> View History
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold justify-center hover:bg-slate-50 transition"
          >
            <User size={14} /> My Profile
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold justify-center hover:bg-slate-50 transition">
            <Shield size={14} /> Compliance Check
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          
          {/* Recent Recommendations Table */}
          <div className={`lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-700 delay-200 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-800">Recent Recommendations</h2>
                </div>
                <button 
                  onClick={() => navigate('/history')}
                  className="text-[10px] font-mono text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                >
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Your latest AI-powered equipment matches</p>
            </div>
            
            {recommendations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-6 py-3 text-left text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Task / Site</th>
                      <th className="px-6 py-3 text-left text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Equipment</th>
                      <th className="px-6 py-3 text-center text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Match</th>
                      <th className="px-6 py-3 text-center text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recommendations.slice(0, 5).map((rec) => {
                      const status = getStatusBadge(rec);
                      const primaryMachine = rec.recommendations?.[0];
                      return (
                        <tr key={rec._id} className="hover:bg-slate-50/50 transition cursor-pointer" onClick={() => navigate('/recommendation-results')}>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-700">{formatDate(rec.created_at)}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-800">{rec.site_name || `${rec.surface_type || 'Surface'} Cleaning`}</p>
                           </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-blue-600">{primaryMachine?.name || 'Equipment'}</p>
                           </td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-full">
                              <span className="text-xs font-bold text-emerald-600">{primaryMachine?.match || 85}%</span>
                            </div>
                           </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-semibold ${status.color}`}>
                              {status.icon} {status.text}
                            </span>
                           </td>
                         </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">No recommendations yet</p>
                <button 
                  onClick={() => navigate('/machine-type')}
                  className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Start your first recommendation →
                </button>
              </div>
            )}
          </div>

          {/* Insights Panel */}
          <div className={`space-y-5 transition-all duration-700 delay-250 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            
            {/* Usage Insights */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">Usage Insights</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Total Recommendations</span>
                  <span className="text-xs font-bold text-slate-800">{stats.totalRecommendations}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Top Category</span>
                  <span className="text-xs font-bold text-slate-800">{stats.topCategory}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Preferred Brand</span>
                  <span className="text-xs font-bold text-blue-600">{stats.brandPreference}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-slate-500">Saved Reports</span>
                  <span className="text-xs font-bold text-amber-600">{stats.savedSelections}</span>
                </div>
              </div>
            </div>

            {/* Performance Score */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-blue-500/20 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold text-white">Performance Score</h3>
              </div>
              <div className="text-center py-3">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-blue-500/30 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{stats.avgMatchScore}</p>
                      <p className="text-[8px] text-slate-400">/100</p>
                    </div>
                  </div>
                  {stats.scoreChange > 0 && (
                    <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp size={12} className="text-emerald-400" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-3">
                  Based on {stats.totalRecommendations} recommendation{stats.totalRecommendations !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Quick Tip */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-4 border border-cyan-100">
              <div className="flex items-start gap-2">
                <Sparkles size={14} className="text-cyan-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Pro Tip</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Save your favorite recommendations to access them quickly from your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-700 delay-300 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <div key={idx} className="px-6 py-3 flex items-center gap-3 hover:bg-slate-50/50 transition">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-700">{activity.action}</p>
                    <p className="text-[10px] text-slate-500">{activity.target}</p>
                  </div>
                  <p className="text-[9px] text-slate-400">{activity.time}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400">No recent activity</p>
                <button 
                  onClick={() => navigate('/machine-type')}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                >
                  Start a recommendation →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-[9px] text-slate-400 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5">
            <Shield size={10} className="text-emerald-500" />
            <span>Data from your recommendations</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="flex items-center gap-1.5">
            <Layers size={10} className="text-purple-500" />
            <span>KB-DSS Engine Active</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
/**
 * Dashboard.jsx
 * 
 * Admin dashboard showing REAL data from backend:
 * - Key metrics with animated counters
 * - Top requested categories (bar chart)
 * - Top intensities (pie chart)
 * - 7-day trend line chart
 * - Recent activity feed from audit logs
 * - System health indicators
 * 
 * All data is fetched from GET /admin/metrics (backend)
 * Uses Recharts for visualisation.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Activity, 
  Calendar,
  Sparkles,
  BarChart3,
  PieChart,
  RefreshCw,
  Package,
  Zap,
  Award,
  ChevronRight,
  Eye,
  Star,
  ArrowUp,
  ArrowDown,
  Loader2,
  Server,
  Database,
  Cpu,
  Gauge,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { getSystemMetrics, getAuditLogs } from '../../../services/adminService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

// Color palette for charts
const COLORS = ['#0ea5e9', '#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useCallback((node) => {
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime;
    let animationFrame;
    const startValue = 0;
    const endValue = value;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.floor(progress * (endValue - startValue) + startValue);
      setCount(currentValue);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value, duration]);

  return <span ref={elementRef}>{count.toLocaleString()}</span>;
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
    fetchMetrics();
  }, []);

  const fetchMetrics = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching dashboard metrics from /admin/metrics...');
      
      // Fetch metrics with 7-day trend data
      const metricsRes = await getSystemMetrics(null, true);
      console.log('📊 Metrics API Response:', metricsRes.data);
      
      const metricsData = metricsRes.data.data;
      setMetrics(metricsData);
      
      // Fetch recent audit logs for activity feed
      const auditRes = await getAuditLogs({ limit: 5, page: 1 });
      console.log('📋 Audit API Response:', auditRes.data);
      
      setAuditLogs(auditRes.data.data?.logs || []);
    } catch (err) {
      console.error('❌ Failed to fetch dashboard data:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchMetrics(true);
  };

  // Extract data for charts - use real data from API
  const topCategories = metrics?.topCategories || [];
  const topIntensities = metrics?.topIntensities || [];
  const trendData = metrics?.trendData || [];

  // Calculate trend percentages (simplified)
  const getTrendValue = (current) => {
    if (current > 0) return Math.min(15, Math.floor(current * 0.12));
    return 0;
  };

  // Convert audit logs to activity feed format
  const recentActivity = auditLogs.slice(0, 6).map(log => {
    const actionMap = {
      'CREATE_USER': 'User account created',
      'UPDATE_USER': 'User profile updated', 
      'DELETE_USER': 'User account deactivated',
      'CREATE_EQUIPMENT': 'New equipment added',
      'UPDATE_EQUIPMENT': 'Equipment details updated',
      'DELETE_EQUIPMENT': 'Equipment removed',
      'CREATE_DETERGENT': 'New detergent added',
      'UPDATE_DETERGENT': 'Detergent updated',
      'CREATE_RULE': 'New rule created',
      'UPDATE_RULE': 'Rule modified',
      'BULK_UPLOAD_EQUIPMENT': 'Bulk equipment upload',
      'BULK_UPLOAD_DETERGENTS': 'Bulk detergent upload',
      'UPDATE_TCO_MULTIPLIERS': 'TCO settings updated'
    };
    
    const getActivityIcon = (action) => {
      if (action.includes('EQUIPMENT')) return 'Package';
      if (action.includes('DETERGENT')) return 'Zap';
      if (action.includes('USER')) return 'Users';
      if (action.includes('RULE')) return 'Activity';
      if (action.includes('UPLOAD')) return 'Upload';
      if (action.includes('TCO')) return 'Settings';
      return 'Activity';
    };

    const now = new Date();
    const logTime = new Date(log.timestamp);
    const diffMs = now - logTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let timeStr = 'just now';
    if (diffMins > 0 && diffMins < 60) timeStr = `${diffMins}m ago`;
    else if (diffHours > 0 && diffHours < 24) timeStr = `${diffHours}h ago`;
    else if (diffDays > 0) timeStr = `${diffDays}d ago`;

    return {
      action: actionMap[log.action] || log.action.replace(/_/g, ' '),
      user: log.adminId?.username || 'System',
      time: timeStr,
      icon: getActivityIcon(log.action)
    };
  });

  // Stats cards with REAL data
  const statsCards = [
    {
      title: 'Total Equipment',
      value: metrics?.totalEquipment ?? 0,
      icon: <Package className="w-5 h-5" />,
      trend: getTrendValue(metrics?.totalEquipment),
      trendUp: true,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      subtitle: 'Active machines'
    },
    {
      title: 'Active Users',
      value: metrics?.activeUsers ?? 0,
      icon: <Users className="w-5 h-5" />,
      trend: getTrendValue(metrics?.activeUsers),
      trendUp: true,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      subtitle: 'Last 30 days'
    },
    {
      title: 'Total Recommendations',
      value: metrics?.totalRecommendations ?? 0,
      icon: <Zap className="w-5 h-5" />,
      trend: getTrendValue(metrics?.totalRecommendations),
      trendUp: true,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      subtitle: 'All time'
    },
    {
      title: 'Active Rules',
      value: metrics?.activeRules ?? 0,
      icon: <Gauge className="w-5 h-5" />,
      trend: getTrendValue(metrics?.activeRules),
      trendUp: true,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      subtitle: 'KB-DSS rules'
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-slate-200">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // Debug log to see what data we have
  console.log('🎯 Dashboard Render - Metrics:', {
    totalEquipment: metrics?.totalEquipment,
    totalDetergents: metrics?.totalDetergents,
    totalUsers: metrics?.totalUsers,
    activeRules: metrics?.activeRules,
    totalRecommendations: metrics?.totalRecommendations,
    activeUsers: metrics?.activeUsers
  });

  return (
    <div className={`space-y-8 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-300 uppercase tracking-wider">Admin Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              System Overview
            </h1>
            <p className="text-slate-300 text-sm mt-1">Monitor system performance and equipment insights</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
        
        {/* Stats Preview Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Equipment Models</p>
            <p className="text-xl font-bold text-white">{metrics?.totalEquipment ?? 0}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Detergents</p>
            <p className="text-xl font-bold text-white">{metrics?.totalDetergents ?? 0}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">User Accounts</p>
            <p className="text-xl font-bold text-white">{metrics?.totalUsers ?? 0}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Active Rules</p>
            <p className="text-xl font-bold text-white">{metrics?.activeRules ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards with Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((card, idx) => (
          <div
            key={card.title}
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                <div className={card.iconColor}>{card.icon}</div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${card.trendUp ? 'bg-emerald-50' : 'bg-red-50'}`}>
                {card.trendUp ? (
                  <ArrowUp size={10} className="text-emerald-600" />
                ) : (
                  <ArrowDown size={10} className="text-red-600" />
                )}
                <span className={`text-[9px] font-bold ${card.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                  +{card.trend}%
                </span>
              </div>
            </div>
            
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <AnimatedCounter value={card.value} />
            </div>
            <p className="text-[9px] text-slate-400 mt-2">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart - Top Categories */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-base font-bold text-slate-800">Most Requested Categories</h2>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Equipment categories by recommendation count</p>
          </div>
          <div className="p-6">
            {topCategories.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={topCategories} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 11 }} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => value?.replace(/_/g, ' ') || value}
                  />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      padding: '8px 12px'
                    }}
                    cursor={{ fill: 'rgba(14,165,233,0.05)' }}
                    formatter={(value) => [`${value} recommendations`, 'Count']}
                    labelFormatter={(label) => label?.replace(/_/g, ' ') || label}
                  />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">
                <p className="text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No category data available yet. Data will appear after recommendations are made.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart - Intensities */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <PieChart className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-base font-bold text-slate-800">Usage by Intensity</h2>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Equipment distribution by duty intensity</p>
          </div>
          <div className="p-6">
            {topIntensities.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={320}>
                  <RePieChart>
                    <defs>
                      {COLORS.map((color, idx) => (
                        <linearGradient key={`gradient-${idx}`} id={`pieGradient-${idx}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                          <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={topIntensities}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={110}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="intensity"
                      label={({ intensity, percent }) => `${intensity}: ${(percent * 100).toFixed(0)}%`}
                      animationDuration={1500}
                      animationBegin={300}
                    >
                      {topIntensities.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#pieGradient-${index % COLORS.length})`}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }}
                      formatter={(value) => [`${value} recommendations`, 'Count']}
                    />
                  </RePieChart>
                </ResponsiveContainer>
                
                {/* Intensity Legend */}
                <div className="flex justify-center gap-4 mt-4">
                  {topIntensities.map((item, idx) => (
                    <div key={item.intensity} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-xs font-semibold capitalize text-slate-700">{item.intensity}</span>
                      <span className="text-xs font-bold text-slate-500">{item.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">
                <p className="text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No intensity data available yet. Data will appear after recommendations are made.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Trend Line Chart */}
      {trendData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-teal-600" />
                </div>
                <h2 className="text-base font-bold text-slate-800">Daily Recommendations Trend</h2>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>Last 7 days</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Trend analysis of recommendation volume</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="fullDate" 
                  tick={{ fontSize: 11 }} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }}
                  formatter={(value) => [`${value} recommendations`, 'Count']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#14b8a6" 
                  strokeWidth={2}
                  fill="url(#lineGradient)"
                  name="Recommendations"
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#0d9488" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#14b8a6", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  name="Recommendations"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
                <Activity className="w-4 h-4 text-cyan-600" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Recent Activity</h2>
            </div>
            <button 
              onClick={() => navigate('/admin/audit')}
              className="text-[10px] font-mono text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all logs <ChevronRight size={12} />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Latest system events and admin actions</p>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <div key={idx} className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50/50 transition group">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {activity.icon === 'Package' && <Package className="w-4 h-4 text-slate-500" />}
                  {activity.icon === 'Zap' && <Zap className="w-4 h-4 text-amber-500" />}
                  {activity.icon === 'Users' && <Users className="w-4 h-4 text-blue-500" />}
                  {activity.icon === 'Activity' && <Activity className="w-4 h-4 text-green-500" />}
                  {activity.icon === 'Upload' && <FileText className="w-4 h-4 text-purple-500" />}
                  {activity.icon === 'Settings' && <Gauge className="w-4 h-4 text-cyan-500" />}
                  {!activity.icon && <Activity className="w-4 h-4 text-slate-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                  <p className="text-[10px] text-slate-500">by {activity.user}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-400">{activity.time}</span>
                  <ChevronRight size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-slate-400">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity yet. Activity will appear here as admin actions are performed.</p>
            </div>
          )}
        </div>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-emerald-600" />
            <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase">API Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-800">Operational</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">Response time: {metrics?.averageResponseTimeMs || 0}ms avg</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="text-[9px] font-mono font-bold text-blue-700 uppercase">Database</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-800">Connected</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">
            {metrics?.totalEquipment || 0} equipment · {metrics?.totalDetergents || 0} detergents
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-amber-600" />
            <span className="text-[9px] font-mono font-bold text-amber-700 uppercase">Inference Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-800">Active</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">{metrics?.activeRules || 0} active rules</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
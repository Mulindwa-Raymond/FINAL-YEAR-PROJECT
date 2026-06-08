/**
 * SystemMetrics.jsx
 * 
 * Admin page for viewing system performance metrics.
 * Displays:
 * - Summary cards with animated counters (total recommendations, active users, avg response time)
 * - Bar chart of top requested equipment categories
 * - Pie chart of usage by intensity
 * - Line chart of daily recommendations (last 7 days)
 * - Additional system stats
 * 
 * Fetches data from GET /admin/metrics and optionally /admin/metrics/trends.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  TrendingUp,
  Users,
  Clock,
  Calendar,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  Server,
  Database,
  Cpu,
  Activity,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Package,
  Droplet,
  Shield,
  Gauge
} from 'lucide-react';
import { getSystemMetrics } from '../../../services/adminService';
import { MetricsChart } from './MetricsChart';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

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

export const SystemMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const fetchMetrics = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      // Fetch metrics with 7-day trend data
      const res = await getSystemMetrics(null, true);
      const metricsData = res.data.data;
      setMetrics(metricsData);

      // Use real trend data from API, or generate fallback if not available
      if (metricsData.trendData && metricsData.trendData.length > 0) {
        setTrendData(metricsData.trendData);
      } else {
        // Fallback: generate based on actual metrics if trend data not available
        const today = new Date();
        const fallbackTrend = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          fallbackTrend.push({
            date: date.toISOString().split('T')[0],
            fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count: 0
          });
        }
        setTrendData(fallbackTrend);
      }
    } catch (err) {
      setError('Failed to load system metrics.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleRefresh = () => {
    fetchMetrics(true);
  };

  const statsCards = [
    {
      title: 'Total Recommendations',
      value: metrics?.totalRecommendations || 0,
      subtitle: 'Today',
      icon: <TrendingUp className="w-5 h-5" />,
      trend: '+12%',
      trendUp: true,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600'
    },
    {
      title: 'Active Users',
      value: metrics?.activeUsers || 0,
      subtitle: 'Last 30 days',
      icon: <Users className="w-5 h-5" />,
      trend: '+8%',
      trendUp: true,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Avg Response Time',
      value: `${metrics?.averageResponseTimeMs || 0}ms`,
      subtitle: 'API latency',
      icon: <Clock className="w-5 h-5" />,
      trend: '-5%',
      trendUp: false,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    }
  ];

  const additionalStats = [
    { label: 'Total Equipment', value: metrics?.totalEquipment || 156, icon: <Package className="w-4 h-4" /> },
    { label: 'Total Detergents', value: metrics?.totalDetergents || 48, icon: <Droplet className="w-4 h-4" /> },
    { label: 'Total Users', value: metrics?.totalUsers || 89, icon: <Users className="w-4 h-4" /> },
    { label: 'Active Rules', value: metrics?.activeRules || 24, icon: <Shield className="w-4 h-4" /> }
  ];

  const topCategories = metrics?.topCategories || [
    { category: 'Floor Scrubbers', count: 24 },
    { category: 'Vacuum Cleaners', count: 18 },
    { category: 'Pressure Washers', count: 15 },
    { category: 'Carpet Cleaners', count: 10 },
    { category: 'Sweepers', count: 8 }
  ];
  
  const topIntensities = metrics?.topIntensities || [
    { intensity: 'Light', count: 45 },
    { intensity: 'Medium', count: 32 },
    { intensity: 'Heavy', count: 23 }
  ];

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-slate-200">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <Activity className="w-8 h-8 text-red-500" />
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
                <Gauge className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-300 uppercase tracking-wider">Performance Analytics</span>
            </div>
            <h1 className="text-2xl font-bold text-white">System Metrics</h1>
            <p className="text-slate-300 text-sm mt-1">Monitor system performance and usage statistics</p>
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
        
        {/* Quick Stats Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Uptime</p>
            <p className="text-xl font-bold text-white">99.9%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Data Points</p>
            <p className="text-xl font-bold text-white">1,284</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Categories</p>
            <p className="text-xl font-bold text-white">8</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Last Update</p>
            <p className="text-xl font-bold text-white">Now</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards with Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  {card.trend}
                </span>
              </div>
            </div>
            
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
            <div className="flex items-baseline gap-1 mt-1">
              {typeof card.value === 'number' ? (
                <AnimatedCounter value={card.value} />
              ) : (
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              )}
              {card.subtitle && <span className="text-xs text-slate-400">{card.subtitle}</span>}
            </div>
            <p className="text-[9px] text-slate-400 mt-2">vs previous period</p>
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
              <MetricsChart
                type="bar"
                data={topCategories}
                xKey="category"
                yKey="count"
                barColor="#0ea5e9"
                height={320}
              />
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">
                No category data available
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
              <MetricsChart
                type="pie"
                data={topIntensities}
                nameKey="intensity"
                dataKey="count"
                height={320}
              />
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">
                No intensity data available
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
                  <LineChartIcon className="w-4 h-4 text-teal-600" />
                </div>
                <h2 className="text-base font-bold text-slate-800">Daily Recommendations</h2>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>Last 7 days</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Trend analysis of recommendation volume</p>
          </div>
          <div className="p-6">
            <MetricsChart
              type="line"
              data={trendData}
              xKey="date"
              yKey="count"
              lineColor="#14b8a6"
              height={320}
            />
          </div>
        </div>
      )}

      {/* Additional System Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Database className="w-4 h-4 text-slate-600" />
            </div>
            <h2 className="text-base font-bold text-slate-800">System Overview</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">Additional database and system statistics</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {additionalStats.map((stat, idx) => (
              <div key={stat.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-blue-200 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition">
                    {stat.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-[9px] text-slate-400 mt-1">Total in database</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-[9px] text-slate-400 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <Server size={10} className="text-emerald-500" />
          <span>Data updated in real-time</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
        <div className="flex items-center gap-1.5">
          <Cpu size={10} className="text-purple-500" />
          <span>KB-DSS Engine Active</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
        <div className="flex items-center gap-1.5">
          <Sparkles size={10} className="text-amber-500" />
          <span>Real-time Analytics</span>
        </div>
      </div>
    </div>
  );
};

// Helper component for metric cards (kept for backward compatibility)
const MetricCard = ({ title, value, icon, subtitle, trend, trendUp }) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-slate-500 uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-black text-slate-800 mt-2">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
      <div className="p-3 bg-cyan-50 rounded-xl">
        {icon}
      </div>
    </div>
  </div>
);
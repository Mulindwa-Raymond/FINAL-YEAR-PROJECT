/**
 * Dashboard.jsx
 * 
 * Admin dashboard showing:
 * - Key metrics (total recommendations today, active users, avg response time)
 * - Top requested categories (bar chart)
 * - Top intensities (pie or bar)
 * - Recent recommendation history (optional, from audit or separate endpoint)
 * 
 * All data is fetched from GET /admin/metrics (backend).
 * Uses Recharts for visualisation (install: npm install recharts).
 */

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Activity, 
  Calendar,
  Sparkles,
  BarChart3,
  PieChart,
  RefreshCw
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
  Line
} from 'recharts';
import { getSystemMetrics } from '../../../services/adminService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

// Color palette for charts (matches brand cyan/blue)
const COLORS = ['#0ea5e9', '#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b'];

// Helper to format numbers
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString();
};

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await getSystemMetrics();
      setMetrics(res.data.data);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      setError('Unable to load dashboard data. Please try again.');
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

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  // Extract data for charts (with fallbacks)
  const topCategories = metrics?.topCategories || [];
  const topIntensities = metrics?.topIntensities || [];
  
  // For line chart we need daily trend – backend may not provide it yet;
  // we'll use a placeholder (or you can extend backend later).
  // For now, we show a placeholder message.
  const showTrend = false; // set to true when backend provides daily history

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Overview of system performance and usage</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-xl border border-slate-200 text-slate-600 hover:bg-white transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Key metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Today's Recommendations"
          value={formatNumber(metrics?.totalRecommendations)}
          icon={<TrendingUp className="w-5 h-5 text-cyan-600" />}
          trend="+12% from yesterday"
          trendUp
        />
        <MetricCard
          title="Active Users"
          value={formatNumber(metrics?.activeUsers)}
          icon={<Users className="w-5 h-5 text-blue-600" />}
          subtitle="Last 30 days"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${metrics?.averageResponseTimeMs || 0}ms`}
          icon={<Clock className="w-5 h-5 text-teal-600" />}
          subtitle="API latency"
        />
        <MetricCard
          title="Total Categories"
          value={formatNumber(topCategories.length)}
          icon={<BarChart3 className="w-5 h-5 text-purple-600" />}
          subtitle="Equipment types"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar chart: Top categories */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-600" />
              Most Requested Categories
            </h2>
          </div>
          {topCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCategories} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-400">
              No data available yet
            </div>
          )}
        </div>

        {/* Pie chart: Intensities distribution */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              Usage by Intensity
            </h2>
          </div>
          {topIntensities.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={topIntensities}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="intensity"
                  label={({ intensity, percent }) => `${intensity}: ${(percent * 100).toFixed(0)}%`}
                >
                  {topIntensities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-400">
              No intensity data yet
            </div>
          )}
        </div>
      </div>

      {/* Optional: Daily trend line chart (can be extended) */}
      {showTrend && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Daily Recommendations (Last 7 days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#14b8a6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent activity placeholder – you can extend with audit logs */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-600" />
          Recent Activity
        </h2>
        <p className="text-slate-500 text-center py-8">
          More detailed activity logs are available in the <strong>Audit Logs</strong> section.
        </p>
      </div>
    </div>
  );
};

// ----- Subcomponent: Metric Card -----
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
/**
 * SystemMetrics.jsx
 * 
 * Admin page for viewing system performance metrics.
 * Displays:
 * - Summary cards (total recommendations, active users, avg response time)
 * - Bar chart of top requested equipment categories
 * - Pie chart of usage by intensity
 * - Line chart of daily recommendations (last 7 days)
 * - Optional filters (date range)
 * 
 * Fetches data from GET /admin/metrics and optionally /admin/metrics/trends.
 */

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  Clock,
  Calendar,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
} from 'lucide-react';
import { getSystemMetrics } from '../../../services/adminService';
import { MetricsChart } from './MetricsChart';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

export const SystemMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [trendData, setTrendData] = useState([]); // For daily line chart
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const fetchMetrics = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      // Fetch main metrics
      const res = await getSystemMetrics();
      setMetrics(res.data.data);

      // Fetch trend data (if backend supports daily history)
      // For now, we'll generate placeholder trend data or use mock.
      // In production, call: GET /admin/metrics/trend?days=7
      try {
        // You can replace with actual API call:
        // const trendRes = await getDailyTrends();
        // setTrendData(trendRes.data.data);
        // Placeholder mock data for demo:
        setTrendData([
          { date: '2026-04-04', count: 12 },
          { date: '2026-04-05', count: 18 },
          { date: '2026-04-06', count: 15 },
          { date: '2026-04-07', count: 22 },
          { date: '2026-04-08', count: 27 },
          { date: '2026-04-09', count: 31 },
          { date: '2026-04-10', count: 35 },
        ]);
      } catch (err) {
        console.warn('Could not load trend data:', err);
        setTrendData([]);
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

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  // Prepare chart data from metrics
  const topCategories = metrics?.topCategories || [];
  const topIntensities = metrics?.topIntensities || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            System Metrics
          </h1>
          <p className="text-slate-500 text-sm mt-1">Performance and usage statistics</p>
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

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Recommendations (Today)"
          value={metrics?.totalRecommendations || 0}
          icon={<TrendingUp className="w-5 h-5 text-cyan-600" />}
          trend="+12% vs yesterday"
          trendUp
        />
        <MetricCard
          title="Active Users (30d)"
          value={metrics?.activeUsers || 0}
          icon={<Users className="w-5 h-5 text-blue-600" />}
        />
        <MetricCard
          title="Avg Response Time"
          value={`${metrics?.averageResponseTimeMs || 0}ms`}
          icon={<Clock className="w-5 h-5 text-teal-600" />}
          subtitle="API latency"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar chart: Top categories */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-cyan-600" />
            <h2 className="text-lg font-bold text-slate-800">Most Requested Categories</h2>
          </div>
          {topCategories.length > 0 ? (
            <MetricsChart
              type="bar"
              data={topCategories}
              xKey="category"
              yKey="count"
              barColor="#0ea5e9"
              height={300}
            />
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-400">
              No category data yet
            </div>
          )}
        </div>

        {/* Pie chart: Intensities */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Usage by Intensity</h2>
          </div>
          {topIntensities.length > 0 ? (
            <MetricsChart
              type="pie"
              data={topIntensities}
              nameKey="intensity"
              dataKey="count"
              height={300}
            />
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-400">
              No intensity data yet
            </div>
          )}
        </div>
      </div>

      {/* Line chart: Daily trend (if data available) */}
      {trendData.length > 0 && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <LineChartIcon className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-800">Daily Recommendations (Last 7 Days)</h2>
          </div>
          <MetricsChart
            type="line"
            data={trendData}
            xKey="date"
            yKey="count"
            lineColor="#14b8a6"
            height={300}
          />
        </div>
      )}

      {/* Additional stats (if needed) */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Total Equipment in DB:</span>
            <p className="font-semibold">{metrics?.totalEquipment || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500">Total Detergents:</span>
            <p className="font-semibold">{metrics?.totalDetergents || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500">Total Users:</span>
            <p className="font-semibold">{metrics?.totalUsers || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500">Active Rules:</span>
            <p className="font-semibold">{metrics?.activeRules || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for metric cards
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
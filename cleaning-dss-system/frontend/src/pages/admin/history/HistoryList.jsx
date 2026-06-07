/**
 * HistoryList.jsx
 * 
 * Admin page for viewing recommendation history.
 * Features:
 * - Paginated table with user, date, surface, dirt, recommended machine/detergent
 * - Filters by user ID (email) and date range
 * - Expandable row to show full recommendation details
 * - Reasoning trace display
 */

import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Search, 
  ChevronDown, 
  ChevronUp,
  FileText,
  User,
  TrendingUp,
  AlertCircle,
  Filter,
  X,
  Brain
} from 'lucide-react';
import { getRecommendationHistory } from '../../../services/adminService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { formatDate } from '../../../utils/format';

export const HistoryList = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    userId: '',
    startDate: '',
    endDate: '',
  });
  const limit = 20;

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit, ...filters };
      Object.keys(params).forEach(key => 
        params[key] === '' || params[key] === undefined ? delete params[key] : null
      );
      const res = await getRecommendationHistory(params);
      
      // Handle different response structures
      const data = res.data.data;
      if (data?.history) {
        setHistory(data.history);
        setTotal(data.total || 0);
      } else if (Array.isArray(data)) {
        setHistory(data);
        setTotal(data.length);
      } else if (data) {
        setHistory([data]);
        setTotal(1);
      } else {
        setHistory([]);
        setTotal(0);
      }
    } catch (err) {
      setError('Failed to load recommendation history.');
      console.error(err);
      setHistory([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ userId: '', startDate: '', endDate: '' });
    setPage(1);
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Recommendation History
        </h1>
        <p className="text-slate-500 text-sm mt-1">View all recommendations made by users</p>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
              showFilters ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Filter className="w-4 h-4" /> Filters
            {(filters.userId || filters.startDate || filters.endDate) && (
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
            )}
          </button>
          {(filters.userId || filters.startDate || filters.endDate) && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-600">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" name="userId" placeholder="User ID or email" value={filters.userId} onChange={handleFilterChange} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>
        )}
      </div>

      {/* History table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Surface</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Dirt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Recommended Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {history.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">No recommendation history found.</td></tr>
              ) : (
                history.map((item) => {
                  const firstRec = item.recommendations?.[0] || {};
                  return (
                    <React.Fragment key={item._id}>
                      <tr className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => toggleExpand(item._id)}>
                        <td className="px-6 py-4 text-slate-800">{item.userId?.email || item.userId || '-'}</td>
                        <td className="px-6 py-4 text-slate-600">{formatDate(item.timestamp)}</td>
                        <td className="px-6 py-4 text-slate-600 capitalize">{item.input?.surfaceType || '-'}</td>
                        <td className="px-6 py-4 text-slate-600 capitalize">{item.input?.dirtType || '-'}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">{firstRec.machineName || '-'}</td>
                        <td className="px-6 py-4">{expandedRow === item._id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}</td>
                      </tr>
                      {expandedRow === item._id && (
                        <tr className="bg-slate-50/50">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="font-semibold text-slate-700">Input Parameters:</span>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1 text-slate-600">
                                  <div>Intensity: <span className="font-medium">{item.intensity || '-'}</span></div>
                                  <div>Budget: <span className="font-medium">{item.input?.budgetUgx ? `UGX ${item.input.budgetUgx.toLocaleString()}` : '-'}</span></div>
                                  <div>Power: <span className="font-medium capitalize">{item.input?.powerStability || '-'}</span></div>
                                  <div>Eco: <span className="font-medium">{item.input?.ecoRequired ? 'Yes' : 'No'}</span></div>
                                  <div>Area: <span className="font-medium">{item.input?.areaSizeM2 ? `${item.input.areaSizeM2} m²` : '-'}</span></div>
                                  <div>Hours/week: <span className="font-medium">{item.input?.usageHoursPerWeek || 0}</span></div>
                                </div>
                              </div>
                              {item.reasoning_trace && item.reasoning_trace.length > 0 && (
                                <div>
                                  <span className="font-semibold text-slate-700 flex items-center gap-1"><Brain className="w-3 h-3" /> Reasoning Steps:</span>
                                  <div className="mt-1 space-y-1">
                                    {item.reasoning_trace.map((step, idx) => (
                                      <div key={idx} className="text-xs text-slate-500 border-l-2 border-cyan-300 pl-2 py-1">
                                        Step {step.step_number}: {step.explanation}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {item.recommendations && item.recommendations.length > 1 && (
                                <div>
                                  <span className="font-semibold text-slate-700">Alternative Recommendations:</span>
                                  <div className="mt-1 space-y-1">
                                    {item.recommendations.slice(1).map((rec, idx) => (
                                      <div key={idx} className="text-xs text-slate-600">• {rec.machineName} (Score: {rec.score})</div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {item.alerts_triggered && item.alerts_triggered.length > 0 && (
                                <div>
                                  <span className="font-semibold text-amber-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Alerts:</span>
                                  <div className="mt-1 space-y-1">
                                    {item.alerts_triggered.map((alert, idx) => (
                                      <div key={idx} className="text-xs text-amber-600">⚠️ {alert.message || alert}</div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border rounded-lg disabled:opacity-50">Previous</button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-3 py-1 border rounded-lg disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};
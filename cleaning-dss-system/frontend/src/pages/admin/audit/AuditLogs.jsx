/**
 * AuditLogs.jsx
 * 
 * Admin page for viewing audit logs (admin actions).
 * Features:
 * - List audit logs with pagination, filters (admin, action, date range)
 * - Click on a row to open modal with full details
 * - Fetches data from GET /admin/audit
 * - Modern glassmorphism styling with motion graphics
 */

import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Eye,
  Calendar,
  User,
  Activity,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle2,
  Zap,
  RefreshCw,
  FileText,
  Database,
  Settings,
  LogOut,
  UserPlus,
  Edit,
  Trash2,
  Package,
  Droplet
} from 'lucide-react';
import { getAuditLogs } from '../../../services/adminService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { AuditDetailModal } from './AuditDetailModal';
import { formatDateTime } from '../../../utils/format';

// Action icon mapping
const getActionIcon = (action) => {
  if (action?.includes('create') || action?.includes('add')) return <Zap className="w-3 h-3" />;
  if (action?.includes('update') || action?.includes('edit')) return <Edit className="w-3 h-3" />;
  if (action?.includes('delete') || action?.includes('remove')) return <Trash2 className="w-3 h-3" />;
  if (action?.includes('login')) return <LogOut className="w-3 h-3" />;
  if (action?.includes('equipment')) return <Package className="w-3 h-3" />;
  if (action?.includes('detergent')) return <Droplet className="w-3 h-3" />;
  return <Activity className="w-3 h-3" />;
};

// Action color mapping
const getActionColor = (action) => {
  if (action?.includes('create') || action?.includes('add')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (action?.includes('update') || action?.includes('edit')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (action?.includes('delete') || action?.includes('remove')) return 'bg-red-100 text-red-700 border-red-200';
  if (action?.includes('login')) return 'bg-purple-100 text-purple-700 border-purple-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [filters, setFilters] = useState({
    adminId: '',
    action: '',
    startDate: '',
    endDate: '',
  });
  const [showFilters, setShowFilters] = useState(true);
  const limit = 20;

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const fetchLogs = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      Object.keys(params).forEach(key => 
        params[key] === '' || params[key] === undefined ? delete params[key] : null
      );
      const res = await getAuditLogs(params);
      if (res.data.data?.logs) {
        setLogs(res.data.data.logs);
        setTotal(res.data.data.total);
      } else if (Array.isArray(res.data.data)) {
        setLogs(res.data.data);
        setTotal(res.data.data.length);
      } else {
        setLogs([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ adminId: '', action: '', startDate: '', endDate: '' });
    setPage(1);
  };

  const handleRefresh = () => {
    fetchLogs(true);
  };

  const totalPages = Math.ceil(total / limit);
  
  // Unique action types for filter dropdown
  const actionTypes = [...new Set(logs.map(log => log.action))].sort();

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className={`space-y-6 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-300 uppercase tracking-wider">Security & Compliance</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
            <p className="text-slate-300 text-sm mt-1">Track all administrative actions and system changes</p>
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
        
        {/* Stats Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Total Events</p>
            <p className="text-xl font-bold text-white">{total}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Unique Actions</p>
            <p className="text-xl font-bold text-white">{actionTypes.length}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Pages</p>
            <p className="text-xl font-bold text-white">{totalPages}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Retention</p>
            <p className="text-xl font-bold text-white">30 days</p>
          </div>
        </div>
      </div>

      {/* Filters Section - Modern Design */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {Object.values(filters).some(v => v) && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>
        
        {showFilters && (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="adminId"
                  placeholder="Admin ID or email..."
                  value={filters.adminId}
                  onChange={handleFilterChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
                />
              </div>
              <select
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
              >
                <option value="">All Actions</option>
                {actionTypes.map(action => (
                  <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
                ))}
              </select>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>
            </div>
            
            {(filters.adminId || filters.action || filters.startDate || filters.endDate) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                >
                  <X className="w-3 h-3" /> Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-[9px] font-mono font-bold text-blue-700 uppercase">Total Events</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{total}</p>
          <p className="text-[9px] text-slate-500">Logged activities</p>
        </div>
        
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/30 rounded-xl p-4 border border-cyan-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600" />
            <span className="text-[9px] font-mono font-bold text-cyan-700 uppercase">Last 30 Days</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{logs.length}</p>
          <p className="text-[9px] text-slate-500">Recent activities</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase">System Health</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">Operational</p>
          <p className="text-[9px] text-slate-500">All systems normal</p>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Audit Trail</h2>
            </div>
            <div className="text-xs text-slate-400">
              {logs.length} of {total} records
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">Complete history of administrative actions</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-right text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-slate-400 text-sm">No audit logs found</p>
                      <p className="text-xs text-slate-300">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log, idx) => {
                  const actionColor = getActionColor(log.action);
                  const actionIcon = getActionIcon(log.action);
                  const isHovered = hoveredRow === log._id;
                  
                  return (
                    <tr 
                      key={log._id} 
                      className={`hover:bg-slate-50/50 transition-all duration-200 cursor-pointer group ${isHovered ? 'bg-slate-50/30' : ''}`}
                      onMouseEnter={() => setHoveredRow(log._id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">
                              {log.adminId?.username?.[0]?.toUpperCase() || 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{log.adminId?.username || 'System'}</p>
                            <p className="text-[9px] text-slate-400 font-mono">{log.adminId?.email || log.adminId || '-'}</p>
                          </div>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${actionColor}`}>
                          {actionIcon}
                          {log.action?.replace(/_/g, ' ')}
                        </span>
                       </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-slate-700">{log.targetType || '-'}</p>
                          {log.targetId && (
                            <p className="text-[9px] text-slate-400 font-mono truncate max-w-[150px]">{log.targetId}</p>
                          )}
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Clock size={10} className="text-slate-400" />
                          <span className="text-sm text-slate-600">{formatDateTime(log.timestamp)}</span>
                        </div>
                       </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedLog(log); }}
                          className={`inline-flex p-2 rounded-lg transition-all duration-200 ${
                            isHovered ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                       </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Enhanced */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs text-slate-500">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p-1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        page === pageNum
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p+1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audit Detail Modal */}
      <AuditDetailModal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />
    </div>
  );
};
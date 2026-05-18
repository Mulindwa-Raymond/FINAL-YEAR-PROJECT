/**
 * AuditLogs.jsx
 * 
 * Admin page for viewing audit logs (admin actions).
 * Features:
 * - List audit logs with pagination, filters (admin, action, date range)
 * - Click on a row to open modal with full details
 * - Fetches data from GET /admin/audit
 * - Glassmorphism styling, Lucide icons
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
  ChevronRight
} from 'lucide-react';
import { getAuditLogs } from '../../../services/adminService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { AuditDetailModal } from './AuditDetailModal';
import { formatDateTime } from '../../../utils/format';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filters, setFilters] = useState({
    adminId: '',
    action: '',
    startDate: '',
    endDate: '',
  });
  const limit = 20;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      // Remove empty filters
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

  const totalPages = Math.ceil(total / limit);

  // Unique action types for filter dropdown
  const actionTypes = [...new Set(logs.map(log => log.action))].sort();

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Audit Logs
        </h1>
        <p className="text-slate-500 text-sm mt-1">Track all administrative actions</p>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="adminId"
              placeholder="Admin ID or email"
              value={filters.adminId}
              onChange={handleFilterChange}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
          </div>
          <select
            name="action"
            value={filters.action}
            onChange={handleFilterChange}
            className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
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
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>
        {(filters.adminId || filters.action || filters.startDate || filters.endDate) && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedLog(log)}>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {log.adminId?.username || log.adminId || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {log.targetType ? `${log.targetType} (${log.targetId})` : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedLog(log); }}
                        className="inline-flex p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(1, p-1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AuditDetailModal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />
    </div>
  );
};
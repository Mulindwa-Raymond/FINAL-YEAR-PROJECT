/**
 * RuleList.jsx
 * 
 * Admin page for managing KB-DSS inference rules.
 * Features:
 * - List all rules with pagination, search, filter by category
 * - Edit and delete actions
 * - Add new rule button
 * - Display rule priority, certainty factor, and action type
 * - Fetches data from ruleService
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter, 
  X,
  Gavel,
  TrendingUp,
  AlertCircle,
  Zap,
  Shield
} from 'lucide-react';
import { getAllRules, deleteRule, toggleRule } from '../../../services/ruleService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../../components/common/ConfirmModal';
import { actionTypes, ruleCategories } from '../../../utils/constants';

export const RuleList = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchRules = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search: search || undefined,
        category: filterCategory || undefined,
        action_type: filterAction || undefined,
      };
      Object.keys(params).forEach(key => 
        params[key] === '' || params[key] === undefined ? delete params[key] : null
      );
      const res = await getAllRules(params);
      if (res.data.data?.rules) {
        setRules(res.data.data.rules);
        setTotal(res.data.data.total);
      } else if (Array.isArray(res.data.data)) {
        setRules(res.data.data);
        setTotal(res.data.data.length);
      } else {
        setRules([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Failed to fetch rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [page, search, filterCategory, filterAction]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRule(deleteTarget._id);
      fetchRules();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggle = async (rule) => {
    try {
      await toggleRule(rule._id);
      fetchRules();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const getActionTypeBadge = (actionType) => {
    const colors = {
      recommend_equipment: 'bg-green-100 text-green-700',
      recommend_detergent: 'bg-blue-100 text-blue-700',
      recommend_both: 'bg-purple-100 text-purple-700',
      flag_alert: 'bg-yellow-100 text-yellow-700',
      exclude_equipment: 'bg-red-100 text-red-700',
      exclude_detergent: 'bg-red-100 text-red-700',
    };
    return colors[actionType] || 'bg-slate-100 text-slate-700';
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            KB-DSS Rules
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage inference engine rules (if‑then logic)</p>
        </div>
        <Link
          to="/admin/rules/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </Link>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by rule ID, text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
          >
            <option value="">All Categories</option>
            {ruleCategories.map(cat => (
              <option key={cat} value={cat}>{cat.toUpperCase()}</option>
            ))}
          </select>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
          >
            <option value="">All Actions</option>
            {actionTypes.map(action => (
              <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
            ))}
          </select>
          {(search || filterCategory || filterAction) && (
            <button
              onClick={() => { setSearch(''); setFilterCategory(''); setFilterAction(''); }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-600"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rule ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Certainty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rules.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No rules found.
                  </td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={rule._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-medium text-slate-800">{rule.rule_id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        rule.category === 'safety' ? 'bg-red-100 text-red-700' :
                        rule.category === 'cost' ? 'bg-green-100 text-green-700' :
                        rule.category === 'environmental' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-cyan-100 text-cyan-700'
                      }`}>
                        {rule.category?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getActionTypeBadge(rule.consequent?.actions?.[0]?.type)}`}>
                        {rule.consequent?.actions?.[0]?.type?.replace(/_/g, ' ') || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-cyan-600" />
                        {rule.priority}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        {Math.round((rule.certainty_factor || 1) * 100)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(rule)}
                        className={`px-2 py-1 rounded-full text-xs transition ${
                          rule.active 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {rule.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/admin/rules/${rule._id}`}
                        className="inline-flex p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Shield className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/rules/${rule._id}/edit`}
                        className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(rule)}
                        className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
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
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Rule"
        message={`Are you sure you want to delete rule "${deleteTarget?.rule_id}"? This action cannot be undone.`}
        confirmVariant="danger"
      />
    </div>
  );
};
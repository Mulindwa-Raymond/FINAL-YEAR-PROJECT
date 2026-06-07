/**
 * RuleList.jsx
 * 
 * Admin page for managing KB-DSS inference rules.
 * Features:
 * - List all rules with pagination, search, filter by category
 * - Edit and delete actions
 * - Add new rule button
 * - Toggle rule active status
 * - View rule details
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
  Eye,
  ChevronLeft,
  ChevronRight,
  Power,
  Tag
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
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Helper to get rule ID
  const getRuleId = (rule) => {
    return rule?._id || rule?.rule_id || rule?.id;
  };

  const fetchRules = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search: search || undefined,
        category: filterCategory || undefined,
        action_type: filterAction || undefined,
        active: filterStatus === 'active' ? true : filterStatus === 'inactive' ? false : undefined,
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
  }, [page, search, filterCategory, filterAction, filterStatus]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ruleId = getRuleId(deleteTarget);
    if (!ruleId) {
      console.error('No rule ID found:', deleteTarget);
      return;
    }
    try {
      await deleteRule(ruleId);
      fetchRules();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggle = async (rule) => {
    const ruleId = getRuleId(rule);
    if (!ruleId) return;
    setTogglingId(ruleId);
    try {
      await toggleRule(ruleId);
      fetchRules();
    } catch (err) {
      console.error('Toggle failed:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const getActionTypeBadge = (actionType) => {
    const config = {
      recommend_equipment: { bg: 'bg-green-100', text: 'text-green-700', label: 'Recommend Equipment' },
      recommend_detergent: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Recommend Detergent' },
      recommend_both: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Recommend Both' },
      flag_alert: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Flag Alert' },
      exclude_equipment: { bg: 'bg-red-100', text: 'text-red-700', label: 'Exclude Equipment' },
      exclude_detergent: { bg: 'bg-red-100', text: 'text-red-700', label: 'Exclude Detergent' },
    };
    return config[actionType] || { bg: 'bg-slate-100', text: 'text-slate-600', label: actionType };
  };

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="pb-8 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-800">KB-DSS Rules</h1>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">Manage inference engine rules (if‑then logic)</p>
        </div>
        <Link
          to="/admin/rules/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </Link>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{rules.length}</span> of{' '}
          <span className="font-medium text-slate-700">{total}</span> rules
        </div>
        <div className="text-sm text-slate-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by rule ID, text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-slate-200 rounded-lg p-2 text-sm bg-white"
          >
            <option value="">All Categories</option>
            {ruleCategories.map(cat => (
              <option key={cat} value={cat}>{cat.toUpperCase()}</option>
            ))}
          </select>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="border border-slate-200 rounded-lg p-2 text-sm bg-white"
          >
            <option value="">All Actions</option>
            {actionTypes.map(action => (
              <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg p-2 text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {(search || filterCategory || filterAction || filterStatus) && (
            <button
              onClick={() => { setSearch(''); setFilterCategory(''); setFilterAction(''); setFilterStatus(''); }}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-600 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Rules Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Rule ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Certainty</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                    No rules found.
                  </td>
                </tr>
              ) : (
                rules.map((rule) => {
                  const ruleId = getRuleId(rule);
                  const firstAction = rule.consequent?.actions?.[0]?.type || rule.action_type;
                  const actionConfig = getActionTypeBadge(firstAction);
                  return (
                    <tr key={ruleId} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm font-medium text-slate-800">{rule.rule_id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                          rule.category === 'safety' ? 'bg-red-100 text-red-700' :
                          rule.category === 'cost' ? 'bg-green-100 text-green-700' :
                          rule.category === 'environmental' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-cyan-100 text-cyan-700'
                        }`}>
                          <Tag className="w-3 h-3" />
                          {rule.category?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${actionConfig.bg} ${actionConfig.text}`}>
                          {actionConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                        {rule.rule_text?.substring(0, 60)}...
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-cyan-600" />
                          <span className="text-sm font-medium text-slate-700">{rule.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span className="text-sm text-slate-700">{Math.round((rule.certainty_factor || 1) * 100)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggle(rule)}
                          disabled={togglingId === ruleId}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                            rule.active 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          } ${togglingId === ruleId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {togglingId === ruleId ? (
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Power className="w-3 h-3" />
                          )}
                          {rule.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/rules/${ruleId}`} 
                          className="inline-flex p-2 text-slate-500 hover:text-cyan-600 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          to={`/admin/rules/${ruleId}/edit`} 
                          className="inline-flex p-2 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => setDeleteTarget(rule)} 
                          className="inline-flex p-2 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-slate-200 flex justify-between items-center bg-slate-50">
            <button
              onClick={() => setPage(p => Math.max(1, p-1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-cyan-600 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-cyan-600 disabled:opacity-50 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
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
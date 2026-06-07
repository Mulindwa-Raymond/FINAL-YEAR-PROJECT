/**
 * DetergentList.jsx
 * 
 * Admin page for managing detergents.
 * Features:
 * - List all detergents with pagination, search, filters
 * - Edit and delete actions
 * - Add new detergent button
 * - pH indicator badges
 * - Fetches data from detergentService
 * 
 * Note: in_stock is not used (informational only). 
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
  Droplet, 
  Leaf, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { getAllDetergents, deleteDetergent } from '../../../services/detergentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../../components/common/ConfirmModal';
import { formatCurrencyUGX } from '../../../utils/format';
import { detergentCategories, detergentForms } from '../../../utils/constants';

export const DetergentList = () => {
  const [detergents, setDetergents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ detergent_category: '', form: '', requires_ppe: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Helper to get detergent ID (handles both _id and detergent_id)
  const getDetergentId = (det) => {
    return det?._id || det?.detergent_id || det?.id;
  };

  const fetchDetergents = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search: search || undefined,
        ...filters,
      };
      Object.keys(params).forEach(key => 
        params[key] === '' || params[key] === undefined ? delete params[key] : null
      );
      const res = await getAllDetergents(params);
      if (res.data.data?.detergents) {
        setDetergents(res.data.data.detergents);
        setTotal(res.data.data.total);
      } else if (Array.isArray(res.data.data)) {
        setDetergents(res.data.data);
        setTotal(res.data.data.length);
      } else {
        setDetergents([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Failed to fetch detergents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetergents();
  }, [page, search, filters]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const detergentId = getDetergentId(deleteTarget);
    if (!detergentId) {
      console.error('No detergent ID found:', deleteTarget);
      return;
    }
    try {
      await deleteDetergent(detergentId);
      fetchDetergents();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ detergent_category: '', form: '', requires_ppe: '' });
    setSearch('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  const getPhBadge = (ph) => {
    if (ph >= 12) return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">Caustic</span>;
    if (ph >= 10) return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-medium">High Alkaline</span>;
    if (ph >= 8) return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium">Alkaline</span>;
    if (ph >= 6) return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">Neutral</span>;
    if (ph >= 4) return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium">Mild Acid</span>;
    return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">Strong Acid</span>;
  };

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="pb-8 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-800">Detergents</h1>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">Manage cleaning chemical products</p>
        </div>
        <Link
          to="/admin/detergents/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Detergent
        </Link>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{detergents.length}</span> of{' '}
          <span className="font-medium text-slate-700">{total}</span> items
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
              placeholder="Search by name, brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm ${
              showFilters 
                ? 'bg-cyan-50 border-cyan-300 text-cyan-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {Object.values(filters).some(v => v) && (
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
            )}
          </button>
          {(search || Object.values(filters).some(v => v)) && (
            <button 
              onClick={clearFilters} 
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-600 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={filters.detergent_category}
              onChange={(e) => handleFilterChange('detergent_category', e.target.value)}
              className="border border-slate-200 rounded-lg p-2 text-sm bg-white"
            >
              <option value="">All Categories</option>
              {detergentCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filters.form}
              onChange={(e) => handleFilterChange('form', e.target.value)}
              className="border border-slate-200 rounded-lg p-2 text-sm bg-white"
            >
              <option value="">All Forms</option>
              {detergentForms.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select
              value={filters.requires_ppe}
              onChange={(e) => handleFilterChange('requires_ppe', e.target.value)}
              className="border border-slate-200 rounded-lg p-2 text-sm bg-white"
            >
              <option value="">PPE Required?</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        )}
      </div>

      {/* Detergents Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">pH</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Form</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">PPE</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {detergents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                    No detergents found.
                  </td>
                </tr>
              ) : (
                detergents.map((det) => {
                  const detergentId = getDetergentId(det);
                  return (
                    <tr key={detergentId} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        {det.image_url ? (
                          <img src={det.image_url} alt={det.product_name} className="w-10 h-10 object-cover rounded-md" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center">
                            <Droplet className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{det.product_name}</div>
                        <div className="text-xs text-slate-400">{det.brand_name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm capitalize text-slate-600">{det.detergent_category}</td>
                      <td className="px-6 py-4">{getPhBadge(det.ph_value)}</td>
                      <td className="px-6 py-4 text-sm capitalize text-slate-600">{det.form}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatCurrencyUGX(det.current_price_ugx)}</td>
                      <td className="px-6 py-4">
                        {det.requires_ppe ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" title="PPE Required" />
                        ) : (
                          <Leaf className="w-4 h-4 text-green-500" title="No PPE Required" />
                        )}
                       </td>
                      <td className="px-6 py-4 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/detergents/${detergentId}`} 
                          className="inline-flex p-2 text-slate-500 hover:text-cyan-600 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          to={`/admin/detergents/${detergentId}/edit`} 
                          className="inline-flex p-2 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => setDeleteTarget(det)} 
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

      <ConfirmModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={handleDelete} 
        title="Delete Detergent" 
        message={`Are you sure you want to delete "${deleteTarget?.product_name}"?`} 
        confirmVariant="danger" 
      />
    </div>
  );
};
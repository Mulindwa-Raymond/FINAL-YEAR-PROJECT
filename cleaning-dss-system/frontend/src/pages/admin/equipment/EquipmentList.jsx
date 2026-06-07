/**
 * EquipmentList.jsx
 * 
 * Admin page for managing cleaning equipment.
 * Clean flat design - minimal top spacing, visually appealing.
 * Displays intensity badge in grid view.
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
  Package,
  Battery,
  Zap,
  Truck,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  Eye,
  Tag
} from 'lucide-react';
import { getAllEquipment, deleteEquipment } from '../../../services/equipmentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../../components/common/ConfirmModal';
import { formatCurrencyUGX } from '../../../utils/format';
import { machineCategories, powerSources, equipmentBrands, intensityLabels } from '../../../utils/constants';

export const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    machine_category: '',
    power_source: '',
    brand_name: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('table');
  const limit = 20;

  // Helper to get equipment ID (handles both _id and equipment_id)
  const getEquipmentId = (eq) => {
    return eq?._id || eq?.equipment_id || eq?.id;
  };

  const fetchEquipment = async () => {
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
      const res = await getAllEquipment(params);
      if (res.data.data?.equipment) {
        setEquipment(res.data.data.equipment);
        setTotal(res.data.data.total);
      } else if (Array.isArray(res.data.data)) {
        setEquipment(res.data.data);
        setTotal(res.data.data.length);
      } else {
        setEquipment([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [page, search, filters]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const equipmentId = getEquipmentId(deleteTarget);
    if (!equipmentId) {
      console.error('No equipment ID found:', deleteTarget);
      return;
    }
    try {
      await deleteEquipment(equipmentId);
      fetchEquipment();
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
    setFilters({ machine_category: '', power_source: '', brand_name: '' });
    setSearch('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  const getPowerSourceIcon = (source) => {
    switch(source) {
      case 'battery': return <Battery className="w-4 h-4" />;
      case 'corded_electric': return <Zap className="w-4 h-4" />;
      default: return <Truck className="w-4 h-4" />;
    }
  };

  const getPowerSourceLabel = (source) => {
    switch(source) {
      case 'battery': return 'Battery';
      case 'corded_electric': return 'Electric';
      default: return source?.replace(/_/g, ' ') || 'Manual';
    }
  };

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="pb-8 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-800">Equipment</h1>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">Manage cleaning machines and equipment</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-cyan-50 text-cyan-600' : 'bg-white text-slate-400 hover:text-slate-600'}`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-cyan-50 text-cyan-600' : 'bg-white text-slate-400 hover:text-slate-600'}`}
              title="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>
          <Link
            to="/admin/equipment/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Equipment
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{equipment.length}</span> of{' '}
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
              placeholder="Search by name, brand, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all text-sm"
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
              value={filters.machine_category}
              onChange={(e) => handleFilterChange('machine_category', e.target.value)}
              className="bg-white border border-slate-200 rounded-lg p-2 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
            >
              <option value="">All Categories</option>
              {machineCategories.map(cat => (
                <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <select
              value={filters.power_source}
              onChange={(e) => handleFilterChange('power_source', e.target.value)}
              className="bg-white border border-slate-200 rounded-lg p-2 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
            >
              <option value="">All Power Sources</option>
              {powerSources.map(ps => (
                <option key={ps} value={ps}>{ps.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <select
              value={filters.brand_name}
              onChange={(e) => handleFilterChange('brand_name', e.target.value)}
              className="bg-white border border-slate-200 rounded-lg p-2 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
            >
              <option value="">All Brands</option>
              {equipmentBrands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content - Table or Grid view */}
      {viewMode === 'table' ? (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Equipment</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Power</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price (UGX)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">TCO/Year</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equipment.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                      No equipment found.
                    </td>
                  </tr>
                ) : (
                  equipment.map((eq) => {
                    const equipmentId = getEquipmentId(eq);
                    return (
                      <tr key={equipmentId || Math.random()} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {eq.image_url ? (
                              <img src={eq.image_url} alt={eq.model_name} className="w-10 h-10 object-cover rounded-md" />
                            ) : (
                              <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center">
                                <Package className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-slate-800">{eq.brand_name} {eq.model_name}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1">
                                {eq.brand_name}
                                {eq.intensity && (
                                  <span className="ml-1 inline-flex items-center gap-0.5 text-[10px] text-indigo-500">
                                    <Tag className="w-2.5 h-2.5" /> {intensityLabels[eq.intensity]?.split(' ')[0]}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs rounded-md bg-slate-100 text-slate-600">
                            {eq.machine_category?.replace(/_/g, ' ') || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            {getPowerSourceIcon(eq.power_source)} {getPowerSourceLabel(eq.power_source)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{formatCurrencyUGX(eq.current_price_ugx)}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{formatCurrencyUGX(eq.estimated_tco_per_year_ugx)}</td>
                        <td className="px-6 py-4 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            to={`/admin/equipment/${equipmentId}`} 
                            className="inline-flex p-2 text-slate-500 hover:text-cyan-600 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link 
                            to={`/admin/equipment/${equipmentId}/edit`} 
                            className="inline-flex p-2 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => setDeleteTarget(eq)} 
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
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-cyan-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="flex items-center gap-2">
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
                      className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                        page === pageNum
                          ? 'bg-cyan-600 text-white'
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
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-cyan-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {equipment.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400 border border-slate-200 rounded-lg bg-white">
              No equipment found.
            </div>
          ) : (
            equipment.map((eq) => {
              const equipmentId = getEquipmentId(eq);
              return (
                <div key={equipmentId} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-cyan-200 transition-colors group">
                  <div className="flex items-start gap-3 mb-3">
                    {eq.image_url ? (
                      <img src={eq.image_url} alt={eq.model_name} className="w-12 h-12 object-cover rounded-lg" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800 line-clamp-1">{eq.brand_name} {eq.model_name}</h3>
                      <p className="text-xs text-slate-400">{eq.brand_name}</p>
                      {eq.intensity && (
                        <p className="text-[10px] text-indigo-500 mt-0.5 flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5" /> {intensityLabels[eq.intensity]?.split(' ')[0]}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Category:</span>
                      <span className="text-slate-700 capitalize">{eq.machine_category?.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Power:</span>
                      <span className="text-slate-700 capitalize flex items-center gap-1">
                        {getPowerSourceIcon(eq.power_source)} {getPowerSourceLabel(eq.power_source)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Price:</span>
                      <span className="text-slate-700 font-medium">{formatCurrencyUGX(eq.current_price_ugx)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">TCO/Year:</span>
                      <span className="text-slate-600">{formatCurrencyUGX(eq.estimated_tco_per_year_ugx)}</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                    <Link 
                      to={`/admin/equipment/${equipmentId}`} 
                      className="p-1.5 text-slate-500 hover:text-cyan-600 rounded transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link 
                      to={`/admin/equipment/${equipmentId}/edit`} 
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => setDeleteTarget(eq)} 
                      className="p-1.5 text-slate-500 hover:text-red-600 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={handleDelete} 
        title="Delete Equipment" 
        message={`Are you sure you want to delete "${deleteTarget?.brand_name} ${deleteTarget?.model_name}"?`} 
        confirmVariant="danger" 
      />
    </div>
  );
};
/**
 * EquipmentList.jsx
 * 
 * Admin page for managing cleaning equipment.
 * Features:
 * - List all equipment with pagination, search, filters
 * - Edit and delete actions
 * - Add new equipment button
 * - Image preview in table
 * - Fetches data from equipmentService
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
  Truck
} from 'lucide-react';
import { getAllEquipment, deleteEquipment } from '../../../services/equipmentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../../components/common/ConfirmModal';
import { formatCurrencyUGX } from '../../../utils/format';
import { machineCategories, powerSources, equipmentBrands } from '../../../utils/constants';

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
  const limit = 20;

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
    try {
      await deleteEquipment(deleteTarget._id);
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

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Equipment
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage cleaning machines and equipment</p>
        </div>
        <Link
          to="/admin/equipment/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Equipment
        </Link>
      </div>

      {/* Search and filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, brand, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              showFilters ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {Object.values(filters).some(v => v) && (
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
            )}
          </button>
          {(search || Object.values(filters).some(v => v)) && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-600">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              value={filters.machine_category}
              onChange={(e) => handleFilterChange('machine_category', e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
            >
              <option value="">All Categories</option>
              {machineCategories.map(cat => (
                <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <select
              value={filters.power_source}
              onChange={(e) => handleFilterChange('power_source', e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
            >
              <option value="">All Power Sources</option>
              {powerSources.map(ps => (
                <option key={ps} value={ps}>{ps.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <select
              value={filters.brand_name}
              onChange={(e) => handleFilterChange('brand_name', e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
            >
              <option value="">All Brands</option>
              {equipmentBrands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Power</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price (UGX)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">TCO/Year</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {equipment.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No equipment found.
                  </td>
                </tr>
              ) : (
                equipment.map((eq) => (
                  <tr key={eq._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {eq.image_url ? (
                        <img src={eq.image_url} alt={eq.model_name} className="w-12 h-12 object-cover rounded-lg" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {eq.brand_name} {eq.model_name}
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">{eq.machine_category?.replace(/_/g, ' ')}</td>
                    <td className="px-6 py-4 flex items-center gap-1 text-sm">
                      {getPowerSourceIcon(eq.power_source)} {eq.power_source?.replace(/_/g, ' ')}
                    </td>
                    <td className="px-6 py-4">{formatCurrencyUGX(eq.current_price_ugx)}</td>
                    <td className="px-6 py-4">{formatCurrencyUGX(eq.estimated_tco_per_year_ugx)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link to={`/admin/equipment/${eq._id}`} className="inline-flex p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                        <Package className="w-4 h-4" />
                      </Link>
                      <Link to={`/admin/equipment/${eq._id}/edit`} className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteTarget(eq)} className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border rounded-lg disabled:opacity-50">Previous</button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-3 py-1 border rounded-lg disabled:opacity-50">Next</button>
          </div>
        )}
      </div>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Equipment" message={`Are you sure you want to delete "${deleteTarget?.brand_name} ${deleteTarget?.model_name}"?`} confirmVariant="danger" />
    </div>
  );
};
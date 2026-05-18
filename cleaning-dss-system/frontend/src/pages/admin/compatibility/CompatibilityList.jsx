/**
 * CompatibilityList.jsx
 * 
 * Admin page for managing equipment-detergent compatibility.
 * Features:
 * - List all compatibility records
 * - Filter by equipment or detergent
 * - Add, edit, delete compatibility records
 * - Visual indicators for recommended vs compatible
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
  HeartHandshake,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { getAllCompatibilities, deleteCompatibility } from '../../../services/compatibilityService';
import { getAllEquipment } from '../../../services/equipmentService';
import { getAllDetergents } from '../../../services/detergentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../../components/common/ConfirmModal';

export const CompatibilityList = () => {
  const [compatibilities, setCompatibilities] = useState([]);
  const [equipmentMap, setEquipmentMap] = useState({});
  const [detergentMap, setDetergentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEquipment, setFilterEquipment] = useState('');
  const [filterDetergent, setFilterDetergent] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [compRes, equipRes, detRes] = await Promise.all([
        getAllCompatibilities({ page, limit, equipment_id: filterEquipment || undefined, detergent_id: filterDetergent || undefined }),
        getAllEquipment({ limit: 1000 }),
        getAllDetergents({ limit: 1000 })
      ]);
      
      setCompatibilities(compRes.data.data?.compatibilities || compRes.data.data || []);
      setTotal(compRes.data.data?.total || (compRes.data.data?.length || 0));
      
      // Build maps for quick lookup
      const equipMap = {};
      (equipRes.data.data?.equipment || equipRes.data.data || []).forEach(e => {
        equipMap[e._id] = `${e.brand_name} ${e.model_name}`;
      });
      setEquipmentMap(equipMap);
      
      const detMap = {};
      (detRes.data.data?.detergents || detRes.data.data || []).forEach(d => {
        detMap[d._id] = d.product_name;
      });
      setDetergentMap(detMap);
    } catch (err) {
      console.error('Failed to fetch compatibility data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filterEquipment, filterDetergent]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCompatibility(deleteTarget._id);
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Equipment-Detergent Compatibility
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage which detergents work safely with each equipment</p>
        </div>
        <Link
          to="/admin/compatibility/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Compatibility
        </Link>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by equipment or detergent name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <input
            type="text"
            placeholder="Equipment ID"
            value={filterEquipment}
            onChange={(e) => setFilterEquipment(e.target.value)}
            className="w-48 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
          />
          <input
            type="text"
            placeholder="Detergent ID"
            value={filterDetergent}
            onChange={(e) => setFilterDetergent(e.target.value)}
            className="w-48 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
          />
          {(search || filterEquipment || filterDetergent) && (
            <button
              onClick={() => { setSearch(''); setFilterEquipment(''); setFilterDetergent(''); }}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Detergent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {compatibilities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No compatibility records found.
                  </td>
                </tr>
              ) : (
                compatibilities.map((comp) => (
                  <tr key={comp._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {equipmentMap[comp.equipment_id] || comp.equipment_id}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {detergentMap[comp.detergent_id] || comp.detergent_id}
                    </td>
                    <td className="px-6 py-4">
                      {comp.is_recommended ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" /> Recommended
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 text-sm">
                          <AlertCircle className="w-4 h-4" /> Compatible (Not Recommended)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-md truncate">
                      {comp.compatibility_notes || '-'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/admin/compatibility/${comp._id}/edit`}
                        className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(comp)}
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

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border rounded-lg disabled:opacity-50">Previous</button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-3 py-1 border rounded-lg disabled:opacity-50">Next</button>
          </div>
        )}
      </div>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Compatibility" message={`Are you sure you want to delete this compatibility record?`} confirmVariant="danger" />
    </div>
  );
};
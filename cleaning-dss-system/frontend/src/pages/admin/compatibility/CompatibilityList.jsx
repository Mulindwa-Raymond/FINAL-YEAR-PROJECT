/**
 * CompatibilityList.jsx
 * 
 * Admin page for managing equipment-detergent compatibility.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  HeartHandshake,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
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
  const [searchEquip, setSearchEquip] = useState('');
  const [searchDet, setSearchDet] = useState('');
  const [filterEquipment, setFilterEquipment] = useState('');
  const [filterDetergent, setFilterDetergent] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Helper to extract ID from various formats (handles objects, strings, and IDs)
  const extractId = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
      return item._id || item.equipment_id || item.detergent_id || item.id;
    }
    return null;
  };

  // Helper to get equipment display name
  const getEquipmentName = (equipment) => {
    if (!equipment) return 'Unknown Equipment';
    if (typeof equipment === 'object' && equipment.brand_name) {
      return `${equipment.brand_name} ${equipment.model_name || ''}`.trim() || 'Unknown Equipment';
    }
    const id = extractId(equipment);
    return equipmentMap[id] || 'Unknown Equipment';
  };

  // Helper to get detergent display name
  const getDetergentName = (detergent) => {
    if (!detergent) return 'Unknown Detergent';
    if (typeof detergent === 'object' && detergent.product_name) {
      return detergent.product_name;
    }
    const id = extractId(detergent);
    return detergentMap[id] || 'Unknown Detergent';
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [compRes, equipRes, detRes] = await Promise.all([
        getAllCompatibilities({ page, limit }),
        getAllEquipment({ limit: 1000 }),
        getAllDetergents({ limit: 1000 })
      ]);
      
      const compatData = compRes.data.data?.compatibilities || compRes.data.data || [];
      setCompatibilities(compatData);
      setTotal(compRes.data.data?.total || compatData.length);
      
      // Build maps for quick lookup from IDs to names
      const equipMap = {};
      const equipList = equipRes.data.data?.equipment || equipRes.data.data || [];
      equipList.forEach(e => {
        const id = e._id || e.equipment_id;
        const name = `${e.brand_name || ''} ${e.model_name || ''}`.trim() || e.name || 'Unknown Equipment';
        equipMap[id] = name;
      });
      setEquipmentMap(equipMap);
      
      const detMap = {};
      const detList = detRes.data.data?.detergents || detRes.data.data || [];
      detList.forEach(d => {
        const id = d._id || d.detergent_id;
        const name = d.product_name || d.name || 'Unknown Detergent';
        detMap[id] = name;
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
  }, [page]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const compatId = deleteTarget._id || deleteTarget.compatibility_id;
    if (!compatId) {
      console.error('No compatibility ID found:', deleteTarget);
      return;
    }
    try {
      await deleteCompatibility(compatId);
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteTarget(null);
    }
  };

  // Prepare equipment and detergent lists for filter dropdowns
  const equipmentOptions = Object.entries(equipmentMap).map(([id, name]) => ({ id, name }));
  const detergentOptions = Object.entries(detergentMap).map(([id, name]) => ({ id, name }));

  const filteredEquipmentOptions = equipmentOptions.filter(opt =>
    opt.name.toLowerCase().includes(searchEquip.toLowerCase())
  );
  const filteredDetergentOptions = detergentOptions.filter(opt =>
    opt.name.toLowerCase().includes(searchDet.toLowerCase())
  );

  // Apply client-side filters
  const filteredCompatibilities = compatibilities.filter(comp => {
    const equipId = extractId(comp.equipment_id);
    const detId = extractId(comp.detergent_id);
    const equipName = getEquipmentName(comp.equipment_id);
    const detName = getDetergentName(comp.detergent_id);
    
    if (filterEquipment && equipId !== filterEquipment && equipName !== filterEquipment) return false;
    if (filterDetergent && detId !== filterDetergent && detName !== filterDetergent) return false;
    return true;
  });

  const clearFilters = () => {
    setFilterEquipment('');
    setFilterDetergent('');
    setSearchEquip('');
    setSearchDet('');
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="pb-8 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-800">Equipment-Detergent Compatibility</h1>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">Manage which detergents work safely with each equipment</p>
        </div>
        <Link
          to="/admin/compatibility/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Compatibility
        </Link>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{filteredCompatibilities.length}</span> of{' '}
          <span className="font-medium text-slate-700">{total}</span> records
        </div>
        <div className="text-sm text-slate-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Equipment Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Equipment</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchEquip}
              onChange={(e) => setSearchEquip(e.target.value)}
              className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm"
            />
          </div>
          {searchEquip && filteredEquipmentOptions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full md:w-80 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg">
              {filteredEquipmentOptions.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setFilterEquipment(opt.id);
                    setSearchEquip('');
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                >
                  <span className="font-medium text-slate-700">{opt.name}</span>
                </button>
              ))}
            </div>
          )}
          {filterEquipment && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md">
                Filtering: {equipmentMap[filterEquipment] || filterEquipment}
              </span>
              <button onClick={() => setFilterEquipment('')} className="text-slate-400 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Detergent Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Detergent</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search detergent..."
              value={searchDet}
              onChange={(e) => setSearchDet(e.target.value)}
              className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm"
            />
          </div>
          {searchDet && filteredDetergentOptions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full md:w-80 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg">
              {filteredDetergentOptions.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setFilterDetergent(opt.id);
                    setSearchDet('');
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                >
                  <span className="font-medium text-slate-700">{opt.name}</span>
                </button>
              ))}
            </div>
          )}
          {filterDetergent && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md">
                Filtering: {detergentMap[filterDetergent] || filterDetergent}
              </span>
              <button onClick={() => setFilterDetergent('')} className="text-slate-400 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Clear filters button */}
      {(filterEquipment || filterDetergent) && (
        <div className="flex justify-end mb-4">
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-slate-500 hover:text-red-600 transition-colors"
          >
            <X className="w-3 h-3" /> Clear all filters
          </button>
        </div>
      )}

      {/* Compatibility Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Detergent</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompatibilities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No compatibility records found.
                  </td>
                </tr>
              ) : (
                filteredCompatibilities.map((comp) => {
                  // Extract equipment name safely
                  let equipName = 'Unknown Equipment';
                  if (comp.equipment_id) {
                    if (typeof comp.equipment_id === 'object' && comp.equipment_id.brand_name) {
                      equipName = `${comp.equipment_id.brand_name} ${comp.equipment_id.model_name || ''}`.trim();
                    } else {
                      const equipId = extractId(comp.equipment_id);
                      equipName = equipmentMap[equipId] || 'Unknown Equipment';
                    }
                  }
                  
                  // Extract detergent name safely
                  let detName = 'Unknown Detergent';
                  if (comp.detergent_id) {
                    if (typeof comp.detergent_id === 'object' && comp.detergent_id.product_name) {
                      detName = comp.detergent_id.product_name;
                    } else {
                      const detId = extractId(comp.detergent_id);
                      detName = detergentMap[detId] || 'Unknown Detergent';
                    }
                  }
                  
                  return (
                    <tr key={comp._id || comp.compatibility_id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-800">{equipName}</td>
                      <td className="px-6 py-4 text-slate-600">{detName}</td>
                      <td className="px-6 py-4">
                        {comp.is_recommended ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" /> Recommended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700">
                            <AlertCircle className="w-3 h-3" /> Compatible (Not Recommended)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-md truncate">
                        {comp.compatibility_notes || '-'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/compatibility/${comp._id}/edit`} 
                          className="inline-flex p-2 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => setDeleteTarget(comp)} 
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
        title="Delete Compatibility"
        message={`Are you sure you want to delete this compatibility record?`}
        confirmVariant="danger"
      />
    </div>
  );
};
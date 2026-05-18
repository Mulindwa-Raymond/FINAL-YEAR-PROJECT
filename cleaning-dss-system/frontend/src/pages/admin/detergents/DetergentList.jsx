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
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Filter, X, Droplet, Leaf, AlertTriangle } from 'lucide-react';
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

  const fetchDetergents = async () => {
    setLoading(true);
    try {
      const params = { page, limit, search: search || undefined, ...filters };
      Object.keys(params).forEach(k => params[k] === '' && delete params[k]);
      const res = await getAllDetergents(params);
      setDetergents(res.data.data?.detergents || res.data.data || []);
      setTotal(res.data.data?.total || (res.data.data?.length || 0));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchDetergents(); }, [page, search, filters]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await deleteDetergent(deleteTarget._id); fetchDetergents(); } catch (err) { console.error(err); } finally { setDeleteTarget(null); }
  };

  const getPhBadge = (ph) => {
    if (ph >= 12) return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Caustic</span>;
    if (ph >= 10) return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">High Alkaline</span>;
    if (ph >= 8) return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Alkaline</span>;
    if (ph >= 6) return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Neutral</span>;
    if (ph >= 4) return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Mild Acid</span>;
    return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Strong Acid</span>;
  };

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Detergents</h1><p className="text-slate-500 text-sm mt-1">Manage cleaning chemical products</p></div>
        <Link to="/admin/detergents/new" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"><Plus className="w-4 h-4" />Add Detergent</Link>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search by name, brand..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" /></div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${showFilters ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-white border-slate-200 text-slate-600'}`}><Filter className="w-4 h-4" />Filters{Object.values(filters).some(v => v) && <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>}</button>
          {(search || Object.values(filters).some(v => v)) && <button onClick={() => { setSearch(''); setFilters({ detergent_category: '', form: '', requires_ppe: '' }); }} className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-600"><X className="w-3 h-3" />Clear</button>}
        </div>
        {showFilters && (<div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select value={filters.detergent_category} onChange={(e) => setFilters(prev => ({ ...prev, detergent_category: e.target.value }))} className="bg-slate-50 border rounded-xl p-2 text-sm"><option value="">All Categories</option>{detergentCategories.map(c => <option key={c} value={c}>{c}</option>)}</select>
          <select value={filters.form} onChange={(e) => setFilters(prev => ({ ...prev, form: e.target.value }))} className="bg-slate-50 border rounded-xl p-2 text-sm"><option value="">All Forms</option>{detergentForms.map(f => <option key={f} value={f}>{f}</option>)}</select>
          <select value={filters.requires_ppe} onChange={(e) => setFilters(prev => ({ ...prev, requires_ppe: e.target.value }))} className="bg-slate-50 border rounded-xl p-2 text-sm"><option value="">PPE Required?</option><option value="true">Yes</option><option value="false">No</option></select>
        </div>)}
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Image</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">pH</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Form</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Price</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">PPE</th><th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-200">
            {detergents.length === 0 ? <tr><td colSpan="8" className="px-6 py-12 text-center text-slate-400">No detergents found.</td></tr> : detergents.map(d => (<tr key={d._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">{d.image_url ? <img src={d.image_url} alt={d.product_name} className="w-10 h-10 object-cover rounded-lg" /> : <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center"><Droplet className="w-5 h-5 text-slate-400" /></div>}</td>
              <td className="px-6 py-4 font-medium text-slate-800">{d.product_name}<p className="text-xs text-slate-400">{d.brand_name}</p></td>
              <td className="px-6 py-4 text-sm capitalize">{d.detergent_category}</td>
              <td className="px-6 py-4">{getPhBadge(d.ph_value)}</td>
              <td className="px-6 py-4 text-sm capitalize">{d.form}</td>
              <td className="px-6 py-4 text-sm">{formatCurrencyUGX(d.current_price_ugx)}</td>
              <td className="px-6 py-4">{d.requires_ppe ? <AlertTriangle className="w-4 h-4 text-amber-500" title="PPE Required" /> : <Leaf className="w-4 h-4 text-green-500" title="No PPE Required" />}</td>
              <td className="px-6 py-4 text-right space-x-2"><Link to={`/admin/detergents/${d._id}/edit`} className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></Link><button onClick={() => setDeleteTarget(d)} className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></td>
            </tr>))}
          </tbody>
        </table></div>
        {Math.ceil(total / limit) > 1 && (<div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center"><button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border rounded-lg disabled:opacity-50">Previous</button><span className="text-sm text-slate-500">Page {page} of {Math.ceil(total / limit)}</span><button onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p+1))} disabled={page === Math.ceil(total / limit)} className="px-3 py-1 border rounded-lg disabled:opacity-50">Next</button></div>)}
      </div>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Detergent" message={`Are you sure you want to delete "${deleteTarget?.product_name}"?`} confirmVariant="danger" />
    </div>
  );
};
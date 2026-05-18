/**
 * TrainingList.jsx
 * 
 * Admin page for managing training materials.
 * Features:
 * - List all training items with search and filter by type
 * - Edit and delete actions
 * - Add new training button
 * - YouTube video preview integration
 * - Fetches data from adminService
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
  Youtube,
  FileText,
  BookOpen,
  Play,
  Eye,
  Video
} from 'lucide-react';
import { getAllTrainings, deleteTraining } from '../../../services/adminService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../../components/common/ConfirmModal';

export const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search: search || undefined,
        type: filterType || undefined,
      };
      const res = await getAllTrainings(params);
      if (res.data.data?.trainings) {
        setTrainings(res.data.data.trainings);
        setTotal(res.data.data.total);
      } else if (Array.isArray(res.data.data)) {
        setTrainings(res.data.data);
        setTotal(res.data.data.length);
      } else {
        setTrainings([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Failed to fetch trainings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, [page, search, filterType]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTraining(deleteTarget._id);
      fetchTrainings();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Training Materials
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage videos, PDFs, and articles for users</p>
        </div>
        <Link
          to="/admin/training/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Training
        </Link>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
          >
            <option value="">All Types</option>
            <option value="video">Video</option>
            <option value="pdf">PDF Document</option>
            <option value="article">Article</option>
          </select>
          {(search || filterType) && (
            <button
              onClick={() => { setSearch(''); setFilterType(''); }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-600"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Training Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.length === 0 ? (
          <div className="col-span-full bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-12 text-center">
            <Video className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No training materials found.</p>
          </div>
        ) : (
          trainings.map((training) => {
            const embedUrl = training.type === 'video' ? getYouTubeEmbedUrl(training.youtubeUrl) : null;
            return (
              <div key={training._id} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden hover:shadow-2xl transition-all group">
                {/* Preview */}
                <div className="h-48 bg-slate-100 overflow-hidden relative">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={training.title}
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : training.type === 'pdf' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                      <FileText className="w-12 h-12 text-red-400 mb-2" />
                      <span className="text-xs text-slate-500">PDF Document</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                      <BookOpen className="w-12 h-12 text-blue-400 mb-2" />
                      <span className="text-xs text-slate-500">Article / Webpage</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                      training.type === 'video' ? 'bg-red-500 text-white' :
                      training.type === 'pdf' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {training.type === 'video' && <Youtube className="w-3 h-3" />}
                      {training.type === 'pdf' && <FileText className="w-3 h-3" />}
                      {training.type === 'article' && <BookOpen className="w-3 h-3" />}
                      {training.type.toUpperCase()}
                    </span>
                  </div>
                  {!training.active && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs">Inactive</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{training.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{training.description || 'No description provided.'}</p>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    {training.type === 'video' && training.youtubeUrl && (
                      <a
                        href={training.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition flex items-center justify-center gap-1"
                      >
                        <Youtube className="w-3 h-3" /> Watch on YouTube
                      </a>
                    )}
                    {training.type !== 'video' && training.url && (
                      <a
                        href={training.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-cyan-700 transition flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Open Resource
                      </a>
                    )}
                    <Link
                      to={`/admin/training/${training._id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(training)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p-1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p+1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Training"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmVariant="danger"
      />
    </div>
  );
};
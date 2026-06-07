/**
 * TrainingList.jsx
 * 
 * Admin page for managing training materials.
 * Uses `id` from backend (model transforms _id to id).
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Youtube,
  FileText,
  BookOpen,
  Eye,
  Video,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getAllTrainings, deleteTraining } from '../../../services/adminService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../../components/common/ConfirmModal';

export const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
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
    const trainingId = deleteTarget.id; // ✅ use id, not _id
    if (!trainingId) {
      console.error('No training ID found', deleteTarget);
      alert('Cannot delete: missing training ID');
      return;
    }
    setDeletingId(trainingId);
    try {
      await deleteTraining(trainingId);
      fetchTrainings();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete training. Please try again.');
    } finally {
      setDeletingId(null);
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
    <div className="pb-8 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-800">Training Materials</h1>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">Manage videos, PDFs, and articles for users</p>
        </div>
        <Link
          to="/admin/training/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Training
        </Link>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{trainings.length}</span> of{' '}
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
              placeholder="Search by title, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-slate-200 rounded-lg p-2 text-sm bg-white"
          >
            <option value="">All Types</option>
            <option value="video">Video</option>
            <option value="pdf">PDF Document</option>
            <option value="article">Article</option>
          </select>
          {(search || filterType) && (
            <button
              onClick={() => {
                setSearch('');
                setFilterType('');
                setPage(1);
              }}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-600 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Training Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.length === 0 ? (
          <div className="col-span-full border border-slate-200 rounded-lg bg-white p-12 text-center">
            <Video className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No training materials found.</p>
          </div>
        ) : (
          trainings.map((training) => {
            const embedUrl = training.type === 'video' ? getYouTubeEmbedUrl(training.youtubeUrl) : null;
            return (
              <div
                key={training.id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-cyan-200 transition-all group"
              >
                {/* Preview Image / Placeholder */}
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
                  {/* Type Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                        training.type === 'video'
                          ? 'bg-red-500 text-white'
                          : training.type === 'pdf'
                          ? 'bg-orange-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {training.type === 'video' && <Youtube className="w-3 h-3" />}
                      {training.type === 'pdf' && <FileText className="w-3 h-3" />}
                      {training.type === 'article' && <BookOpen className="w-3 h-3" />}
                      {training.type.toUpperCase()}
                    </span>
                  </div>
                  {/* Inactive Overlay */}
                  {!training.active && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs">Inactive</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{training.title}</h3>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                    {training.description || 'No description provided.'}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-2">
                    {training.type === 'video' && training.youtubeUrl && (
                      <a
                        href={training.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 bg-red-600 text-white rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-red-700 transition flex items-center justify-center gap-1"
                      >
                        <Youtube className="w-3 h-3" /> Watch
                      </a>
                    )}
                    {training.type !== 'video' && training.url && (
                      <a
                        href={training.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 bg-cyan-600 text-white rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-700 transition flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Open
                      </a>
                    )}
                    <Link
                      to={`/admin/training/${training.id}/edit`}
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(training)}
                      disabled={deletingId === training.id}
                      className="p-1.5 text-slate-500 hover:text-red-600 rounded transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === training.id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
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
        <div className="mt-6 flex justify-between items-center border-t border-slate-200 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-cyan-600 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-cyan-600 disabled:opacity-50 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
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
/**
 * FeedbackList.jsx
 * 
 * Admin page for viewing user feedback on recommendations.
 * Features:
 * - List all feedback with pagination, filters (rating, date range)
 * - View feedback details (recommendation context)
 * - Stats summary (average rating, distribution, recent count)
 * - Export functionality
 */

import React, { useEffect, useState } from 'react';
import { 
  Star, 
  StarHalf,
  Calendar,
  Filter,
  X,
  Download,
  TrendingUp,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { getAllFeedback, getFeedbackStats } from '../../../services/adminService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { formatDate } from '../../../utils/format';

export const FeedbackList = () => {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    rating: '',
    startDate: '',
    endDate: '',
  });
  const limit = 20;

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      Object.keys(params).forEach(key => 
        params[key] === '' || params[key] === undefined ? delete params[key] : null
      );
      
      const [feedbackRes, statsRes] = await Promise.all([
        getAllFeedback(params),
        getFeedbackStats()
      ]);
      
      setFeedback(feedbackRes.data.data?.feedback || feedbackRes.data.data || []);
      setTotal(feedbackRes.data.data?.total || (feedbackRes.data.data?.length || 0));
      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ rating: '', startDate: '', endDate: '' });
    setPage(1);
  };

  const exportToCSV = () => {
    const headers = ['User', 'Rating', 'Comment', 'Date', 'Recommendation ID'];
    const rows = feedback.map(f => [
      f.recommendation_id?.user_id?.email || f.user_id?.email || 'N/A',
      f.rating,
      f.comment || '',
      formatDate(f.created_at),
      f.recommendation_id?._id || f.recommendation_id
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
        />
      );
    }
    return stars;
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            User Feedback
          </h1>
          <p className="text-slate-500 text-sm mt-1">Monitor user satisfaction and improve recommendations</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <MessageSquare className="w-4 h-4" /> Total Feedback
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.total || 0}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Star className="w-4 h-4 text-yellow-500" /> Average Rating
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {stats.averageRating ? stats.averageRating.toFixed(1) : '0'} / 5.0
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" /> Recent (7 days)
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.recentCount || 0}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Users className="w-4 h-4" /> Responded Users
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {stats.distribution?.reduce((acc, d) => acc + d.count, 0) || 0}
            </p>
          </div>
        </div>
      )}

      {/* Rating Distribution */}
      {stats?.distribution && stats.distribution.length > 0 && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = stats.distribution.find(d => d._id === rating)?.count || 0;
              const percentage = stats.total ? (count / stats.total) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    {renderStars(rating)}
                  </div>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-12">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              showFilters ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {(filters.rating || filters.startDate || filters.endDate) && (
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
            )}
          </button>
          {(filters.rating || filters.startDate || filters.endDate) && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-600">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars - Excellent</option>
              <option value="4">4 Stars - Very Good</option>
              <option value="3">3 Stars - Good</option>
              <option value="2">2 Stars - Fair</option>
              <option value="1">1 Star - Poor</option>
            </select>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              placeholder="Start Date"
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              placeholder="End Date"
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
            />
          </div>
        )}
      </div>

      {/* Feedback Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {feedback.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No feedback found.
                  </td>
                </tr>
              ) : (
                feedback.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-800">
                      {item.recommendation_id?.user_id?.email || item.user_id?.email || 'Anonymous'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {renderStars(item.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-md truncate">
                      {item.comment || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedFeedback(item)}
                        className="inline-flex p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
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
              className="flex items-center gap-1 px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Feedback Details</h2>
              <button onClick={() => setSelectedFeedback(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs text-slate-500 uppercase">User</span>
                <p className="text-slate-800">{selectedFeedback.recommendation_id?.user_id?.email || selectedFeedback.user_id?.email}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase">Rating</span>
                <div className="flex items-center gap-1 mt-1">{renderStars(selectedFeedback.rating)}</div>
              </div>
              {selectedFeedback.comment && (
                <div>
                  <span className="text-xs text-slate-500 uppercase">Comment</span>
                  <p className="text-slate-700 mt-1 p-3 bg-slate-50 rounded-xl">{selectedFeedback.comment}</p>
                </div>
              )}
              <div>
                <span className="text-xs text-slate-500 uppercase">Submitted</span>
                <p className="text-slate-600">{new Date(selectedFeedback.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button onClick={() => setSelectedFeedback(null)} className="px-6 py-2 bg-cyan-600 text-white rounded-xl text-sm font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
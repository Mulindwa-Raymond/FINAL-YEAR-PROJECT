/**
 * TrainingForm.jsx
 * 
 * Admin form for creating or editing a training material.
 * Fixed: ID extraction, added unique keys, error handling.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  X,
  AlertCircle,
  Youtube,
  Link as LinkIcon,
  FileText,
  BookOpen,
  Video,
  CheckCircle,
} from 'lucide-react';
import { createTraining, updateTraining, getTrainingById } from '../../../services/adminService';
import { getAllEquipment } from '../../../services/equipmentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

export const TrainingForm = () => {
  const { id } = useParams(); // 'id' comes from route param
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);
  const [loadingEquipment, setLoadingEquipment] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    youtubeUrl: '',
    url: '',
    machineId: '',
    active: true,
  });

  // Load equipment list
  useEffect(() => {
    const fetchEquipment = async () => {
      setLoadingEquipment(true);
      try {
        const res = await getAllEquipment({ limit: 1000, active: true });
        setEquipmentList(res.data.data?.equipment || res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch equipment:', err);
      } finally {
        setLoadingEquipment(false);
      }
    };
    fetchEquipment();
  }, []);

  // Load training data when editing
  useEffect(() => {
    if (id) {
      const fetchTraining = async () => {
        setLoading(true);
        try {
          const res = await getTrainingById(id);
          const data = res.data.data;
          setFormData({
            title: data.title || '',
            description: data.description || '',
            type: data.type || 'video',
            youtubeUrl: data.youtubeUrl || '',
            url: data.url || '',
            machineId: data.machineId?._id || data.machineId || '',
            active: data.active !== undefined ? data.active : true,
          });
        } catch (err) {
          console.error('Failed to load training:', err);
          setError('Failed to load training data. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      fetchTraining();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      youtubeUrl: newType === 'video' ? prev.youtubeUrl : '',
      url: newType !== 'video' ? prev.url : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setSaving(false);
      return;
    }
    if (formData.type === 'video' && !formData.youtubeUrl.trim()) {
      setError('YouTube URL is required for video type');
      setSaving(false);
      return;
    }
    if ((formData.type === 'pdf' || formData.type === 'article') && !formData.url.trim()) {
      setError('Resource URL is required for PDF/article type');
      setSaving(false);
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      youtubeUrl: formData.type === 'video' ? formData.youtubeUrl.trim() : undefined,
      url: formData.type !== 'video' ? formData.url.trim() : undefined,
      machineId: formData.machineId || null,
      active: formData.active,
    };

    try {
      if (id) {
        await updateTraining(id, payload);
        setSuccess('✅ Training updated successfully! Redirecting...');
      } else {
        await createTraining(payload);
        setSuccess('✅ Training created successfully! Redirecting...');
      }
      setTimeout(() => {
        navigate('/admin/training');
      }, 1500);
    } catch (err) {
      console.error('Save error:', err);
      let errorMessage = err.response?.data?.error || err.message || 'Failed to save training.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 lg:px-6">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-800">
              {id ? 'Edit Training' : 'Add New Training'}
            </h1>
          </div>
          <button onClick={() => navigate('/admin/training')} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-5 mt-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mx-5 mt-5 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold">Success</p>
                <p>{success}</p>
              </div>
              <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-cyan-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-cyan-400"
            />
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'video', label: 'Video', icon: <Youtube className="w-5 h-5" /> },
                { value: 'pdf', label: 'PDF', icon: <FileText className="w-5 h-5" /> },
                { value: 'article', label: 'Article', icon: <BookOpen className="w-5 h-5" /> },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTypeChange(option.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    formData.type === option.value
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {option.icon}
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional URL fields */}
          {formData.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL *</label>
              <div className="relative">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                <input
                  type="url"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {(formData.type === 'pdf' || formData.type === 'article') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Resource URL *</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder={
                    formData.type === 'pdf'
                      ? 'https://example.com/document.pdf'
                      : 'https://example.com/article'
                  }
                  required
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* Related Equipment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Related Equipment (Optional)
            </label>
            <select
              name="machineId"
              value={formData.machineId}
              onChange={handleChange}
              disabled={loadingEquipment}
              className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:border-cyan-400"
            >
              <option value="">None (general training)</option>
              {equipmentList.map((eq) => (
                <option key={eq._id} value={eq._id}>
                  {eq.brand_name} {eq.model_name}
                </option>
              ))}
            </select>
          </div>

          {/* Active Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-sm text-slate-700">Active (visible to users)</span>
          </label>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/admin/training')}
              disabled={saving}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-cyan-700 disabled:opacity-50 shadow-md"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Training
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
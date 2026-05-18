/**
 * TrainingForm.jsx
 * 
 * Admin form for creating or editing a training material.
 * Supports YouTube videos, PDFs, and articles.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, AlertCircle, Youtube, Link as LinkIcon, FileText, BookOpen, Video } from 'lucide-react';
import { createTraining, updateTraining, getTrainingById } from '../../../services/adminService';
import { getAllEquipment } from '../../../services/equipmentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

export const TrainingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    youtubeUrl: '',
    url: '',
    machineId: '',
    active: true,
  });

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await getAllEquipment({ limit: 1000, active: true });
        setEquipmentList(res.data.data?.equipment || res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch equipment:', err);
      }
    };
    fetchEquipment();

    if (id) {
      const fetchTraining = async () => {
        setLoading(true);
        try {
          const res = await getTrainingById(id);
          setFormData(res.data.data);
        } catch (err) {
          setError('Failed to load training data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTraining();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData(prev => ({
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
    try {
      const payload = { ...formData };
      if (payload.type === 'video') payload.url = undefined;
      else payload.youtubeUrl = undefined;
      
      if (id) await updateTraining(id, payload);
      else await createTraining(payload);
      navigate('/admin/training');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save training.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {id ? 'Edit Training' : 'Add New Training'}
          </h1>
          <button onClick={() => navigate('/admin/training')} className="p-2 hover:bg-slate-100 rounded-xl">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" placeholder="Brief explanation of what this training covers..." />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
            <div className="grid grid-cols-3 gap-3">
              {['video', 'pdf', 'article'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange({ target: { value: type } })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.type === type ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  {type === 'video' && <Youtube className="w-6 h-6" />}
                  {type === 'pdf' && <FileText className="w-6 h-6" />}
                  {type === 'article' && <BookOpen className="w-6 h-6" />}
                  <span className="text-xs capitalize">{type}</span>
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
                <input type="url" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." required className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>
          )}

          {(formData.type === 'pdf' || formData.type === 'article') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Resource URL *</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="url" name="url" value={formData.url} onChange={handleChange} placeholder={formData.type === 'pdf' ? "https://example.com/document.pdf" : "https://example.com/article"} required className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>
          )}

          {/* Link to equipment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Related Equipment (Optional)</label>
            <select name="machineId" value={formData.machineId} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3">
              <option value="">None (general training)</option>
              {equipmentList.map(eq => (
                <option key={eq._id} value={eq._id}>{eq.brand_name} {eq.model_name}</option>
              ))}
            </select>
          </div>

          {/* Active status */}
          <label className="flex items-center gap-2">
            <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
            <span className="text-sm text-slate-700">Active (visible to users)</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => navigate('/admin/training')} className="px-6 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition disabled:opacity-70">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Training'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
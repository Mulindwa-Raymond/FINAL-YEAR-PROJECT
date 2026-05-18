/**
 * UserFormModal.jsx
 * 
 * Modal component for creating or editing a user.
 * Role-based restrictions: Only super_admin can set admin/super_admin roles.
 * Supports organization field (from ERD).
 */

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { createUser, updateUser } from '../../../services/adminService';
import { useAuth } from '../../../contexts/AuthContext';

export const UserFormModal = ({ isOpen, onClose, user }) => {
  const { isSuperAdmin, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'standard',
    organization: '',
    is_active: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function to get user ID (supports both _id and user_id)
  const getUserId = (u) => {
    return u?._id || u?.user_id || u?.id;
  };

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        role: user.role || 'standard',
        organization: user.organization || '',
        is_active: user.is_active !== undefined ? user.is_active : true,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'standard',
        organization: '',
        is_active: true,
      });
    }
    setError('');
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate required fields
    if (!formData.username) {
      setError('Username is required');
      setLoading(false);
      return;
    }
    if (!formData.email) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        organization: formData.organization,
        is_active: formData.is_active,
      };
      
      if (!user) {
        // Creating new user - password required
        if (!formData.password) {
          setError('Password is required for new users.');
          setLoading(false);
          return;
        }
        payload.password = formData.password;
        await createUser(payload);
      } else {
        // Updating existing user - password optional
        if (formData.password) {
          payload.password = formData.password;
        }
        // Make sure we have the correct user ID
        const userId = getUserId(user);
        if (!userId) {
          setError('User ID is missing. Cannot update.');
          setLoading(false);
          return;
        }
        await updateUser(userId, payload);
        
        // If user is updating their own profile, refresh auth context
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const currentUserId = getUserId(currentUser);
        if (currentUserId === userId) {
          await refreshUser();
        }
      }
      onClose(true);
    } catch (err) {
      console.error('Save user error:', err);
      setError(err.response?.data?.error || 'Failed to save user.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Role options based on user's permission
  const roleOptions = [
    { value: 'standard', label: 'Standard User', description: 'Regular user (recommendations only)' },
  ];
  
  if (isSuperAdmin) {
    roleOptions.push(
      { value: 'admin', label: 'Admin', description: 'Can manage content, not other admins' },
      { value: 'super_admin', label: 'Super Admin', description: 'Full system access' }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-600" />
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <button onClick={() => onClose(false)} className="p-1 hover:bg-slate-100 rounded-lg transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Organization
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Company name"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              disabled={!isSuperAdmin && !!user}
            >
              {roleOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {roleOptions.find(r => r.value === formData.role)?.description && (
              <p className="text-xs text-slate-400 mt-1">
                {roleOptions.find(r => r.value === formData.role)?.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password {!user && '*'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={user ? 'Leave blank to keep unchanged' : 'Enter password'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-sm text-slate-700">Active (user can log in)</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition disabled:opacity-70"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
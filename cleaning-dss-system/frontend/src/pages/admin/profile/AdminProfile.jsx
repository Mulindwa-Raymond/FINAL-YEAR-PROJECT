/**
 * AdminProfile.jsx
 * 
 * Admin-specific profile page with:
 * - Personal information (name, email, role, organization)
 * - Password change functionality
 * - Two-factor authentication toggle
 * - Notification preferences
 * - Session management (active sessions, logout from other devices)
 * - Activity log of admin actions
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Building2, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  LogOut,
  Smartphone,
  Bell,
  Moon,
  Sun,
  Monitor,
  ShieldCheck,
  Fingerprint,
  Key,
  Globe,
  Activity,
  ChevronRight,
  Loader2,
  Settings,
  Palette
} from 'lucide-react';
import { getMyProfile, updateMyProfile, changePassword } from '../../../services/adminService';
import { getAuditLogs } from '../../../services/adminService';

export const AdminProfile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [recentActivity, setRecentActivity] = useState([]);

  // Profile form data
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    organization: '',
    role: '',
  });

  // Password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    twoFactorAuth: false,
    theme: 'light',
    language: 'en',
  });

  useEffect(() => {
    fetchProfileData();
    fetchRecentActivity();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await getMyProfile();
      const data = response.data.data;
      setProfileData({
        username: data.username || user?.username || '',
        email: data.email || user?.email || '',
        organization: data.organization || user?.organization || '',
        role: data.role || user?.role || 'admin',
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      // Fallback to auth context data
      setProfileData({
        username: user?.username || '',
        email: user?.email || '',
        organization: user?.organization || '',
        role: user?.role || 'admin',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await getAuditLogs({ limit: 5, page: 1 });
      const logs = response.data.data?.logs || [];
      setRecentActivity(logs.map(log => ({
        action: log.action.replace(/_/g, ' '),
        timestamp: log.timestamp,
        ipAddress: log.ipAddress,
      })));
    } catch (err) {
      console.error('Failed to fetch activity:', err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateMyProfile({
        username: profileData.username,
        email: profileData.email,
        organization: profileData.organization,
      });
      await refreshUser();
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      setSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      setSaving(false);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    // Save preference to localStorage
    localStorage.setItem(`admin_pref_${key}`, !preferences[key]);
  };

  const handleThemeChange = (theme) => {
    setPreferences(prev => ({ ...prev, theme }));
    localStorage.setItem('admin_theme', theme);
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    } else {
      document.documentElement.classList.remove('light-mode', 'dark-mode');
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'super_admin':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-semibold">Super Admin</span>;
      case 'admin':
        return <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-md text-xs font-semibold">Admin</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">User</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
          <p className="text-slate-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {profileData.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profileData.username}</h1>
              <div className="flex items-center gap-2 mt-1">
                {getRoleBadge(profileData.role)}
                <span className="text-white/70 text-sm">{profileData.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-6">
            {[
              { id: 'profile', label: 'Profile', icon: <User size={16} /> },
              { id: 'security', label: 'Security', icon: <Shield size={16} /> },
              { id: 'preferences', label: 'Preferences', icon: <Settings size={16} /> },
              { id: 'activity', label: 'Activity Log', icon: <Activity size={16} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-cyan-600 text-cyan-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Organization
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={profileData.organization || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, organization: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Role
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={profileData.role === 'super_admin' ? 'Super Admin' : profileData.role === 'admin' ? 'Admin' : profileData.role}
                      disabled
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              {/* Change Password Form */}
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Lock size={18} className="text-cyan-600" />
                  Change Password
                </h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                      New Password
                    </label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2 bg-cyan-600 text-white rounded-xl text-sm font-semibold hover:bg-cyan-700 transition disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock size={14} />}
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Two-Factor Authentication */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Fingerprint size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Two-Factor Authentication</p>
                      <p className="text-[10px] text-slate-500">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePreferenceToggle('twoFactorAuth')}
                    className={`relative w-10 h-5 rounded-full transition-colors ${preferences.twoFactorAuth ? 'bg-cyan-600' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${preferences.twoFactorAuth ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Globe size={18} className="text-cyan-600" />
                  Active Sessions
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                        <Monitor size={14} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">Current Session (This device)</p>
                        <p className="text-[9px] text-slate-400">Chrome on Windows • Kampala, Uganda</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active Now</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                        <Smartphone size={14} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">Mobile Device</p>
                        <p className="text-[9px] text-slate-400">Safari on iOS • Last active 2 days ago</p>
                      </div>
                    </div>
                    <button className="text-[9px] text-red-500 hover:text-red-600">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Palette size={18} className="text-cyan-600" />
                  Theme
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: <Sun size={16} />, bg: 'bg-white' },
                    { value: 'dark', label: 'Dark', icon: <Moon size={16} />, bg: 'bg-slate-800', textColor: 'text-white' },
                    { value: 'system', label: 'System', icon: <Monitor size={16} />, bg: 'bg-slate-100' },
                  ].map(theme => (
                    <button
                      key={theme.value}
                      onClick={() => handleThemeChange(theme.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferences.theme === theme.value
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-lg ${theme.bg} flex items-center justify-center text-slate-600 shadow-sm ${theme.textColor || ''}`}>
                          {theme.icon}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{theme.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Bell size={18} className="text-cyan-600" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                    <div>
                      <span className="font-medium text-slate-800">Email Notifications</span>
                      <p className="text-[10px] text-slate-500">Receive system updates and alerts via email</p>
                    </div>
                    <button
                      onClick={() => handlePreferenceToggle('emailNotifications')}
                      className={`relative w-10 h-5 rounded-full transition-colors ${preferences.emailNotifications ? 'bg-cyan-600' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${preferences.emailNotifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </label>
                </div>
              </div>

              {/* Language Preference */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Globe size={18} className="text-cyan-600" />
                  Language
                </h3>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full max-w-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="sw">Kiswahili</option>
                  <option value="lg">Luganda</option>
                </select>
              </div>
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === 'activity' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity size={16} className="text-cyan-600" />
                <h3 className="text-base font-bold text-slate-800">Recent Admin Activity</h3>
              </div>
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity found</p>
                  </div>
                ) : (
                  recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white transition">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                        <Activity size={14} className="text-cyan-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 capitalize">
                          {activity.action?.toLowerCase()}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] text-slate-400 flex items-center gap-1">
                            <Clock size={10} /> {new Date(activity.timestamp).toLocaleString()}
                          </span>
                          <span className="text-[9px] text-slate-400 flex items-center gap-1">
                            <Globe size={10} /> {activity.ipAddress || 'Unknown IP'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 text-center">
                <button 
                  onClick={() => navigate('/admin/audit')}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-medium inline-flex items-center gap-1"
                >
                  View full audit log <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
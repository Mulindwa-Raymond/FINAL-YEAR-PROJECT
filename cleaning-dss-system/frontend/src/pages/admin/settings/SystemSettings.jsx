/**
 * SystemSettings.jsx
 * 
 * System-wide settings for admin portal:
 * - General settings (system name, timezone, date format)
 * - API & Integration settings
 * - Backup & Maintenance settings
 * - Security settings (rate limits, session timeout)
 * - Email configuration
 */

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Database, 
  Mail, 
  Shield, 
  Clock, 
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Server,
  Key,
  Users,
  Bell,
  Zap,
  HardDrive
} from 'lucide-react';

export const SystemSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  // Settings state
  const [settings, setSettings] = useState({
    general: {
      systemName: 'Clean Match DSS',
      timezone: 'Africa/Kampala',
      dateFormat: 'DD/MM/YYYY',
      itemsPerPage: 20,
      enableRegistration: true,
    },
    api: {
      apiBaseUrl: 'https://clean-match.onrender.com/api/v1',
      rateLimit: 100,
      rateLimitWindow: 15, // minutes
      enableCaching: true,
      cacheTTL: 300, // seconds
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      retentionDays: 30,
    },
    security: {
      sessionTimeout: 60, // minutes
      maxLoginAttempts: 5,
      passwordExpiryDays: 90,
      requireStrongPassword: true,
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpSecure: true,
      fromEmail: 'noreply@cleanmatch.com',
      fromName: 'Clean Match DSS',
    },
  });

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('system_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
    setLoading(false);
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Save to localStorage
      localStorage.setItem('system_settings', JSON.stringify(settings));
      
      // In a production environment, you would also save to backend API
      // await updateSystemSettings(settings);
      
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to defaults
      setSettings({
        general: {
          systemName: 'Clean Match DSS',
          timezone: 'Africa/Kampala',
          dateFormat: 'DD/MM/YYYY',
          itemsPerPage: 20,
          enableRegistration: true,
        },
        api: {
          apiBaseUrl: 'https://clean-match.onrender.com/api/v1',
          rateLimit: 100,
          rateLimitWindow: 15,
          enableCaching: true,
          cacheTTL: 300,
        },
        backup: {
          autoBackup: true,
          backupFrequency: 'daily',
          backupTime: '02:00',
          retentionDays: 30,
        },
        security: {
          sessionTimeout: 60,
          maxLoginAttempts: 5,
          passwordExpiryDays: 90,
          requireStrongPassword: true,
        },
        email: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpSecure: true,
          fromEmail: 'noreply@cleanmatch.com',
          fromName: 'Clean Match DSS',
        },
      });
      setSuccess('Settings reset to defaults!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">System Settings</h1>
              <p className="text-slate-300 text-sm mt-0.5">Configure system-wide preferences and integrations</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 px-6 overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {[
              { id: 'general', label: 'General', icon: <Settings size={16} /> },
              { id: 'api', label: 'API & Cache', icon: <Server size={16} /> },
              { id: 'backup', label: 'Backup', icon: <HardDrive size={16} /> },
              { id: 'security', label: 'Security', icon: <Shield size={16} /> },
              { id: 'email', label: 'Email', icon: <Mail size={16} /> },
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

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                  System Name
                </label>
                <input
                  type="text"
                  value={settings.general.systemName}
                  onChange={(e) => handleSettingChange('general', 'systemName', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Timezone
                  </label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  >
                    <option value="Africa/Kampala">Africa/Kampala (EAT)</option>
                    <option value="Africa/Nairobi">Africa/Nairobi</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Date Format
                  </label>
                  <select
                    value={settings.general.dateFormat}
                    onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Items Per Page
                  </label>
                  <input
                    type="number"
                    value={settings.general.itemsPerPage}
                    onChange={(e) => handleSettingChange('general', 'itemsPerPage', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
                <div className="flex items-center h-full pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.general.enableRegistration}
                      onChange={(e) => handleSettingChange('general', 'enableRegistration', e.target.checked)}
                      className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-slate-700">Allow public registration</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* API & Cache Settings */}
          {activeTab === 'api' && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                  API Base URL
                </label>
                <input
                  type="url"
                  value={settings.api.apiBaseUrl}
                  onChange={(e) => handleSettingChange('api', 'apiBaseUrl', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Rate Limit (requests per window)
                  </label>
                  <input
                    type="number"
                    value={settings.api.rateLimit}
                    onChange={(e) => handleSettingChange('api', 'rateLimit', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Rate Limit Window (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.api.rateLimitWindow}
                    onChange={(e) => handleSettingChange('api', 'rateLimitWindow', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Cache TTL (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.api.cacheTTL}
                    onChange={(e) => handleSettingChange('api', 'cacheTTL', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
                <div className="flex items-center h-full pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.api.enableCaching}
                      onChange={(e) => handleSettingChange('api', 'enableCaching', e.target.checked)}
                      className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-slate-700">Enable API response caching</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Backup Settings */}
          {activeTab === 'backup' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-800">Automatic Backups</p>
                  <p className="text-[10px] text-slate-500">Schedule regular database backups</p>
                </div>
                <button
                  onClick={() => handleSettingChange('backup', 'autoBackup', !settings.backup.autoBackup)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${settings.backup.autoBackup ? 'bg-cyan-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.backup.autoBackup ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.backup.backupFrequency}
                    onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                    disabled={!settings.backup.autoBackup}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Backup Time (UTC)
                  </label>
                  <input
                    type="time"
                    value={settings.backup.backupTime}
                    onChange={(e) => handleSettingChange('backup', 'backupTime', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                    disabled={!settings.backup.autoBackup}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                  Retention Period (days)
                </label>
                <input
                  type="number"
                  value={settings.backup.retentionDays}
                  onChange={(e) => handleSettingChange('backup', 'retentionDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                />
              </div>
              
              <div className="pt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm font-semibold hover:bg-cyan-700 transition">
                  <Database size={14} />
                  Run Backup Now
                </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    value={settings.security.passwordExpiryDays}
                    onChange={(e) => handleSettingChange('security', 'passwordExpiryDays', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
                <div className="flex items-center h-full pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.requireStrongPassword}
                      onChange={(e) => handleSettingChange('security', 'requireStrongPassword', e.target.checked)}
                      className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-slate-700">Require strong passwords</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.email.smtpHost}
                    onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    From Email
                  </label>
                  <input
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    From Name
                  </label>
                  <input
                    type="text"
                    value={settings.email.fromName}
                    onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={settings.email.smtpSecure}
                  onChange={(e) => handleSettingChange('email', 'smtpSecure', e.target.checked)}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-slate-700">Use secure connection (SSL/TLS)</span>
              </div>
              
              <div className="pt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm font-semibold hover:bg-cyan-700 transition">
                  <Mail size={14} />
                  Send Test Email
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw size={16} />
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
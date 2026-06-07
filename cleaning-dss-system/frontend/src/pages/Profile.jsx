import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Building2, 
  Settings, 
  BarChart3, 
  Calendar, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Download,
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Bell,
  Lock,
  Palette,
  Database,
  ArrowLeft,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getRecommendationHistory } from '../services/recommendationHistoryService';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('company');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRecommendations: 0,
    savedReports: 0,
    activeMachines: 0,
    pendingAlerts: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);

  // User data from auth context
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    companyName: '',
    companyRegNo: '',
    industry: 'Commercial Cleaning',
    employees: '',
    founded: '',
    location: '',
    website: '',
    bio: '',
    notifications: true,
    twoFactor: false,
    theme: 'light'
  });

  const [editableData, setEditableData] = useState(userData);

  useEffect(() => {
    setFadeIn(true);
    
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Load user data from auth context
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.username || user.fullName || '',
        email: user.email || '',
        phone: user.phone || '+256 XXX XXX XXX',
        role: user.role === 'company_owner' ? 'Company Owner / Operations Manager' : 
               user.role === 'admin' ? 'System Administrator' :
               user.role === 'procurement_officer' ? 'Procurement Officer' :
               user.role === 'technician' ? 'Technician / Maintenance' :
               user.role === 'supervisor' ? 'Cleaning Supervisor' : 'User',
        companyName: user.companyName || user.organization || 'Your Company',
        companyRegNo: user.companyRegNo || 'REG-2024-001',
        industry: user.industry || 'Commercial Cleaning',
        employees: user.employees || '25',
        founded: user.founded || '2020',
        location: user.location || 'Kampala, Uganda',
        website: user.website || 'https://',
        bio: user.bio || 'Professional cleaning service provider specializing in commercial and industrial spaces.',
        notifications: user.notifications !== false,
        twoFactor: user.twoFactor || false,
        theme: user.theme || 'light'
      });
      setEditableData({
        name: user.username || user.fullName || '',
        email: user.email || '',
        phone: user.phone || '+256 XXX XXX XXX',
        role: user.role === 'company_owner' ? 'Company Owner / Operations Manager' : 
               user.role === 'admin' ? 'System Administrator' :
               user.role === 'procurement_officer' ? 'Procurement Officer' :
               user.role === 'technician' ? 'Technician / Maintenance' :
               user.role === 'supervisor' ? 'Cleaning Supervisor' : 'User',
        companyName: user.companyName || user.organization || 'Your Company',
        companyRegNo: user.companyRegNo || 'REG-2024-001',
        industry: user.industry || 'Commercial Cleaning',
        employees: user.employees || '25',
        founded: user.founded || '2020',
        location: user.location || 'Kampala, Uganda',
        website: user.website || 'https://',
        bio: user.bio || 'Professional cleaning service provider specializing in commercial and industrial spaces.',
        notifications: user.notifications !== false,
        twoFactor: user.twoFactor || false,
        theme: user.theme || 'light'
      });
    }
  }, [user]);

  // Load stats and recent activities
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        // Fetch recommendation history
        const response = await getRecommendationHistory({ page: 1, limit: 10 });
        const recommendations = response.data.data?.recommendations || [];
        
        // Calculate stats
        const savedCount = recommendations.filter(r => r.saved).length;
        const totalCount = response.data.data?.total || recommendations.length;
        
        setStats({
          totalRecommendations: totalCount,
          savedReports: savedCount,
          activeMachines: 12, // This could come from another API
          pendingAlerts: recommendations.filter(r => r.alerts && r.alerts.length > 0).length
        });
        
        // Format recent activities
        const activities = recommendations.slice(0, 5).map(rec => ({
          action: `Generated recommendation for ${rec.surface_type || 'cleaning'} task`,
          date: new Date(rec.created_at).toLocaleDateString(),
          type: 'recommendation'
        }));
        
        setRecentActivities(activities);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
        // Set default stats
        setStats({
          totalRecommendations: 0,
          savedReports: 0,
          activeMachines: 0,
          pendingAlerts: 0
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserStats();
  }, [isAuthenticated]);

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      const updatedUser = {
        ...user,
        username: editableData.name,
        companyName: editableData.companyName,
        phone: editableData.phone,
        industry: editableData.industry,
        employees: editableData.employees,
        location: editableData.location,
        website: editableData.website,
        bio: editableData.bio,
        notifications: editableData.notifications
      };
      updateUser(updatedUser);
      setUserData(editableData);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditableData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCancelEdit = () => {
    setEditableData(userData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.03)_0px,_rgba(59,130,246,0.03)_2px,_transparent_2px,_transparent_20px)]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition" />
          <span className="text-sm">Back to Dashboard</span>
        </button>
        
        {/* Profile Header */}
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition">
                  <Edit2 size={12} />
                </button>
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editableData.name}
                  onChange={handleChange}
                  className="text-2xl font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 mb-1"
                />
              ) : (
                <h1 className="text-2xl font-bold text-slate-800">{userData.name}</h1>
              )}
              <p className="text-sm text-blue-600 font-mono">{userData.role}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Mail size={12} /> {userData.email}</span>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editableData.phone}
                    onChange={handleChange}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5"
                  />
                ) : (
                  <span className="flex items-center gap-1"><Phone size={12} /> {userData.phone}</span>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={editableData.location}
                    onChange={handleChange}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5"
                  />
                ) : (
                  <span className="flex items-center gap-1"><MapPin size={12} /> {userData.location}</span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Sub‑Navigation Tabs */}
        <div className={`border-b border-slate-200 mb-8 transition-all duration-700 delay-100 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'company', label: 'Company Details', icon: <Building2 size={16} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-700 border-t border-l border-r border-slate-200 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-lg p-6 lg:p-8 transition-all duration-700 delay-200 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          
          {/* ======================= COMPANY DETAILS TAB ======================= */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Building2 size={20} /> Company Information</h2>
                <div className="flex gap-2">
                  {isEditing && (
                    <button 
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                    >
                      <X size={14} /> Cancel
                    </button>
                  )}
                  <button 
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-xs font-bold hover:shadow-md transition"
                  >
                    {isEditing ? <Save size={14} /> : <Edit2 size={14} />}
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Company Name</label>
                    {isEditing ? (
                      <input type="text" name="companyName" value={editableData.companyName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                    ) : (
                      <p className="text-slate-700 font-medium">{userData.companyName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Registration Number</label>
                    <p className="text-slate-700 font-medium">{userData.companyRegNo}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Industry</label>
                    {isEditing ? (
                      <input type="text" name="industry" value={editableData.industry} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                    ) : (
                      <p className="text-slate-700">{userData.industry}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Number of Employees</label>
                    {isEditing ? (
                      <input type="text" name="employees" value={editableData.employees} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                    ) : (
                      <p className="text-slate-700">{userData.employees}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Founded</label>
                    {isEditing ? (
                      <input type="text" name="founded" value={editableData.founded} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                    ) : (
                      <p className="text-slate-700">{userData.founded}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Location</label>
                    {isEditing ? (
                      <input type="text" name="location" value={editableData.location} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                    ) : (
                      <p className="text-slate-700">{userData.location}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Website</label>
                    {isEditing ? (
                      <input type="url" name="website" value={editableData.website} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                    ) : (
                      <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{userData.website}</a>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Company Bio</label>
                    {isEditing ? (
                      <textarea name="bio" rows="3" value={editableData.bio} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none" />
                    ) : (
                      <p className="text-slate-600 text-sm">{userData.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= SETTINGS TAB ======================= */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Bell size={18} /> Notifications</h2>
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition">
                  <div>
                    <span className="font-bold text-slate-700">Email Recommendations</span>
                    <p className="text-[10px] text-slate-400">Receive weekly match summaries and updates</p>
                  </div>
                  <button
                    onClick={() => {
                      const newValue = !editableData.notifications;
                      setEditableData(prev => ({ ...prev, notifications: newValue }));
                      if (!isEditing) {
                        updateUser({ ...user, notifications: newValue });
                        setUserData(prev => ({ ...prev, notifications: newValue }));
                      }
                    }}
                    className={`relative w-10 h-5 rounded-full transition-colors ${editableData.notifications ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${editableData.notifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </label>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Lock size={18} /> Security</h2>
                <div className="space-y-4">
                  <button className="w-full md:w-auto px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition flex items-center gap-2">
                    <Lock size={14} /> Change Password
                  </button>
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition">
                    <div>
                      <span className="font-bold text-slate-700">Two-Factor Authentication</span>
                      <p className="text-[10px] text-slate-400">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      onClick={() => {
                        const newValue = !editableData.twoFactor;
                        setEditableData(prev => ({ ...prev, twoFactor: newValue }));
                      }}
                      className={`relative w-10 h-5 rounded-full transition-colors ${editableData.twoFactor ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${editableData.twoFactor ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Palette size={18} /> Appearance</h2>
                <div className="flex gap-3">
                  {['light', 'dark', 'system'].map(theme => (
                    <button 
                      key={theme} 
                      onClick={() => {
                        setEditableData(prev => ({ ...prev, theme }));
                        if (!isEditing) {
                          updateUser({ ...user, theme });
                          setUserData(prev => ({ ...prev, theme }));
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                        editableData.theme === theme ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button className="px-6 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition flex items-center gap-2">
                  Delete Account
                </button>
                <p className="text-[10px] text-slate-400 mt-2">This action is irreversible. All your data will be permanently removed.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
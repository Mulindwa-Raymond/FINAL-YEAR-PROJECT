import React, { useState } from 'react';
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
  Database
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, company, settings
  const [isEditing, setIsEditing] = useState(false);
  
  // User/Company data (mock – replace with real data from backend)
  const [userData, setUserData] = useState({
    name: 'Raymond Okoth',
    email: 'raymond@cleanmatch.ug',
    phone: '+256 712 345 678',
    role: 'Company Owner / Operations Manager',
    companyName: 'Kweeeza Cleaning Services',
    companyRegNo: 'KCCA-2024-0789',
    industry: 'Commercial Cleaning',
    employees: '45',
    founded: '2018',
    location: 'Kampala Industrial Area, Uganda',
    website: 'https://kweeezacleaning.ug',
    bio: 'Leading cleaning service provider in Kampala, specialising in industrial and commercial spaces.',
    notifications: true,
    twoFactor: false,
    theme: 'light'
  });

  const [editableData, setEditableData] = useState(userData);

  const handleEdit = () => {
    if (isEditing) {
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

  // Mock stats for dashboard
  const stats = [
    { label: 'Total Recommendations', value: '24', icon: <BarChart3 size={18} />, change: '+12%', trend: 'up' },
    { label: 'Saved Reports', value: '8', icon: <CheckCircle2 size={18} />, change: '+3', trend: 'up' },
    { label: 'Active Machines', value: '12', icon: <Database size={18} />, change: '2 new', trend: 'up' },
    { label: 'Pending Alerts', value: '1', icon: <AlertTriangle size={18} />, change: '-2', trend: 'down' }
  ];

  const recentActivities = [
    { action: 'Generated recommendation for Kampala Central Office', date: '2026-04-02', type: 'recommendation' },
    { action: 'Exported TCO report', date: '2026-03-28', type: 'export' },
    { action: 'Updated company profile', date: '2026-03-25', type: 'profile' },
    { action: 'Compared Kärcher vs Numatic machines', date: '2026-03-20', type: 'compare' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-cyan-200">
      {/* Tech background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,0.4)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: `radial-gradient(#0ea5e9 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img 
                src="https://ui-avatars.com/api/?name=Raymond+Okoth&background=0ea5e9&color=fff&size=96&rounded=true" 
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 p-1.5 bg-cyan-600 rounded-full text-white hover:bg-cyan-700 transition">
                <Edit2 size={12} />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-black text-slate-800">{userData.name}</h1>
              <p className="text-sm text-cyan-600 font-mono">{userData.role}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Mail size={12} /> {userData.email}</span>
                <span className="flex items-center gap-1"><Phone size={12} /> {userData.phone}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {userData.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub‑Navigation Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={16} /> },
              { id: 'company', label: 'Company Details', icon: <Building2 size={16} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-cyan-700 border-t border-l border-r border-slate-200 shadow-sm' 
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 lg:p-8">
          
          {/* ======================= DASHBOARD TAB ======================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700">
                        {stat.icon}
                      </div>
                      <span className={`text-xs font-bold flex items-center gap-1 ${
                        stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} /> Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivities.map((act, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-cyan-600 border border-slate-200">
                          {act.type === 'recommendation' && <CheckCircle2 size={14} />}
                          {act.type === 'export' && <Download size={14} />}
                          {act.type === 'profile' && <User size={14} />}
                          {act.type === 'compare' && <BarChart3 size={14} />}
                        </div>
                        <span className="text-sm text-slate-700">{act.action}</span>
                      </div>
                      <span className="text-xs text-slate-400">{act.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4">
                <h2 className="text-lg font-black text-slate-800 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                  <button className="px-5 py-2.5 bg-cyan-600 text-white rounded-xl text-xs font-bold hover:bg-cyan-700 transition flex items-center gap-2">
                    <Download size={14} /> Export All Data
                  </button>
                  <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition flex items-center gap-2">
                    <Calendar size={14} /> Schedule Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================= COMPANY DETAILS TAB ======================= */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><Building2 size={20} /> Company Information</h2>
                <button 
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold hover:bg-cyan-700 transition"
                >
                  {isEditing ? <Save size={14} /> : <Edit2 size={14} />}
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Company Name</label>
                    {isEditing ? (
                      <input type="text" name="companyName" value={editableData.companyName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" />
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
                      <input type="text" name="industry" value={editableData.industry} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" />
                    ) : (
                      <p className="text-slate-700">{userData.industry}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Number of Employees</label>
                    {isEditing ? (
                      <input type="text" name="employees" value={editableData.employees} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" />
                    ) : (
                      <p className="text-slate-700">{userData.employees}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Founded</label>
                    {isEditing ? (
                      <input type="text" name="founded" value={editableData.founded} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" />
                    ) : (
                      <p className="text-slate-700">{userData.founded}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Location</label>
                    {isEditing ? (
                      <input type="text" name="location" value={editableData.location} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" />
                    ) : (
                      <p className="text-slate-700">{userData.location}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Website</label>
                    {isEditing ? (
                      <input type="url" name="website" value={editableData.website} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" />
                    ) : (
                      <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">{userData.website}</a>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Company Bio</label>
                    {isEditing ? (
                      <textarea name="bio" rows="3" value={editableData.bio} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm" />
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
                <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Bell size={18} /> Notifications</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-700">Email Recommendations</span>
                      <p className="text-[10px] text-slate-400">Receive weekly match summaries</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" checked={userData.notifications} className="sr-only peer" />
                      <div className="w-10 h-5 bg-slate-200 rounded-full peer-checked:bg-cyan-600 transition-colors"></div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Lock size={18} /> Security</h2>
                <div className="space-y-4">
                  <button className="w-full md:w-auto px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition flex items-center gap-2">
                    Change Password
                  </button>
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-700">Two-Factor Authentication</span>
                      <p className="text-[10px] text-slate-400">Add an extra layer of security</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" checked={userData.twoFactor} className="sr-only peer" />
                      <div className="w-10 h-5 bg-slate-200 rounded-full peer-checked:bg-cyan-600 transition-colors"></div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Palette size={18} /> Appearance</h2>
                <div className="flex gap-4">
                  {['light', 'dark', 'system'].map(theme => (
                    <button key={theme} className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                      userData.theme === theme ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>
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
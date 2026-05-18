/**
 * AdminLayout.jsx
 * 
 * Main layout wrapper for the admin portal.
 * Features:
 * - Fixed background with radial gradient and animated orbs
 * - Sidebar with navigation links (role-based visibility)
 * - Top appbar with page title, user info, and logout
 * - Responsive: sidebar collapsible on mobile
 */

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Coins,
  History,
  Upload,
  GraduationCap,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  FlaskConical,
  Gavel,
  Activity,
  Bell,
  Search,
  User as UserIcon,
  ChevronDown,
  Settings,
  HelpCircle,
  HeartHandshake,
  Shield
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout, isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const dropdownRef = useRef(null);

  const getPageTitle = (path) => {
    const routes = {
      '/admin': 'Dashboard',
      '/admin/users': 'User Management',
      '/admin/equipment': 'Equipment Management',
      '/admin/detergents': 'Detergent Management',
      '/admin/rules': 'Rule Management',
      '/admin/compatibility': 'Compatibility Management',
      '/admin/tco': 'TCO Multipliers',
      '/admin/audit': 'Audit Logs',
      '/admin/metrics': 'System Metrics',
      '/admin/upload': 'Bulk Upload',
      '/admin/training': 'Training Materials',
      '/admin/history': 'Recommendation History',
      '/admin/feedback': 'User Feedback',
    };
    return routes[path] || 'Admin Portal';
  };

  useEffect(() => {
    setPageTitle(getPageTitle(location.pathname));
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Navigation items with role-based visibility
  const allNavItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'super_admin'] },
    { path: '/admin/users', label: 'Users', icon: Users, roles: ['super_admin'] }, // Only super_admin
    { path: '/admin/equipment', label: 'Equipment', icon: ShoppingCart, roles: ['admin', 'super_admin'] },
    { path: '/admin/detergents', label: 'Detergents', icon: FlaskConical, roles: ['admin', 'super_admin'] },
    { path: '/admin/rules', label: 'Rules', icon: Gavel, roles: ['admin', 'super_admin'] },
    { path: '/admin/compatibility', label: 'Compatibility', icon: HeartHandshake, roles: ['admin', 'super_admin'] },
    { path: '/admin/tco', label: 'TCO Multipliers', icon: Coins, roles: ['admin', 'super_admin'] },
    { path: '/admin/audit', label: 'Audit Logs', icon: History, roles: ['admin', 'super_admin'] },
    { path: '/admin/metrics', label: 'Metrics', icon: Activity, roles: ['admin', 'super_admin'] },
    { path: '/admin/upload', label: 'Bulk Upload', icon: Upload, roles: ['admin', 'super_admin'] },
    { path: '/admin/training', label: 'Training', icon: GraduationCap, roles: ['admin', 'super_admin'] },
    { path: '/admin/history', label: 'History', icon: FileText, roles: ['admin', 'super_admin'] },
    { path: '/admin/feedback', label: 'Feedback', icon: HeartHandshake, roles: ['admin', 'super_admin'] },
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => {
    if (isSuperAdmin) return true;
    if (isAdmin) return item.roles.includes('admin');
    return false;
  });

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,0.4)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white/80 backdrop-blur-md rounded-xl shadow-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-white/40 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200/50">
            <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Clean Match
            </h1>
            <p className="text-xs text-slate-500 mt-1">Admin Portal</p>
            <div className="mt-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-medium text-slate-600 capitalize">{user?.role?.replace('_', ' ')}</span>
            </div>
          </div>
          <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-200/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-72 relative z-10 flex flex-col h-screen">
        {/* Top Appbar - Fixed */}
        <header className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4">
            <h2 className="text-lg lg:text-xl font-bold text-slate-800 hidden lg:block">{pageTitle}</h2>
            <div className="lg:hidden w-8"></div>

            <div className="flex items-center gap-3 lg:gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-3 py-1.5">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none text-sm ml-2 w-40 lg:w-64" />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 hidden lg:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-30">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-800">{user?.username}</p>
                      <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <UserIcon className="w-4 h-4" /> Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <HelpCircle className="w-4 h-4" /> Help
                    </button>
                    <div className="border-t border-slate-100"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
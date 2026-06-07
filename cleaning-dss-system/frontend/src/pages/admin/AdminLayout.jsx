/**
 * AdminLayout.jsx
 * 
 * Main layout wrapper for the admin portal.
 * Features:
 * - Collapsible sidebar (icons only when collapsed, detailed when expanded)
 * - Sidebar top section matches appbar height
 * - Flat button design (no gradients, clean flat style)
 * - Fixed background with radial gradient and animated orbs
 * - Top appbar with page title, user info, and logout
 * - Responsive: sidebar collapsible on desktop and mobile
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
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout, isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('admin_sidebar_collapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('admin_sidebar_collapsed', newState);
  };

  const allNavItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'super_admin'] },
    { path: '/admin/users', label: 'Users', icon: Users, roles: ['super_admin'] },
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

  const navItems = allNavItems.filter(item => {
    if (isSuperAdmin) return true;
    if (isAdmin) return item.roles.includes('admin');
    return false;
  });

  // Sidebar width classes
  const sidebarWidth = sidebarCollapsed ? 'w-20' : 'w-72';
  const mainMargin = sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72';

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 relative flex">
      
      {/* Background stays fixed */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,0.4)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-xl shadow-lg border border-slate-200"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
        </button>
      </div>

      {/* Sidebar - Collapsible */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-full ${sidebarWidth} bg-white/90 backdrop-blur-xl border-r border-slate-200 shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section - height matches appbar (py-3 + py-4 = ~56px) */}
          <div className={`py-4 px-4 border-b border-slate-200/50 flex items-center justify-between ${sidebarCollapsed ? 'flex-col' : ''}`}>
            {!sidebarCollapsed ? (
              <>
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Clean Match
                  </h1>
                  <p className="text-[10px] text-slate-400 mt-0.5">Admin Portal</p>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center w-full">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="mt-3 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Expand sidebar"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700 border-l-3 border-cyan-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`w-5 h-5 ${!sidebarCollapsed ? '' : 'mx-auto'}`} />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* User info & Logout (visible only when expanded) */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-slate-200/50">
              <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user?.username}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className={`flex-1 ${mainMargin} relative z-10 flex flex-col h-full overflow-hidden transition-all duration-300`}>
        
        {/* Top Appbar */}
        <header className="sticky top-0 z-30 flex-shrink-0 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-3">
            {/* Mobile: Menu button, Desktop: Page title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <h2 className="text-lg lg:text-xl font-bold text-slate-800">{pageTitle}</h2>
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none text-sm ml-2 w-40 lg:w-64" />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 hidden lg:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-bold text-slate-800">{user?.username}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{user?.role?.replace('_', ' ')}</p>
                      <p className="text-xs text-slate-400 truncate mt-1">{user?.email}</p>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <UserIcon className="w-4 h-4 text-slate-400" /> Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <Settings className="w-4 h-4 text-slate-400" /> Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <HelpCircle className="w-4 h-4 text-slate-400" /> Help
                    </button>
                    <div className="border-t border-slate-100"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
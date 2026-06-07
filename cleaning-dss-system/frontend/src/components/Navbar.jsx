/**
 * Navbar.jsx
 * * Top navigation component for Clean Match DSS.
 * * Features:
 * - Persistent responsive header with scroll-reactive backdrop blur
 * - Consolidated navigation links matching core portal features
 * - Conditional profile panel and authentication action states
 * - Profile icon with dropdown menu for dashboard access
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Home, 
  History, 
  GraduationCap, 
  Info,
  LogOut,
  ChevronDown,
  UserPlus,
  LogIn,
  User,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.profile-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const navItems = [
    { name: 'Home', icon: <Home size={15} />, path: '/', protected: false },
    { name: 'Match History', icon: <History size={15} />, path: '/history', protected: true },
    { name: 'Operator Training', icon: <GraduationCap size={15} />, path: '/training', protected: false },
    { name: 'About System', icon: <Info size={15} />, path: '/about', protected: false },
  ];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  const goToDashboard = () => {
    setDropdownOpen(false);
    navigate('/dashboard');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  // Get user display name
  const getDisplayName = () => {
    if (user?.username) return user.username;
    if (user?.fullName) return user.fullName.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Get user avatar initial
  const getUserInitial = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-3.5 bg-white/85 backdrop-blur-md border-b border-slate-200 shadow-xs' 
        : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo / Decision Support System Anchor */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:bg-blue-700">
            <ShieldCheck size={18} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900">
              Clean<span className="text-blue-600">Match</span>
            </span>
            <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
              Decision Support System
            </span>
          </div>
        </Link>

        {/* Unified Portal Navigation Menu */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-200/50 rounded-xl p-1 border border-slate-200/40">
          {navItems.map((item) => {
            // Hide protected routes when not authenticated
            if (item.protected && !isAuthenticated) return null;
            
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right Action Block: Identity & Authentication Routing */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Profile Account Summary Button with Dropdown */}
              <div className="relative profile-dropdown">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="hidden sm:flex flex-col items-end text-left hover:opacity-90 transition group"
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    {getDisplayName()}
                    <ChevronDown size={13} className={`text-slate-400 group-hover:text-slate-600 transition-colors duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-medium text-slate-500 uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {user?.role === 'admin' ? 'Administrator' : user?.companyName || 'Facility Manager'}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-bold text-slate-800">{user?.username || user?.fullName}</p>
                      <p className="text-[9px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={goToDashboard}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <LayoutDashboard size={14} />
                        Dashboard
                      </button>
                      <button
                        onClick={goToProfile}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <User size={14} />
                        Profile Settings
                      </button>
                      <Link
                        to="/history"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <History size={14} />
                        Match History
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Image Wrapper */}
              <button onClick={goToDashboard} className="relative group focus:outline-hidden">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 shadow-xs p-0.5 bg-white group-hover:border-slate-300 transition-colors">
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                    {getUserInitial()}
                  </div>
                </div>
              </button>
            </>
          ) : (
            // Enterprise Sign In / Sign Up Callouts
            <div className="flex items-center gap-2.5">
              <button
                onClick={goToLogin}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2"
              >
                <LogIn size={13} /> Sign In
              </button>
              <button
                onClick={goToSignup}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2"
              >
                <UserPlus size={13} /> Register Company
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
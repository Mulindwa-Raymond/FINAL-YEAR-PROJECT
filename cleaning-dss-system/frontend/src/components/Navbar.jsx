import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Home, 
  RotateCcw, 
  History, 
  GraduationCap, 
  Info,
  LogOut,
  ChevronDown,
  Cpu,
  UserPlus,
  LogIn
} from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Authentication state – in a real app this would come from a global store (e.g., React Context, Redux)
  // For demo purposes, we set isLoggedIn to false. Change to true to see logged-in view.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items (same for both states)
  const navItems = [
    { name: 'Home', icon: <Home size={14} />, path: '/' },
    { name: 'Recommendation', icon: <RotateCcw size={14} />, path: '/recommendation' },
    { name: 'History', icon: <History size={14} />, path: '/history' },
    { name: 'Training', icon: <GraduationCap size={14} />, path: '/training' },
    { name: 'About', icon: <Info size={14} />, path: '/about' },
  ];

  const handleLogout = () => {
    // Clear auth tokens, update global state, then redirect
    setIsLoggedIn(false);
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'py-3 bg-white/80 backdrop-blur-xl border-b border-blue-200/60 shadow-sm' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo / Home Link */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:shadow-cyan-200 group-hover:-translate-y-0.5">
            <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">
              Clean<span className="text-cyan-600">Match</span>
            </span>
            <span className="text-[8px] font-mono font-bold uppercase tracking-[0.4em] text-slate-400">
              SMART SYSTEM
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 rounded-2xl p-1 border border-slate-200/60 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-mono font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-white text-cyan-600 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {item.icon}
                {item.name.toUpperCase()}
              </Link>
            );
          })}
        </div>

        {/* Right side: Conditional rendering based on login state */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            // Logged-in view: profile info + logout
            <>
              {/* Clickable user info that navigates to profile */}
              <button onClick={goToProfile} className="hidden sm:flex flex-col items-end text-left hover:opacity-80 transition">
                <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                  Raymond O.
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-600 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                  KAMPALA_UG
                </div>
              </button>

              <button onClick={goToProfile} className="relative group">
                <div className="w-10 h-10 rounded-xl p-0.5 bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-md transition-transform group-hover:rotate-3">
                  <div className="w-full h-full rounded-[9px] bg-white overflow-hidden border border-white/20">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </button>

              <button onClick={handleLogout} className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            // Logged-out view: Sign Up + Login buttons
            <div className="flex items-center gap-3">
              <button
                onClick={goToLogin}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-cyan-300 transition-all flex items-center gap-2"
              >
                <LogIn size={14} /> Sign In
              </button>
              <button
                onClick={goToSignup}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <UserPlus size={14} /> Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
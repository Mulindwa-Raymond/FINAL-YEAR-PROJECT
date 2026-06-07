import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  LogIn,
  ArrowRight,
  Shield,
  Zap,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFadeIn(true);
    
    // Check for signup success message
    if (location.state?.signupSuccess) {
      setSuccessMessage(`Account created successfully! Please login with ${location.state.email || 'your email'}`);
    }
    
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [location, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      await login({
        email: formData.email,
        password: formData.password
      });
      
      // Redirect to dashboard or previous page
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      setApiError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.03)_0px,_rgba(59,130,246,0.03)_2px,_transparent_2px,_transparent_20px)]"></div>
      </div>

      <main className="relative z-10 max-w-md mx-auto px-6 py-8 lg:py-12">
        
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 shadow-sm mb-5">
            <Building2 size={12} className="text-blue-600" />
            <span className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider">CleanMatch DSS</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Welcome{' '}
            <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Back</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Sign in to access your intelligent equipment matching dashboard
          </p>
        </div>

        {/* Form Card */}
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-xl p-8 transition-all duration-700 delay-100 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}
          
          {/* Error Message */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500" />
              <span>{apiError}</span>
            </div>
          )}
          
          {/* Features Badge */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={10} className="text-emerald-500" />
              <span className="text-[9px] text-slate-400">Secure Login</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <div className="flex items-center gap-1.5">
              <Zap size={10} className="text-amber-500" />
              <span className="text-[9px] text-slate-400">Real-time Matching</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`
                    w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl text-sm 
                    outline-none transition-all focus:ring-2 focus:ring-offset-0
                    placeholder:text-slate-400
                    ${errors.email 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'}
                  `}
                  placeholder="name@company.ug"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <span className="text-red-500">●</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`
                    w-full pl-11 pr-12 py-3.5 bg-slate-50 border-2 rounded-xl text-sm 
                    outline-none transition-all focus:ring-2 focus:ring-offset-0
                    placeholder:text-slate-400
                    ${errors.password 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'}
                  `}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <span className="text-red-500">●</span> {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-[10px] font-mono font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wider transition">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-[9px] font-mono text-slate-400">New to CleanMatch?</span>
            </div>
          </div>

          {/* Signup Link */}
          <Link
            to="/signup"
            className="block w-full py-3.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-sm text-center transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            Create an Account <ArrowRight size={14} className="inline ml-1" />
          </Link>
        </div>

        {/* Security Note */}
        <div className={`mt-6 text-center flex items-center justify-center gap-4 transition-all duration-700 delay-200 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-1.5">
            <Shield size={12} className="text-emerald-500" />
            <span className="text-[9px] text-slate-400">256-bit SSL Encrypted</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-blue-500" />
            <span className="text-[9px] text-slate-400">KB-DSS Engine Ready</span>
          </div>
        </div>
      </main>
    </div>
  );
}
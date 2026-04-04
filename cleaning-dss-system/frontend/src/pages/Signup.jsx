import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Eye, 
  EyeOff,
  UserPlus,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import Navbar from '../components/Navbar';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    role: 'company_owner',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'company_owner', label: 'Company Owner / Manager' },
    { value: 'procurement_officer', label: 'Procurement Officer' },
    { value: 'technician', label: 'Technician / Maintenance' },
    { value: 'supervisor', label: 'Cleaning Supervisor' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
    // Simulate API call
    setTimeout(() => {
      console.log('Signup data:', formData);
      setIsLoading(false);
      // On success, redirect to login or dashboard
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-cyan-200">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,0.4)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#0ea5e9 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-md mx-auto px-6 py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 border border-cyan-200 text-cyan-700 text-[10px] font-mono font-bold tracking-[0.2em] uppercase rounded-full mb-4">
            <UserPlus size={12} /> Join CleanMatch
          </div>
          <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-2">Get started with intelligent equipment matching</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-2xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                    errors.fullName ? 'border-red-400' : 'border-slate-200 focus:border-cyan-400'
                  }`}
                  placeholder="John Muwanga"
                />
              </div>
              {errors.fullName && <p className="text-[10px] text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                    errors.email ? 'border-red-400' : 'border-slate-200 focus:border-cyan-400'
                  }`}
                  placeholder="name@company.ug"
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Company / Organisation</label>
              <div className="relative">
                <Building2 size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                    errors.companyName ? 'border-red-400' : 'border-slate-200 focus:border-cyan-400'
                  }`}
                  placeholder="Kweeeza Cleaning Services"
                />
              </div>
              {errors.companyName && <p className="text-[10px] text-red-500 mt-1">{errors.companyName}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Your Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-cyan-400 transition-all appearance-none"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                    errors.password ? 'border-red-400' : 'border-slate-200 focus:border-cyan-400'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password}</p>}
              <p className="text-[9px] text-slate-400 mt-1">Min. 8 characters, includes letters & numbers</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                    errors.confirmPassword ? 'border-red-400' : 'border-slate-200 focus:border-cyan-400'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} /> Create Account
                </>
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-[10px] text-center text-slate-400 mt-6">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-cyan-600 hover:underline">Terms of Service</Link> and{' '}
            <Link to="/privacy" className="text-cyan-600 hover:underline">Privacy Policy</Link>
          </p>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white/80 text-slate-400">already registered?</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-500">
            Have an account?{' '}
            <Link to="/login" className="text-cyan-600 font-bold hover:text-cyan-700 transition">
              Sign in <ArrowRight size={14} className="inline" />
            </Link>
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-8 text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
          <Shield size={12} /> Your data is encrypted and secure
        </div>
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
      `}</style>
    </div>
  );
}
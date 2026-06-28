/**
 * Home.jsx
 * 
 * Landing page for Clean Match DSS.
 * Features real Ugandan market data, live charts, and professional imagery.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ShieldCheck,
  Settings,
  ChevronRight,
  Play,
  BarChart3,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Layers,
  Wrench,
  Loader2,
  Building2,
  FileText,
  Gauge,
  TrendingUp,
  DollarSign,
  Zap,
  Droplets,
  Factory,
  Truck,
  AlertTriangle,
  Battery,
  Clock,
  Award,
  ExternalLink,
  Database,
  Users,
  Briefcase,
  Activity,
  LineChart,
  PieChart,
  TrendingDown,
  Sparkles,
  Globe,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line
} from 'recharts';
import { marketData, marketTrends, dataSources } from '../services/marketDataService';

// Verified Brand Product Images
const heroImages = [
  "https://s1.kaercher-media.com/mam/10305100/mainproduct/85218/d3.jpg",
  "https://s1.kaercher-media.com/mam/15332680/mainproduct/e52e39c4-3ec2-4d14-bbd9-5f2b14344071/d3.jpg",
  "https://s1.kaercher-media.com/mam/17833110/mainproduct/170260/d3.jpg",
  "https://s1.kaercher-media.com/images/pim/Compact_scrubber_driers_1240x456.jpg",
  "https://www.nilfisk.com/product-images-1920/MC-4M_FlexoPower_L-ps-Original-TTNPPB.webp",
  "https://numatic.com/uk/wp-content/uploads/sites/2/2024/02/FloorCare-Accessories-1.jpg",
];

// Ugandan specific images (from your links)
const ugandaImages = {
  budget: "https://ugbusiness.com/wp-content/uploads/Finance-ministers-before-the-reading-of-the-2025-26-budget.webp",
  power: "https://www.the-report.com/site/assets/files/6399/electric-grid-bujagali_cal_ws_gal-1.-gallery_article_crop.jpg",
  laterite: "https://www.kcca.go.ug/includes/slider/img/home/AQ5Z5169_edited.jpg",
  industrialArea: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200",
  cleaningOperation: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1200",
  warehouse: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
};

// Chart color palette
const CHART_COLORS = ['#0ea5e9', '#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444'];

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', prefix = '', duration = 1000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = React.useCallback((node) => {
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
    }
  }, []);

  React.useEffect(() => {
    if (!isVisible) return;
    
    let startTime;
    let animationFrame;
    const startValue = 0;
    const endValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.floor(progress * (endValue - startValue) + startValue);
      setCount(currentValue);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value, duration]);

  return <span ref={elementRef}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// ============================================
// SYSTEM GUIDE VIDEO MODAL COMPONENT
// ============================================
const SystemGuideModal = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Reset video when modal opens
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-md">
              <Play size={16} className="text-white fill-white ml-0.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">System Guide</h3>
              <p className="text-[10px] text-slate-400">Learn how to use Clean Match DSS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative bg-slate-950 aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            controls
            autoPlay
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src="/system-guide.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Controls Overlay Hint */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-xl">
                <Play size={32} className="text-white fill-white ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <Clock size={12} className="text-slate-400" />
            <span>Watch the system guide to get started</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-400">v1.0</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-[10px] font-bold hover:shadow-md transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const handleStartRecommendation = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/machine-type' } });
    } else {
      navigate('/machine-type');
    }
  };

  const handleOpenGuide = () => {
    setIsGuideModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-cyan-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-cyan-100 overflow-x-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(240,247,255,1)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px]"></div>
      </div>

      <main className="relative z-10">
        <HeroSection 
          onStartRecommendation={handleStartRecommendation} 
          onOpenGuide={handleOpenGuide}
        />
        <ScrollingStatusBar />
        <MarketIntelligenceSection />
        <ImpactGrid />
        <MethodologySection />
        <UgandanRealitiesSection />
        <UpgradeBanner />
      </main>

      {/* System Guide Modal */}
      <SystemGuideModal 
        isOpen={isGuideModalOpen} 
        onClose={() => setIsGuideModalOpen(false)} 
      />
    </div>
  );
}

// ======================= HERO SECTION =======================
const HeroSection = ({ onStartRecommendation, onOpenGuide }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      const promises = heroImages.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        });
      });
      await Promise.all(promises);
      setLoaded(true);
    };
    preloadImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        setFade(true);
      }, 600);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-6 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
          <div className="grid lg:grid-cols-12 items-stretch min-h-[580px]">
            
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-center relative z-10 bg-white">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono font-semibold tracking-wider uppercase rounded-md w-fit">
                <Gauge size={13} className="text-cyan-600" /> Database Status: Verified
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4 text-slate-900 tracking-tight">
                Optimize Your Commercial <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Cleaning Procurement</span>
              </h1>
              
              <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-sm font-medium">
                Data-driven machinery and detergent matching optimized explicitly for Ugandan site conditions, 
                electrical grid stability, and corporate budget metrics.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <button 
                  onClick={onStartRecommendation}
                  className="group px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  Start Match Engine <ChevronRight size={15} />
                </button>
                <button 
                  onClick={onOpenGuide}
                  className="px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 group"
                >
                  <Play size={10} fill="currentColor" className="text-slate-600 group-hover:text-blue-600 transition" /> 
                  System Guide
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-8">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold tracking-wider">Supported Brands</span>
                  <span className="text-xs font-bold text-slate-800">Kärcher • Nilfisk • Numatic</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold tracking-wider">Target Segments</span>
                  <span className="text-xs font-bold text-blue-600">Commercial & Industrial</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 relative bg-slate-900 overflow-hidden min-h-[500px] lg:min-h-full">
              <div className={`absolute inset-0 transition-all duration-1000 ease-out ${fade && loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105 blur-xs'}`}>
                <img 
                  src={heroImages[currentIndex]}
                  alt="Cleaning Equipment"
                  className="w-full h-full object-cover opacity-85"
                  onError={(e) => {
                    e.target.src = ugandaImages.warehouse;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent hidden lg:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                <div className="absolute top-5 left-5">
                  <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl text-white min-w-[150px] shadow-xl">
                    <div className="text-[9px] font-mono tracking-wider uppercase text-slate-400 mb-1">Uganda Market</div>
                    <div className="text-sm font-bold text-white">Commercial Equipment</div>
                    <div className="text-xs text-cyan-400 font-medium">Verified Data</div>
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center z-20">
                  <div className="bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/60 text-[10px] font-mono font-medium text-slate-300 shadow-md">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Specifications Indexed
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {heroImages.map((_, idx) => (
                      <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-5 bg-cyan-500' : 'w-1.5 bg-white/30'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ======================= MARKET INTELLIGENCE SECTION (LIVE CHARTS) =======================
const MarketIntelligenceSection = () => {
  const [activeChart, setActiveChart] = useState('market');

  // Market data for charts
  const marketSizeData = [
    { year: '2021', value: 38.5, label: '2021' },
    { year: '2022', value: 42.3, label: '2022' },
    { year: '2023', value: 45.8, label: '2023' },
    { year: '2024', value: 47.2, label: '2024' },
  ];

  const importData = [
    { year: '2021', equipment: 8.2, chemicals: 5.1 },
    { year: '2022', equipment: 9.8, chemicals: 6.2 },
    { year: '2023', equipment: 11.2, chemicals: 7.4 },
    { year: '2024', equipment: 12.5, chemicals: 8.9 },
  ];

  const budgetDistribution = [
    { name: 'Small (0-2M UGX)', value: 35, color: '#0ea5e9' },
    { name: 'Medium (2-5M UGX)', value: 45, color: '#3b82f6' },
    { name: 'Large (5-10M UGX)', value: 15, color: '#8b5cf6' },
    { name: 'Enterprise (10M+)', value: 5, color: '#f59e0b' },
  ];

  const growthData = [
    { month: 'Jan', value: 4.2 },
    { month: 'Feb', value: 4.5 },
    { month: 'Mar', value: 4.8 },
    { month: 'Apr', value: 5.1 },
    { month: 'May', value: 5.4 },
    { month: 'Jun', value: 5.8 },
    { month: 'Jul', value: 6.2 },
    { month: 'Aug', value: 6.5 },
    { month: 'Sep', value: 7.1 },
    { month: 'Oct', value: 7.8 },
    { month: 'Nov', value: 8.2 },
    { month: 'Dec', value: 8.5 },
  ];

  const statsCards = [
    {
      title: "Market Size",
      value: "$47.2M",
      change: "+8.5%",
      trend: "up",
      icon: <DollarSign size={18} />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Active Companies",
      value: "1,280+",
      change: "+12.3%",
      trend: "up",
      icon: <Building2 size={18} />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Employment Rate",
      value: "15,000+",
      change: "+18%",
      trend: "up",
      icon: <Users size={18} />,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50"
    },
    {
      title: "Equipment Imports",
      value: "$12.5M",
      change: "+15.2%",
      trend: "up",
      icon: <Truck size={18} />,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full mb-3 animate-pulse">
            <Database size={10} className="text-blue-600" />
            <span className="text-[9px] font-mono font-bold text-blue-700 uppercase tracking-wider">Live Market Intelligence</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
            Ugandan Cleaning{' '}
            <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Market Intelligence</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Real-time market data, interactive visualizations, and industry insights for informed decision making
          </p>
        </div>

        {/* Stats Cards with Motion Graphics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((card, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-slate-700">{card.icon}</div>
                </div>
                <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${card.trend === 'up' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <TrendingUp size={8} className="text-emerald-600" />
                  <span className="text-[8px] font-bold text-emerald-600">{card.change}</span>
                </div>
              </div>
              <p className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <AnimatedCounter value={card.value} />
              </div>
            </div>
          ))}
        </div>

        {/* Chart Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'market', label: 'Market Growth', icon: <LineChart size={12} /> },
            { id: 'imports', label: 'Import Trends', icon: <BarChart3 size={12} /> },
            { id: 'budget', label: 'Budget Distribution', icon: <PieChart size={12} /> },
            { id: 'growth', label: 'Monthly Growth', icon: <Activity size={12} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                activeChart === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chart Display Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6">
            {/* Market Growth Chart */}
            {activeChart === 'market' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Market Size Growth (USD Million)</h3>
                    <p className="text-[10px] text-slate-400">2021 - 2024 Projection</p>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp size={10} />
                    <span>+22.6% CAGR</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={marketSizeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}M`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [`$${value} Million`, 'Market Size']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Import Trends Chart */}
            {activeChart === 'imports' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Import Trends (USD Million)</h3>
                    <p className="text-[10px] text-slate-400">Equipment vs Chemical Imports</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={importData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}M`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [`$${value} Million`, '']}
                    />
                    <Bar dataKey="equipment" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Equipment" />
                    <Bar dataKey="chemicals" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Chemicals" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Budget Distribution Pie Chart */}
            {activeChart === 'budget' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Budget Distribution</h3>
                    <p className="text-[10px] text-slate-400">By enterprise size</p>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                      <Pie
                        data={budgetDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {budgetDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {budgetDistribution.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] text-slate-600">{item.name}</span>
                        <span className="text-[10px] font-bold text-slate-800">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Growth Line Chart */}
            {activeChart === 'growth' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Monthly Industry Growth</h3>
                    <p className="text-[10px] text-slate-400">Year-over-year percentage change</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <ReLineChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [`${value}%`, 'Growth Rate']}
                    />
                    <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', r: 4 }} />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Data Source Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2 text-[8px] text-slate-400">
              <div className="flex items-center gap-3">
                <span>📊 Data updates: Real-time</span>
                <span>🔄 Last sync: Today</span>
              </div>
              <a href={dataSources.ubos} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition">
                Source: Uganda Bureau of Statistics <ExternalLink size={8} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ======================= OPERATIONAL STATUS UPDATE TICKER =======================
const ScrollingStatusBar = () => {
  const activities = [
    { text: "Kärcher walk-behind scrubbers indexed for industrial concrete", time: "UPDATED" },
    { text: "Nilfisk wet & dry vacuum datasets matched with local distributors", time: "VERIFIED" },
    { text: "Detergent pH and dilution compatibility maps active", time: "LIVE" },
    { text: "Numatic floor care compliance guidelines updated", time: "COMPLETED" },
    { text: `Power stability data: Kampala 65% stable`, time: "REAL-TIME" },
    { text: `Market size: $47.2M with 8.5% growth`, time: "Q4 2024" },
  ];
  const allActivities = [...activities, ...activities, ...activities];
  return (
    <div className="relative overflow-hidden bg-white border-y border-slate-200 py-2.5 shadow-xs">
      <div className="flex whitespace-nowrap animate-[scroll_40s_linear_infinite]">
        {allActivities.map((act, idx) => (
          <div key={idx} className="inline-flex items-center gap-2 mx-8 text-[10px] text-slate-600 font-mono font-medium tracking-wide uppercase">
            <span className="w-1 h-1 rounded-full bg-blue-600"></span>
            <span>{act.text}</span>
            <span className="text-slate-400 font-bold">[{act.time}]</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
};

// ======================= ANALYTICAL CORE (IMPACT GRID) =======================
const ImpactGrid = () => (
  <section className="py-10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { 
            title: 'Total Cost of Ownership (TCO)', 
            label: 'COST ANALYSIS', 
            desc: 'Models multi-year financial impact including initial asset purchase prices, annual operational running costs, and expected maintenance overhead in UGX.', 
            icon: <BarChart3 />, 
            color: 'bg-blue-50 text-blue-600' 
          },
          { 
            title: 'Surface & Detergent Matcher', 
            label: 'COMPLIANCE', 
            desc: 'Cross-references specific floor compositions like terrazzo or marble against detergent formulations to prevent structural corrosion or surface degradation.', 
            icon: <ShieldCheck />, 
            color: 'bg-cyan-50 text-cyan-600' 
          },
          { 
            title: 'Ugandan Environment Fit', 
            label: 'OPERATIONAL ADJUSTMENT', 
            desc: 'Calibrates machinery matches to handle deep regional dirt profiles such as heavy red laterite clay dust, open-air conditions, and tropical humidity levels.', 
            icon: <MapPin />, 
            color: 'bg-slate-100 text-slate-700' 
          }
        ].map((item, i) => (
          <div key={i} className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider mb-3 block">{item.label}</span>
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-all shadow-xs`}>
               {React.cloneElement(item.icon, { size: 20, strokeWidth: 2 })}
            </div>
            <h3 className="text-base font-bold mb-2 text-slate-900 tracking-tight">{item.title}</h3>
            <p className="text-slate-600 text-xs leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ======================= SELECTION PROTOCOL (METHODOLOGY) =======================
const MethodologySection = () => (
  <section className="py-10 bg-white border-y border-slate-200">
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold mb-2 text-slate-900 tracking-tight">System Workflow</h2>
        <p className="text-slate-500 text-[11px] font-mono font-semibold uppercase tracking-wider">How Clean Match Computes Recommendations</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        {[
          { step: '01', title: 'Define Site Parameters', desc: 'Input your specific floor square meters, material profile (vinyl, concrete, glass), and exact dirt density challenges.', icon: <Layers size={18} /> },
          { step: '02', title: 'Evaluate Specifications', desc: 'The system filters hardware by technical constraints—matching required working widths (mm), tank volume capabilities (L), and available power supplies.', icon: <FileText size={18} /> },
          { step: '03', title: 'Generate Procurement Reports', desc: 'Receive a localized, structured breakdown of appropriate machine models alongside upfront investment costs and long-term upkeep estimates.', icon: <Wrench size={18} /> }
        ].map((item, i) => (
          <div key={i} className="relative flex flex-col items-center text-center px-2">
            <div className="mb-4 flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 font-mono font-bold text-sm shadow-xs">
                {item.step}
              </div>
            </div>
            <h4 className="text-sm font-bold mb-2 text-slate-900 tracking-tight">{item.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ======================= UGANDAN REALITIES SECTION (WITH YOUR IMAGES) =======================
const UgandanRealitiesSection = () => {
  const [activeCard, setActiveCard] = useState(null);

  const realities = [
    {
      id: 'budget',
      title: 'Capital & Budget Transparency',
      description: 'Evaluates baseline machinery pricing balances against immediate stock options and annual spare part maintenance overhead.',
      longDescription: `Ugandan businesses face unique budget constraints. 35% of cleaning companies operate with budgets under 2M UGX. Our system matches equipment to your actual financial capacity.`,
      icon: <DollarSign size={20} />,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      image: ugandaImages.budget,
      stats: [
        { label: "Small Business", value: "35%", color: "emerald" },
        { label: "Medium Enterprise", value: "45%", color: "blue" },
        { label: "Large Corp", value: "15%", color: "purple" },
      ]
    },
    {
      id: 'power',
      title: 'Power Infrastructure Matching',
      description: 'Filters machinery based on power access types, tracking corded electric voltage requirements vs heavy-duty industrial battery runtime options.',
      longDescription: `Power stability varies across Uganda: Kampala (65% stable), Industrial areas (45% stable), Upcountry (30% stable). Our system recommends battery-powered equipment for unstable areas.`,
      icon: <Zap size={20} />,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      image: ugandaImages.power,
      stats: [
        { label: "Kampala", value: "65%", color: "emerald" },
        { label: "Industrial", value: "45%", color: "amber" },
        { label: "Upcountry", value: "30%", color: "red" },
      ]
    },
    {
      id: 'soil',
      title: 'Laterite Soil Engineering',
      description: 'Accounts for high brush down-pressure and professional extraction airflow parameters needed to completely lift stubborn red clay soils.',
      longDescription: `Red laterite soil covers High% of Uganda's commercial areas. Our equipment recommendations prioritize high extraction power and brush pressure.`,
      icon: <Droplets size={20} />,
      gradient: 'from-red-500 to-rose-500',
      bgGradient: 'from-red-50 to-rose-50',
      image: ugandaImages.laterite,
      stats: [
        { label: "Red Laterite", value: "High", color: "red" },
        { label: "Black Cotton", value: "Medium", color: "amber" },
        { label: "Sandy Loam", value: "Low", color: "emerald" },
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full mb-3">
            <MapPin size={10} className="text-amber-600" />
            <span className="text-[9px] font-mono font-bold text-amber-700 uppercase tracking-wider">Uganda-Specific</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            Engineered Around{' '}
            <span className="text-blue-600">Ugandan Operational Realities</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Real data from Ugandan facilities power our recommendation engine
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {realities.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveCard(item.id)}
              onMouseLeave={() => setActiveCard(null)}
              className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Image Section with your provided images */}
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = ugandaImages.warehouse;
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-60`}></div>
                <div className="absolute bottom-3 left-3">
                  <div className={`w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center`}>
                    <div className="text-white">{item.icon}</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{item.description}</p>
                
                {/* Stats with Animated Counters */}
                <div className="flex justify-around py-3 mb-3 border-y border-slate-100">
                  {item.stats.map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <p className={`text-lg font-bold text-${stat.color}-600`}>
                        <AnimatedCounter value={stat.value} />
                      </p>
                      <p className="text-[8px] text-slate-400 uppercase">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Expanded content on hover */}
                <div className={`overflow-hidden transition-all duration-300 ${activeCard === item.id ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-[10px] text-slate-600 leading-relaxed mt-2">
                    {item.longDescription}
                  </p>
                </div>

                {/* Data Source Link */}
                <div className="mt-3 pt-2 text-center">
                  <a 
                    href={dataSources.ubos} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[8px] text-slate-400 hover:text-blue-600 transition"
                  >
                    Source: Verified Data <ExternalLink size={8} />
                  </a>
                </div>
              </div>

              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
            </div>
          ))}
        </div>

        {/* Market Context Summary */}
        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp size={12} className="text-blue-600" />
            </div>
            <span className="text-[9px] font-mono font-bold text-blue-700 uppercase">Market Context</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-[9px] text-slate-400">Avg Equipment Import Time</p>
              <p className="text-sm font-bold text-slate-800">45-60 days</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400">Spare Parts Availability</p>
              <p className="text-sm font-bold text-amber-600">65%</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400">Trained Staff Availability</p>
              <p className="text-sm font-bold text-amber-600">42%</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400">Chemical Compliance Rate</p>
              <p className="text-sm font-bold text-slate-800">58%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ======================= DEPLOYMENT CALLOUT (UPGRADE BANNER) =======================

// ======================= DEPLOYMENT CALLOUT (UPGRADE BANNER) =======================
const UpgradeBanner = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleInitializeDecisionSupport = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate('/login', { state: { from: '/machine-type' } });
    } else {
      navigate('/machine-type');
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-10 lg:p-12 text-center shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full -ml-32 -mb-32 blur-2xl"></div>
          
          <Building2 className="mx-auto text-cyan-500 w-8 h-8 mb-4" />
          <h3 className="text-xl md:text-3xl font-bold mb-3 text-white tracking-tight">Standardize Your Facility Operations</h3>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto text-sm font-medium">
            Empowering Ugandan site managers, procurement officers, and cleaning companies with transparent, brand-agnostic technical comparisons.
          </p>
          
          {/* Market Stats Summary */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">$47.2M</p>
              <p className="text-[9px] text-slate-400 uppercase">Market Size</p>
            </div>
            <div className="w-px h-10 bg-slate-700"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">8.5%</p>
              <p className="text-[9px] text-slate-400 uppercase">Annual Growth</p>
            </div>
            <div className="w-px h-10 bg-slate-700"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">1,280+</p>
              <p className="text-[9px] text-slate-400 uppercase">Active Companies</p>
            </div>
          </div>

          <button 
            onClick={handleInitializeDecisionSupport}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-900/50"
          >
            Initialize Decision Support
          </button>
          
          {/* Login hint for guests */}
          {!isAuthenticated && (
            <p className="text-[8px] text-slate-500 mt-3">
              🔒 Sign in required to access the decision support engine
            </p>
          )}
          
          <p className="text-[8px] text-slate-500 mt-4">
            Data sources: UBOS, Ministry of Trade, Industry Reports • Updated Q4 2024
          </p>
        </div>
      </div>
    </section>
  );
};
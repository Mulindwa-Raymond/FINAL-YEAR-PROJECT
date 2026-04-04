import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Settings, 
  RotateCcw, 
  History, 
  GraduationCap, 
  Info,
  ChevronRight,
  Play,
  Zap,
  BarChart3,
  MapPin,
  CheckCircle2,
  Globe,
  ArrowRight,
  Cpu,
  Sparkles,
  Layers,
  Activity,
  Truck,
  Wrench,
  Terminal,
  Scan,
  Database
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Hero images array (15 high-quality Unsplash images)
const heroImages = [
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837",
  "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1",
  "https://images.unsplash.com/photo-1598514982845-1b6b8b1d9a2f",
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
  "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac",
  "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",
  "https://images.unsplash.com/photo-1563453392212-326f5e854473",
  "https://images.unsplash.com/photo-1581090700227-1e8d4e7f8c7f",
  "https://images.unsplash.com/photo-1597002974111-5a3f3cdb2c6d",
  "https://images.unsplash.com/photo-1602524819574-3c7a64b1d9c4",
  "https://images.unsplash.com/photo-1618220179428-22790b461013",
  "https://images.unsplash.com/photo-1598515214211-89d3c73ae9a2"
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-cyan-200 overflow-x-hidden">
      {/* Tech Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,1)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>
      </div>

      <Navbar />
      
      <main className="relative z-10">
        <HeroSection navigate={navigate} />
        <ScrollingStatusBar />
        <ImpactGrid />
        <MethodologySection />
        <UpgradeBanner />
        <MarketSpecifics />
      </main>

    </div>
  );
}

// ======================= HERO SECTION (Updated with navigation) =======================
const HeroSection = ({ navigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

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

  const handleStartRecommendation = () => {
    navigate('/site-task-profile');
  };

  return (
    <section className="relative pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl shadow-blue-900/5">
          <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-500/20 rounded-tl-[40px] z-20"></div>
          
          <div className="grid lg:grid-cols-12 items-stretch min-h-[480px]">
            {/* Left Content */}
            <div className="lg:col-span-5 p-10 lg:p-14 flex flex-col justify-center border-r border-slate-100 relative z-10 bg-white">
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-cyan-50 border border-cyan-100 text-cyan-700 text-[10px] font-mono font-black tracking-widest uppercase rounded-full w-fit">
                <Terminal size={12} /> System Status: Optimal
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6 text-slate-900 uppercase tracking-tighter">
                Smart Hygiene <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Infrastructure</span><br />
                <span className="text-slate-300">Engineering.</span>
              </h1>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm font-medium">
                Recommendation engine precisely calibrated for <span className="text-cyan-600 font-bold">Ugandan soil metrics</span> and industrial power profiles.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <button 
                  onClick={handleStartRecommendation}
                  className="group px-8 py-5 bg-slate-900 rounded-2xl font-black text-white text-xs uppercase tracking-widest transition-all hover:bg-cyan-600 hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/10"
                >
                  <span className="flex items-center gap-2">Select Match <ChevronRight size={16} /></span>
                </button>
                <button className="px-8 py-5 bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-2xl transition-all hover:bg-slate-200 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Play size={10} fill="currentColor" className="text-blue-600" /> Demo
                </button>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-widest">Latency</span>
                  <span className="text-sm font-black text-slate-900">12ms</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-widest">Confidence</span>
                  <span className="text-sm font-black text-blue-600">99.2%</span>
                </div>
              </div>
            </div>

            {/* Right Carousel - Full Container Height with HUD */}
            <div className="lg:col-span-7 relative bg-slate-900 overflow-hidden">
              <div className={`absolute inset-0 transition-all duration-1000 ease-out ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-110 blur-sm'}`}>
                <img 
                  src={`${heroImages[currentIndex]}?auto=format&fit=crop&q=80&w=1200`}
                  alt="Cleaning equipment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/10 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                
                {/* HUD Overlay */}
                <div className="absolute top-8 right-8">
                  <div className="bg-slate-900/60 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white min-w-[140px]">
                    <div className="text-[8px] font-mono tracking-widest uppercase opacity-60 mb-1">Asset ID</div>
                    <div className="text-xs font-black mb-3">CM_EQUIP_{currentIndex + 100}</div>
                    <div className="flex gap-1">
                       {[...Array(5)].map((_, i) => (
                         <div key={i} className={`h-0.5 flex-1 rounded-full ${i < 3 ? 'bg-cyan-500' : 'bg-white/20'}`}></div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-20">
                  <div className="bg-white/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/50 text-[10px] font-mono font-bold text-slate-900 shadow-lg">
                    <span className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></div>
                      LIVE SENSORS ACTIVE
                    </span>
                  </div>
                  <div className="flex gap-1.5 pb-2">
                    {heroImages.map((_, idx) => (
                      <div key={idx} className={`h-1 rounded-full transition-all duration-700 ${idx === currentIndex ? 'w-8 bg-cyan-600' : 'w-1.5 bg-white/40'}`} />
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

// ======================= SCROLLING STATUS BAR =======================
const ScrollingStatusBar = () => {
  const activities = [
    { text: "Kärcher B90R matched • Kampala Park", time: "NOW" },
    { text: "Nilfisk SC250 dispatched • 3 Units", time: "2M" },
    { text: "Chemical Compatibility Approved", time: "5M" },
    { text: "Grid Stability Warning: OK", time: "12M" },
  ];
  const allActivities = [...activities, ...activities, ...activities];
  return (
    <div className="relative overflow-hidden bg-white border-y border-slate-200 py-4 shadow-sm">
      <div className="flex whitespace-nowrap animate-[scroll_30s_linear_infinite]">
        {allActivities.map((act, idx) => (
          <div key={idx} className="inline-flex items-center gap-4 mx-12 text-[10px] text-slate-500 font-mono font-black tracking-[0.2em] uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            <span>{act.text}</span>
            <span className="text-slate-300">[{act.time}]</span>
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

// ======================= IMPACT GRID =======================
const ImpactGrid = () => (
  <section className="py-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: 'TCO Predictor', label: 'ANALYTICS', desc: 'Real-time cost modeling including import tariffs and regional energy cycles.', icon: <BarChart3 />, color: 'bg-blue-50 text-blue-600' },
          { title: 'Chemical Shield', label: 'VALIDATION', desc: 'Compatibility verification for industrial detergents vs floor materials.', icon: <ShieldCheck />, color: 'bg-cyan-50 text-cyan-600' },
          { title: 'Regional Core', label: 'GEO-ADAPT', desc: 'Parameters engineered specifically for red clay dust and equatorial humidity.', icon: <MapPin />, color: 'bg-indigo-50 text-indigo-600' }
        ].map((item, i) => (
          <div key={i} className="group relative bg-white p-10 rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-500">
            <span className="text-[10px] font-mono font-black text-slate-400 tracking-[0.3em] mb-6 block">{item.label}</span>
            <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-all shadow-sm`}>
               {React.cloneElement(item.icon, { size: 24, strokeWidth: 2.5 })}
            </div>
            <h3 className="text-xl font-black mb-4 text-slate-900 uppercase tracking-tight">{item.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ======================= METHODOLOGY SECTION =======================
const MethodologySection = () => (
  <section className="py-24 bg-white border-y border-slate-100">
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-20 text-center">
        <h2 className="text-4xl font-black mb-4 text-slate-900 uppercase tracking-tighter">Selection Protocol</h2>
        <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-[0.4em]">Proprietary Matching Algorithm</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-16">
        {[
          { step: '01', title: 'Site Profiling', desc: 'Laser scan floor metrics and soil composition levels.', icon: <Layers size={22} /> },
          { step: '02', title: 'Compatibility', desc: 'Verify detergent chemistry against equipment tolerances.', icon: <Cpu size={22} /> },
          { step: '03', title: 'Operational Log', desc: 'Generate localized reports and maintenance blueprints.', icon: <ArrowRight size={22} /> }
        ].map((item, i) => (
          <div key={i} className="relative">
            <div className="mb-8 flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm relative z-10">
                <span className="text-sm font-mono font-black">{item.step}</span>
              </div>
              <div className="absolute top-7 left-0 w-full h-[2px] bg-slate-50 -z-0"></div>
            </div>
            <div className="text-center px-4">
              <h4 className="text-lg font-black mb-4 text-slate-900 uppercase tracking-tight">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ======================= UPGRADE BANNER =======================
const UpgradeBanner = () => (
  <section className="py-24">
    <div className="max-w-6xl mx-auto px-6">
      <div className="relative bg-gradient-to-br from-blue-700 to-cyan-500 rounded-[50px] p-16 lg:p-24 text-center shadow-2xl shadow-cyan-200 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full -ml-32 -mb-32 blur-2xl"></div>
        
        <Sparkles className="mx-auto text-white w-12 h-12 mb-8 animate-pulse" />
        <h3 className="text-4xl md:text-6xl font-black mb-8 text-white tracking-tighter uppercase leading-none">Optimize Your <br />Infrastructure</h3>
        <p className="text-white/80 mb-12 max-w-2xl mx-auto text-base font-medium">Powering 45+ industrial facilities in the Pearl of Africa with smart hygiene data.</p>
        <button className="px-12 py-6 bg-white text-blue-700 rounded-2xl font-black uppercase text-sm tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-xl">
          Initialize System
        </button>
      </div>
    </div>
  </section>
);

// ======================= MARKET SPECIFICS =======================
const MarketSpecifics = () => (
  <section className="py-24 bg-slate-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-24 items-center">
        <div className="relative aspect-video rounded-[40px] overflow-hidden border-8 border-white shadow-2xl shadow-blue-900/10">
          <img src="https://images.unsplash.com/photo-1521791136064-7986c2959d43?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110" alt="Market" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8 p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-lg">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-mono font-black text-slate-800 uppercase">LOCAL_SYNC_READY</span>
             </div>
             <p className="text-[9px] text-slate-500 font-mono font-bold">KAMPALA METRO DATA FEED ACTIVE</p>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-black mb-10 text-slate-900 uppercase tracking-tighter leading-tight">Engineered for <br /><span className="text-cyan-600">The Local Grid</span></h2>
          <div className="space-y-4">
            {[
              { icon: <CheckCircle2 className="text-blue-600" />, t: 'Tariff Integration', d: 'Live import duty projections from Ugandan customs APIs.' },
              { icon: <Settings className="text-cyan-600" />, t: 'Grid Tolerance', d: 'Circuit simulation for power fluctuation environments.' },
              { icon: <Globe className="text-indigo-600" />, t: 'Tropicalized Core', d: 'Parameters adjusted for high-temp, high-dust operation.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-5 p-6 rounded-[24px] bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all group">
                <div className="mt-1 transition-transform group-hover:scale-110">{item.icon}</div>
                <div>
                  <h4 className="font-black text-slate-900 mb-2 uppercase text-sm tracking-wide">{item.t}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
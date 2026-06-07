/**
 * Home.jsx
 * 
 * Landing page for Clean Match DSS.
 * 
 * Features:
 * - Professional hero section with brand-specific machinery carousel (Kärcher, Nilfisk, Numatic)
 * - Operational status update ticker
 * - Analytical core value pillars
 * - 3-Step decision support protocol
 * - Action-oriented deployment callout
 * - Ugandan market operational context section
 * - Seamless auth verification hooks
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
  Gauge
} from 'lucide-react';

// Verified Brand Product Images (Kärcher, Nilfisk, Numatic)
const heroImages = [
  // Kärcher products
  "https://s1.kaercher-media.com/mam/10305100/mainproduct/85218/d3.jpg",
  "https://s1.kaercher-media.com/mam/15332680/mainproduct/e52e39c4-3ec2-4d14-bbd9-5f2b14344071/d3.jpg",
  "https://s1.kaercher-media.com/mam/17833110/mainproduct/30782/d3.jpg",
  "https://s1.kaercher-media.com/mam/17832280/mainproduct/170260/d3.jpg",
  "https://s1.kaercher-media.com/images/pim/Compact_scrubber_driers_1240x456.jpg",
  // Nilfisk products
  "https://www.nilfisk.com/product-images-1920/MC-4M_FlexoPower_L-ps-Original-TTNPPB.webp",
  "https://www.nilfisk.com/product-images-1025/MH-3C-cable-left-ps-Original-JHTJUEF.webp",
  "https://www.nilfisk.com/product-images-1920/AERO-21-21-PC-INOX-ps-Original-OUOHUJ.webp",
  "https://www.nilfisk.com/product-images-1025/Aero-21B_L_Full_01-ps-Original-JLUNNUS.webp",
  // Numatic products
  "https://numatic.com/uk/wp-content/smush-webp/sites/2/Numatic-FloorCare-Compact-Scrubber-Dryers.jpg.webp",
  "https://numatic.com/uk/wp-content/uploads/sites/2/2024/02/FloorCare-Accessories-1.jpg",
  "https://numatic.com/uk/wp-content/uploads/sites/2/2024/02/Sanitise-Category-Image-1.jpg"
];

// Clean, industry-accurate labels mapping directly to your specifications database
const imageMeta = [
  { brand: "Kärcher", category: "Ride-On Scrubber Drier" },
  { brand: "Kärcher", category: "Walk-Behind Floor Scrubber" },
  { brand: "Kärcher", category: "Industrial Heavy-Duty Vacuum" },
  { brand: "Kärcher", category: "Professional Hot Water Pressure Washer" },
  { brand: "Kärcher", category: "Compact Scrubber Drier" },
  { brand: "Nilfisk", category: "Commercial Pressure Washer" },
  { brand: "Nilfisk", category: "Industrial Vacuum System" },
  { brand: "Nilfisk", category: "Wet & Dry Extraction Vacuum" },
  { brand: "Nilfisk", category: "Compact Hard Floor Scrubber" },
  { brand: "Numatic", category: "Compact Walk-Behind Scrubber" },
  { brand: "Numatic", category: "Commercial Floor Care Unit" },
  { brand: "Numatic", category: "Sanitisation & Deep Clean System" }
];

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const handleStartRecommendation = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/machine-type' } });
    } else {
      navigate('/machine-type');
    }
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
      {/* Sleek Enterprise Background Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(240,247,255,1)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px]"></div>
      </div>

      <main className="relative z-10">
        <HeroSection onStartRecommendation={handleStartRecommendation} />
        <ScrollingStatusBar />
        <ImpactGrid />
        <MethodologySection />
        <UpgradeBanner />
        <MarketSpecifics />
      </main>
    </div>
  );
}

// ======================= HERO SECTION =======================
const HeroSection = ({ onStartRecommendation }) => {
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

  const currentMeta = imageMeta[currentIndex] || { brand: "Clean Match", category: "Equipment" };

  return (
    <section className="relative pt-6 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
          {/* 🔽🔽🔽 ADJUST THIS LINE TO CHANGE HERO HEIGHT 🔽🔽🔽 */}
          <div className="grid lg:grid-cols-12 items-stretch min-h-[580px]">
          {/* 🔼🔼🔼 CHANGE THE VALUE ABOVE (e.g., 520px, 620px, 650px) 🔼🔼🔼 */}
            
            {/* Left Operational Context Control Panel */}
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-center relative z-10 bg-white">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono font-semibold tracking-wider uppercase rounded-md w-fit">
                <Gauge size={13} className="text-cyan-600" /> Database Status: Verified
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4 text-slate-900 tracking-tight">
                Optimize Your Commercial <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Cleaning Procurement</span>
              </h1>
              
              <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-sm font-medium">
                Data-driven machinery and detergent matching optimized explicitly for Ugandan site conditions, electrical grid stability, and corporate budget metrics.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <button 
                  onClick={onStartRecommendation}
                  className="group px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  Start Match Engine <ChevronRight size={15} />
                </button>
                <button className="px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2">
                  <Play size={10} fill="currentColor" className="text-slate-600" /> System Guide
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

            {/* Right Machinery Visual Showcase */}
            <div className="lg:col-span-7 relative bg-slate-900 overflow-hidden min-h-[500px] lg:min-h-full">
              <div className={`absolute inset-0 transition-all duration-1000 ease-out ${fade && loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105 blur-xs'}`}>
                <img 
                  src={heroImages[currentIndex]}
                  alt={`${currentMeta.brand} ${currentMeta.category}`}
                  className="w-full h-full object-cover opacity-85"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
                {/* Sleek geometric gradients instead of aggressive HUD borders */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent hidden lg:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                {/* Corporate Product Badge */}
                <div className="absolute top-5 left-5">
                  <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl text-white min-w-[150px] shadow-xl">
                    <div className="text-[9px] font-mono tracking-wider uppercase text-slate-400 mb-1">Equipment Profiling</div>
                    <div className="text-sm font-bold text-white">{currentMeta.brand}</div>
                    <div className="text-xs text-cyan-400 font-medium">{currentMeta.category}</div>
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

// ======================= OPERATIONAL STATUS UPDATE TICKER =======================
const ScrollingStatusBar = () => {
  const activities = [
    { text: "Kärcher walk-behind scrubbers indexed for industrial concrete", time: "UPDATED" },
    { text: "Nilfisk wet & dry vacuum datasets matched with local distributors", time: "VERIFIED" },
    { text: "Detergent pH and dilution compatibility maps active", time: "LIVE" },
    { text: "Numatic floor care compliance guidelines updated", time: "COMPLETED" },
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

// ======================= DEPLOYMENT CALLOUT (UPGRADE BANNER) =======================
const UpgradeBanner = () => (
  <section className="py-10">
    <div className="max-w-6xl mx-auto px-6">
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-10 lg:p-12 text-center shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full -ml-32 -mb-32 blur-2xl"></div>
        
        <Building2 className="mx-auto text-cyan-500 w-8 h-8 mb-4" />
        <h3 className="text-xl md:text-3xl font-bold mb-3 text-white tracking-tight">Standardize Your Facility Operations</h3>
        <p className="text-slate-400 mb-6 max-w-xl mx-auto text-sm font-medium">Empowering Ugandan site managers, procurement officers, and cleaning companies with transparent, brand-agnostic technical comparisons.</p>
        <button 
          onClick={() => window.location.href = '/machine-type'}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-900/50"
        >
          Initialize Decision Support
        </button>
      </div>
    </div>
  </section>
);

// ======================= UGANDAN MARKET OPERATIONAL CONTEXT =======================
const MarketSpecifics = () => (
  <section className="py-10 bg-slate-50 border-t border-slate-200">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Market Visual Container */}
        <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1521791136064-7986c2959d43?auto=format&fit=crop&q=80&w=1000" 
            className="w-full h-full object-cover" 
            alt="Commercial facility review in Kampala" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
          <div className="absolute bottom-4 left-4 p-3 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md">
             <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-mono font-bold text-slate-800 uppercase">REGIONAL_METRICS_ON</span>
             </div>
             <p className="text-[9px] text-slate-500 font-mono font-medium">UGANDAN REVENUE & LOGISTICS DATA CURRENT</p>
          </div>
        </div>

        {/* Local Operational Realities */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-slate-900 tracking-tight leading-tight">
            Engineered Around <br />
            <span className="text-blue-600">Ugandan Operational Realities</span>
          </h2>
          <div className="space-y-3">
            {[
              { 
                icon: <CheckCircle2 size={16} className="text-blue-600" />, 
                t: 'Capital & Budget Transparency', 
                d: 'Evaluates baseline machinery pricing balances against immediate stock options and annual spare part maintenance overhead.' 
              },
              { 
                icon: <Settings size={16} className="text-cyan-600" />, 
                t: 'Power Infrastructure Matching', 
                d: 'Filters machinery based on power access types, tracking corded electric voltage requirements vs heavy-duty industrial battery runtime options.' 
              },
              { 
                icon: <ArrowRight size={16} className="text-slate-700" />, 
                t: 'Laterite Soil Engineering', 
                d: 'Accounts for high brush down-pressure and professional extraction airflow parameters needed to completely lift stubborn red clay soils.' 
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all group">
                <div className="mt-0.5 transition-transform group-hover:scale-105">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-[11px] uppercase tracking-wide">{item.t}</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed font-medium">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </section>
);
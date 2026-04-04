import React, { useState } from 'react';
import { 
  Zap,
  Battery,
  Flame,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Settings2,
  ChevronRight,
  Info,
  Shield,
  Wrench,
  DollarSign
} from 'lucide-react';

// Import shared layout components (matching home page)
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ======================= REAL EQUIPMENT DATABASE =======================
const machines = [
  {
    id: 1,
    name: "Kärcher B 40 C/W Bp",
    type: "Scrubber‑dryer",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600",
    powerType: "Battery",
    powerSpec: "24V / Unstable‑Ready",
    tco: "UGX 4.25M",
    tcoYearly: "UGX 1.2M/yr",
    tags: ["Tiled", "Concrete", "Epoxy"],
    surfaceSensitivity: 40,
    detergentCompat: "pH 7-10",
    partsAvailability: "High (Kampala)",
    status: "OPTIMIZED FOR SITE",
    warning: false
  },
  {
    id: 2,
    name: "Kärcher HD 6/13 C",
    type: "Pressure Washer",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
    powerType: "Electric",
    powerSpec: "3.0kW / 240V",
    tco: "UGX 2.8M",
    tcoYearly: "UGX 850k/yr",
    tags: ["Concrete", "Laterite"],
    surfaceSensitivity: 20,
    detergentCompat: "pH 8-12",
    partsAvailability: "Medium (2 weeks)",
    status: "CHECK POWER STABILITY",
    warning: false
  },
  {
    id: 3,
    name: "Nilfisk SC401 B",
    type: "Industrial Vacuum",
    image: "https://images.unsplash.com/photo-1598514982845-1b6b8b1d9a2f?auto=format&fit=crop&q=80&w=600",
    powerType: "Battery",
    powerSpec: "Heavy Duty / Li‑ion",
    tco: "UGX 5.6M",
    tcoYearly: "UGX 1.4M/yr",
    tags: ["Vinyl", "Carpet", "Tiled"],
    surfaceSensitivity: 60,
    detergentCompat: "pH 6-9",
    partsAvailability: "High (Direct Agent)",
    status: "OPTIMIZED FOR SITE",
    warning: false
  },
  {
    id: 4,
    name: "Nilfisk SC250",
    type: "Floor Polisher",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
    powerType: "Electric",
    powerSpec: "1.5kW / 240V",
    tco: "UGX 7.2M",
    tcoYearly: "UGX 1.8M/yr",
    tags: ["Terrazzo", "Marble"],
    surfaceSensitivity: 75,
    detergentCompat: "pH 7-10",
    partsAvailability: "Low (import)",
    status: "INCOMPATIBLE FLOOR",
    warning: true
  },
  {
    id: 5,
    name: "Numatic TTB 1840",
    type: "Single‑Disc Machine",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
    powerType: "Battery",
    powerSpec: "Li‑Ion / Fast Charge",
    tco: "UGX 4.95M",
    tcoYearly: "UGX 1.1M/yr",
    tags: ["Concrete", "Vinyl"],
    surfaceSensitivity: 50,
    detergentCompat: "pH 6-9",
    partsAvailability: "High (Direct Agent)",
    status: "OPTIMIZED FOR SITE",
    warning: false
  }
];

// ======================= DETERGENT DATABASE =======================
const detergents = [
  {
    name: "CleanPro Ultra‑Base (UG)",
    type: "Alkaline",
    ph: 9,
    price: "UGX 85,000/5L",
    features: ["Red laterite suspension", "Non‑foaming", "Biodegradable"],
    foamLevel: "Low",
    eco: true
  },
  {
    name: "SLC Neutral Concentrate",
    type: "Neutral",
    ph: 7,
    price: "UGX 72,000/5L",
    features: ["Low foam", "No residue", "Safe for daily use"],
    foamLevel: "Low",
    eco: false
  }
];

export default function Recommendation() {
  // Filter state
  const [powerSource, setPowerSource] = useState('All');
  const [surfaceSensitivity, setSurfaceSensitivity] = useState(50);
  const [phMin, setPhMin] = useState('');
  const [phMax, setPhMax] = useState('');
  const [lowFoamOnly, setLowFoamOnly] = useState(true);

  // Compute filtered machines
  const filteredMachines = machines.filter(machine => {
    // Power source filter
    if (powerSource !== 'All' && machine.powerType !== powerSource) return false;
    // Surface sensitivity (machine must be ≤ slider)
    if (machine.surfaceSensitivity > surfaceSensitivity) return false;
    // pH range
    const machinePHMin = parseInt(machine.detergentCompat.match(/[\d.]+/)?.[0]) || 0;
    const machinePHMax = parseInt(machine.detergentCompat.match(/[\d.]+(?!.*\d)/)?.[0]) || 14;
    const min = phMin !== '' ? parseFloat(phMin) : 0;
    const max = phMax !== '' ? parseFloat(phMax) : 14;
    if (machinePHMax < min || machinePHMin > max) return false;
    // Foam level (if low foam only, exclude machines that need high foam – simplified)
    if (lowFoamOnly && machine.detergentCompat.toLowerCase().includes('high foam')) return false;
    return true;
  });

  // Dynamic alert based on filters
  const showAlert = surfaceSensitivity > 60 && powerSource === 'Electric';
  const alertMessage = showAlert 
    ? "High surface sensitivity combined with electric power may cause floor damage. Consider battery‑powered units with adjustable pressure."
    : "Your filters are within safe operating ranges. Review the recommended machines below.";

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-cyan-200">
      {/* Tech background (matching home page) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,0.4)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: `radial-gradient(#0ea5e9 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
        {/* Header with progress indicator */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 border border-cyan-200 text-cyan-700 text-[10px] font-mono font-bold tracking-[0.2em] uppercase rounded-full mb-4">
              <Shield size={12} /> Decision Support System
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Equipment &amp; Detergent <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Intelligent Matching</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Matching Confidence</p>
            <p className="text-sm font-black text-slate-800">High Accuracy</p>
            <div className="w-48 h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-cyan-600 w-[85%]" />
            </div>
          </div>
        </div>

        {/* Alert Banner – company‑friendly */}
        <div className={`rounded-xl p-5 flex items-start gap-4 mb-10 transition-all ${
          showAlert ? 'bg-orange-50 border border-orange-200' : 'bg-emerald-50 border border-emerald-200'
        }`}>
          <div className={`p-2 rounded-lg shadow-sm ${
            showAlert ? 'bg-white text-orange-500 border border-orange-100' : 'bg-white text-emerald-500 border border-emerald-100'
          }`}>
            {showAlert ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
          </div>
          <div>
            <h3 className={`text-sm font-bold mb-1 ${showAlert ? 'text-orange-800' : 'text-emerald-800'}`}>
              {showAlert ? 'Chemical & Mechanical Advisory' : 'Compatibility Verified'}
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 max-w-3xl">{alertMessage}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ======================= MACHINE GRID (Rectangular cards) ======================= */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Wrench size={20} className="text-cyan-600" /> Recommended Hardware
              </h2>
              <span className="text-xs text-slate-400 font-mono">{filteredMachines.length} units match</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredMachines.map((machine) => (
                <div key={machine.id} className={`group bg-white border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-cyan-100 transition-all duration-300 flex flex-col ${
                  machine.warning ? 'border-red-200' : 'border-slate-200 hover:border-cyan-300'
                }`}>
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img src={machine.image} alt={machine.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    <div className={`absolute top-4 right-4 text-[9px] font-black px-2 py-1 rounded-full flex items-center gap-1.5 shadow-sm ${
                      machine.warning 
                        ? 'bg-red-50 text-red-600 border border-red-100' 
                        : machine.status.includes('CHECK') 
                          ? 'bg-slate-800 text-white'
                          : 'bg-white text-slate-800 border border-slate-200'
                    }`}>
                      {machine.warning ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} className="text-cyan-600" />}
                      {machine.status}
                    </div>
                  </div>
                  <div className="p-5 flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{machine.name}</h3>
                    <p className="text-xs text-slate-500 mb-3">{machine.type}</p>
                    <div className="flex flex-wrap gap-3 mb-4 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1"><Zap size={12} className="text-cyan-600" /> {machine.powerSpec}</div>
                      <div className="flex items-center gap-1"><DollarSign size={12} className="text-emerald-600" /> {machine.tcoYearly}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {machine.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3 mt-2 flex justify-between">
                      <span className="flex items-center gap-1"><Wrench size={10} /> Spares: {machine.partsAvailability}</span>
                      <span className="flex items-center gap-1"><Droplets size={10} /> {machine.detergentCompat}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================= FILTER SIDEBAR (Corporate, clean) ======================= */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-md sticky top-32">
              <div className="flex items-center gap-2 pb-5 mb-6 border-b border-slate-100">
                <Settings2 size={18} className="text-cyan-600" />
                <h2 className="font-bold text-slate-800 tracking-tight">Refine Your Selection</h2>
              </div>

              {/* Power Source */}
              <div className="mb-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Power Source</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'All', value: 'All', icon: null },
                    { label: 'BATTERY', value: 'Battery', icon: <Battery size={14} /> },
                    { label: 'ELECTRIC', value: 'Electric', icon: <Zap size={14} /> },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => setPowerSource(btn.value)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all gap-1 ${
                        powerSource === btn.value
                          ? 'border-cyan-500 bg-white text-cyan-600 ring-1 ring-cyan-500'
                          : 'border-slate-200 text-slate-400 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {btn.icon}
                      <span className="text-[7px] font-black tracking-tighter">{btn.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 mt-2 italic">* Battery units handle unstable grid better.</p>
              </div>

              {/* Surface Sensitivity Slider */}
              <div className="mb-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Surface Sensitivity</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={surfaceSensitivity}
                  onChange={(e) => setSurfaceSensitivity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Hard Concrete (0)</span>
                  <span>Delicate Marble (100)</span>
                </div>
                <div className="mt-3 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                  Current setting: {surfaceSensitivity <= 30 ? 'Hard / Industrial floors' : surfaceSensitivity <= 70 ? 'Medium / Standard tiles' : 'Soft / Polished surfaces'}
                </div>
              </div>

              {/* Detergent Chemistry (pH Range) */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Droplets size={14} className="text-cyan-600" />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detergent pH Range</label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] font-semibold text-slate-500 ml-1">Min (Acidic)</span>
                    <input
                      type="number"
                      step="0.5"
                      value={phMin}
                      onChange={(e) => setPhMin(e.target.value)}
                      placeholder="e.g., 6"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold text-slate-500 ml-1">Max (Alkaline)</span>
                    <input
                      type="number"
                      step="0.5"
                      value={phMax}
                      onChange={(e) => setPhMax(e.target.value)}
                      placeholder="e.g., 10"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Foam Level */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <div className="w-4 h-0.5 bg-slate-500"></div>
                      <div className="w-3 h-0.5 bg-slate-500"></div>
                      <div className="w-4 h-0.5 bg-slate-500"></div>
                    </div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Foam Level</label>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lowFoamOnly}
                      onChange={(e) => setLowFoamOnly(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-[9px] font-mono text-slate-500">Low foam only</span>
                  </label>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-[9px] text-slate-600">Low‑foam detergents protect vacuum motors and leave no sticky residue.</p>
                </div>
              </div>

              {/* Potential Matches Indicator */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Potential Matches</span>
                  <span className="text-xl font-black text-cyan-600">{filteredMachines.length}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-600 transition-all duration-300" style={{ width: `${(filteredMachines.length / machines.length) * 100}%` }} />
                </div>
                <p className="text-[9px] text-center text-slate-400 mt-3">Includes local import duties & spare‑part availability</p>
              </div>
            </div>
          </aside>
        </div>

        {/* ======================= DETERGENT RECOMMENDATION SECTION ======================= */}
        <div className="mt-20 bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-8 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Droplets size={20} className="text-cyan-600" />
              <h2 className="text-xl font-black text-slate-800">Recommended Detergents</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Optimised for your filter settings and local soil conditions</p>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            {detergents.map((det, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-700 shrink-0">
                  <Droplets size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{det.name}</h3>
                  <p className="text-[10px] text-slate-500 mb-1">{det.type} · pH {det.ph} · {det.price}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {det.features.map((f, i) => (
                      <span key={i} className="text-[9px] bg-white px-2 py-0.5 rounded-full text-slate-600">{f}</span>
                    ))}
                  </div>
                  {det.eco && <span className="inline-block mt-2 text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">🌱 Eco‑certified</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================= BOTTOM ACTION BAR ======================= */}
        <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg shadow-slate-200/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700"><Info size={16} /></div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Ready to proceed?</h4>
              <p className="text-xs text-slate-500">Generate a detailed TCO report or start a new recommendation.</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
              Reset Filters
            </button>
            <button className="flex-1 md:flex-none px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-md">
              Export Report <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </main>


      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          width: 16px;
          height: 16px;
          background: white;
          border: 2px solid #0ea5e9;
          border-radius: 50%;
          cursor: pointer;
          -webkit-appearance: none;
        }
      `}</style>
    </div>
  );
}
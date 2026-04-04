import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Zap,
  Battery,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  X,
  Plus,
  Minus,
  TrendingDown,
  Wrench,
  DollarSign,
  Shield
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Full equipment database (same as before, extended)
const equipmentDatabase = [
  {
    id: 1,
    name: "Kärcher B 40 C/W Bp",
    type: "Scrubber‑dryer",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600",
    powerType: "Battery",
    powerSpec: "24V / Unstable‑Ready",
    tco: "UGX 4.25M",
    tcoYearly: "UGX 1.2M",
    tags: ["Tiled", "Concrete", "Epoxy"],
    surfaceSensitivity: 40,
    detergentCompat: "pH 7-10",
    partsAvailability: "High (Kampala)",
    match: 94,
    features: ["Voltage spike protection", "Brush pressure for tiles", "Dosing system", "Compact design"]
  },
  {
    id: 2,
    name: "Kärcher HD 6/13 C",
    type: "Pressure Washer",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
    powerType: "Electric",
    powerSpec: "3.0kW / 240V",
    tco: "UGX 2.8M",
    tcoYearly: "UGX 850k",
    tags: ["Concrete", "Laterite"],
    surfaceSensitivity: 20,
    detergentCompat: "pH 8-12",
    partsAvailability: "Medium (2 weeks)",
    match: 88,
    features: ["High pressure", "Thermal relief", "Easy start"]
  },
  {
    id: 3,
    name: "Nilfisk SC401 B",
    type: "Industrial Vacuum",
    image: "https://images.unsplash.com/photo-1598514982845-1b6b8b1d9a2f?auto=format&fit=crop&q=80&w=600",
    powerType: "Battery",
    powerSpec: "Heavy Duty / Li‑ion",
    tco: "UGX 5.6M",
    tcoYearly: "UGX 1.4M",
    tags: ["Vinyl", "Carpet", "Tiled"],
    surfaceSensitivity: 60,
    detergentCompat: "pH 6-9",
    partsAvailability: "High (Direct Agent)",
    match: 91,
    features: ["Quiet operation", "One‑touch start", "Hybrid vacuum"]
  },
  {
    id: 4,
    name: "Numatic TTB 1840",
    type: "Single‑Disc Machine",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
    powerType: "Battery",
    powerSpec: "Li‑Ion / Fast Charge",
    tco: "UGX 4.95M",
    tcoYearly: "UGX 1.1M",
    tags: ["Concrete", "Vinyl"],
    surfaceSensitivity: 50,
    detergentCompat: "pH 6-9",
    partsAvailability: "High (Direct Agent)",
    match: 95,
    features: ["Compact", "Stainless steel", "Simple controls"]
  }
];

const detergents = [
  { name: "CleanPro Ultra‑Base (UG)", ph: 9, price: "UGX 85,000/5L", features: ["Red laterite suspension", "Non‑foaming"], eco: true },
  { name: "SLC Neutral Concentrate", ph: 7, price: "UGX 72,000/5L", features: ["Low foam", "No residue"], eco: false }
];

export default function RecommendationResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};

  const [filteredMachines, setFilteredMachines] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Simulate filtering based on formData (in real app, use backend)
  useEffect(() => {
    // Artificial delay for "cool animation"
    setTimeout(() => {
      if (formData) {
        const results = equipmentDatabase.filter(m => {
          if (formData.dirtType === "red laterite" && !m.tags.some(t => t.toLowerCase().includes('laterite') || t.toLowerCase().includes('tile'))) return false;
          if (formData.surfaceType === "concrete" && !m.tags.includes("Concrete")) return false;
          if (formData.powerStability === "unstable" && m.powerType !== "Battery") return false;
          if (formData.sparePartsTolerance === "high" && m.partsAvailability.toLowerCase().includes('low')) return false;
          const priceNum = parseInt(m.tco.replace(/[^0-9]/g, ''));
          if (priceNum > parseInt(formData.budget) * 1.3) return false;
          return true;
        });
        setFilteredMachines(results.length ? results : equipmentDatabase);
      } else {
        setFilteredMachines(equipmentDatabase);
      }
      setAnimate(true);
    }, 800);
  }, [formData]);

  const addToCompare = (machine) => {
    if (compareList.length < 2 && !compareList.find(m => m.id === machine.id)) {
      setCompareList([...compareList, machine]);
    }
  };

  const removeFromCompare = (id) => {
    setCompareList(compareList.filter(m => m.id !== id));
  };

  const openCompare = () => setShowCompare(true);
  const closeCompare = () => setShowCompare(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-cyan-200">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,0.4)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#0ea5e9 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold tracking-[0.2em] uppercase rounded-full mb-4">
            <CheckCircle2 size={12} /> Analysis Complete
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Intelligent Recommendations</span>
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Based on your site profile, these are the most compatible machines and detergents.</p>
        </div>

        {/* Machine Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 delay-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {filteredMachines.map((machine) => (
            <div key={machine.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-100 hover:border-cyan-300 transition-all duration-500">
              <div className="h-56 relative bg-slate-100 overflow-hidden">
                <img src={machine.image} alt={machine.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-black text-cyan-600 shadow-sm">
                  {machine.match}% MATCH
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-slate-900">{machine.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{machine.type}</p>
                <div className="flex justify-between items-center text-xs text-slate-600 mb-4">
                  <span className="flex items-center gap-1"><Zap size={12} className="text-cyan-500" /> {machine.powerSpec}</span>
                  <span className="flex items-center gap-1"><DollarSign size={12} className="text-emerald-500" /> {machine.tcoYearly}/yr</span>
                </div>
                <div className="flex gap-2 mb-4">
                  {machine.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => addToCompare(machine)}
                    disabled={compareList.length >= 2 || compareList.find(m => m.id === machine.id)}
                    className="flex-1 py-2 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-50 hover:border-cyan-300 transition-all disabled:opacity-40"
                  >
                    Compare
                  </button>
                  <button className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-600 transition-all flex items-center justify-center gap-1">
                    Details <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detergent Section */}
        <div className={`mt-20 bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden transition-all duration-700 delay-400 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-8 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Droplets size={20} className="text-cyan-600" />
              <h2 className="text-xl font-black text-slate-800">Recommended Detergents</h2>
            </div>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            {detergents.map((det, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center"><Droplets size={24} className="text-cyan-700" /></div>
                <div>
                  <h3 className="font-bold text-slate-800">{det.name}</h3>
                  <p className="text-[10px] text-slate-500">pH {det.ph} · {det.price}</p>
                  <div className="flex gap-1 mt-2">
                    {det.features.map((f, i) => <span key={i} className="text-[9px] bg-white px-2 py-0.5 rounded-full">{f}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compare Bar (sticky) */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white rounded-full px-6 py-3 shadow-2xl flex items-center gap-6 z-50">
            <span className="text-xs font-bold">{compareList.length}/2 selected</span>
            <div className="flex gap-2">
              {compareList.map(m => (
                <div key={m.id} className="flex items-center gap-2 bg-slate-700 rounded-full px-3 py-1 text-[10px]">
                  {m.name}
                  <button onClick={() => removeFromCompare(m.id)}><X size={12} /></button>
                </div>
              ))}
            </div>
            <button 
              onClick={openCompare}
              disabled={compareList.length !== 2}
              className="px-4 py-1.5 bg-cyan-600 rounded-full text-xs font-bold hover:bg-cyan-500 disabled:opacity-50"
            >
              Compare Now
            </button>
          </div>
        )}

        {/* Compare Modal */}
        {showCompare && compareList.length === 2 && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center">
                <h3 className="font-black text-slate-800 flex items-center gap-2"><BarChart3 size={18} /> Compare Machines</h3>
                <button onClick={closeCompare} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-8">
                {compareList.map(m => (
                  <div key={m.id} className="border border-slate-200 rounded-xl p-5">
                    <h4 className="text-lg font-black">{m.name}</h4>
                    <div className="space-y-3 mt-4 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Power</span><span className="font-bold">{m.powerSpec}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Upfront TCO</span><span className="font-bold">{m.tco}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Yearly cost</span><span className="font-bold">{m.tcoYearly}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Spare parts</span><span className="font-bold">{m.partsAvailability}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Detergent pH</span><span className="font-bold">{m.detergentCompat}</span></div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[10px] uppercase text-slate-400">Key features</span>
                      <ul className="mt-2 space-y-1">
                        {m.features.slice(0, 3).map((f, i) => <li key={i} className="text-xs flex gap-2"><CheckCircle2 size={12} className="text-emerald-500" />{f}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <button className="px-6 py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold">Export Comparison</button>
              </div>
            </div>
          </div>
        )}

        {/* Back to Home Button */}
        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-white border border-slate-200 rounded-full text-slate-700 font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all"
          >
            ← Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
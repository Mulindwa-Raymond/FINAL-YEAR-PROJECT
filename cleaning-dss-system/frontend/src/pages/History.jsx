import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History as HistoryIcon,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Download,
  RotateCcw,
  Trash2,
  Filter,
  Search,
  ChevronRight,
  Zap,
  Droplet,
  BarChart3,
  Activity,
  FileText,
  Star,
  StarOff
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Mock data for demonstration (in real app, fetch from backend/localStorage)
const mockRecommendations = [
  {
    id: 1,
    date: '2026-04-02',
    time: '14:32',
    siteName: 'Kampala Central Office',
    surfaceType: 'Tile',
    dirtType: 'Red Laterite',
    area: '850 m²',
    budget: 'UGX 5,200,000',
    recommendedMachines: [
      { name: 'Kärcher B 40 C/W Bp', match: 94, tco: 'UGX 4.25M' },
      { name: 'Numatic TTB 1840', match: 92, tco: 'UGX 4.95M' }
    ],
    recommendedDetergent: 'CleanPro Ultra‑Base (UG)',
    status: 'completed',
    saved: true,
    reportUrl: '#'
  },
  {
    id: 2,
    date: '2026-03-28',
    time: '09:15',
    siteName: 'Mukono Warehouse',
    surfaceType: 'Concrete',
    dirtType: 'Industrial Grease',
    area: '2,400 m²',
    budget: 'UGX 12,000,000',
    recommendedMachines: [
      { name: 'Kärcher B 90 R', match: 91, tco: 'UGX 12.8M' },
      { name: 'Nilfisk SC250', match: 85, tco: 'UGX 7.2M' }
    ],
    recommendedDetergent: 'SLC Concentrate',
    status: 'completed',
    saved: true,
    reportUrl: '#'
  },
  {
    id: 3,
    date: '2026-03-25',
    time: '11:45',
    siteName: 'Hotel Equatorial',
    surfaceType: 'Marble',
    dirtType: 'General Dust',
    area: '320 m²',
    budget: 'UGX 3,000,000',
    recommendedMachines: [
      { name: 'Nilfisk SC401 B', match: 88, tco: 'UGX 5.6M' }
    ],
    recommendedDetergent: 'CleanPro Ultra‑Base (UG)',
    status: 'completed',
    saved: false,
    reportUrl: '#'
  },
  {
    id: 4,
    date: '2026-03-20',
    time: '16:20',
    siteName: 'Jinja Industrial Park',
    surfaceType: 'Epoxy',
    dirtType: 'Red Laterite',
    area: '1,200 m²',
    budget: 'UGX 8,500,000',
    recommendedMachines: [
      { name: 'Kärcher B 40 C/W Bp', match: 94, tco: 'UGX 4.25M' },
      { name: 'Numatic TTB 1840', match: 95, tco: 'UGX 4.95M' }
    ],
    recommendedDetergent: 'CleanPro Ultra‑Base (UG)',
    status: 'completed',
    saved: true,
    reportUrl: '#'
  }
];

const mockActivities = [
  { id: 1, action: 'Generated recommendation for Kampala Central Office', timestamp: '2026-04-02 14:32', type: 'recommendation' },
  { id: 2, action: 'Exported TCO report for Mukono Warehouse', timestamp: '2026-03-28 10:05', type: 'export' },
  { id: 3, action: 'Saved recommendation #3 to profile', timestamp: '2026-03-25 11:50', type: 'save' },
  { id: 4, action: 'Viewed details of Kärcher B 90 R', timestamp: '2026-03-20 16:45', type: 'view' },
  { id: 5, action: 'Compared two machines (Kärcher B 40 vs Numatic TTB)', timestamp: '2026-03-15 09:30', type: 'compare' },
];

export default function HistoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSaved, setFilterSaved] = useState(false);
  const [recommendations, setRecommendations] = useState(mockRecommendations);

  const toggleSaved = (id) => {
    setRecommendations(prev =>
      prev.map(rec => rec.id === id ? { ...rec, saved: !rec.saved } : rec)
    );
  };

  const filteredRecs = recommendations.filter(rec => {
    const matchesSearch = rec.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.surfaceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.dirtType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSaved = filterSaved ? rec.saved === true : true;
    return matchesSearch && matchesSaved;
  });

  const handleViewDetails = (id) => {
    // Navigate to a details page or open modal – for demo, we just alert
    alert(`View details for recommendation #${id} (integrate with actual page)`);
  };

  const handleReRun = (rec) => {
    // Pre‑fill the site & task profile with this recommendation's data and navigate
    navigate('/site-task-profile', { state: { prefill: rec } });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-cyan-200">
      {/* Tech Background (matching home) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,0.4)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: `radial-gradient(#0ea5e9 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 border border-cyan-200 text-cyan-700 text-[10px] font-mono font-bold tracking-[0.2em] uppercase rounded-full mb-4">
            <HistoryIcon size={12} /> Activity Log
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            Recommendation <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">History</span>
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl">View, manage, and re‑run your past equipment and detergent recommendations.</p>
        </div>

        {/* Tabs / Sections */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN: Saved Recommendations */}
          <div className="lg:w-2/3 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-slate-800">Saved Reports</h2>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-mono">{filteredRecs.length} items</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by site, surface, soil..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:border-cyan-400 outline-none"
                  />
                </div>
                <button
                  onClick={() => setFilterSaved(!filterSaved)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterSaved ? 'bg-cyan-100 text-cyan-700 border border-cyan-200' : 'bg-white border border-slate-200 text-slate-500'
                  }`}
                >
                  <Star size={14} /> Saved only
                </button>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-5">
              {filteredRecs.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">No recommendations found.</p>
                </div>
              ) : (
                filteredRecs.map(rec => (
                  <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                    <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-black text-slate-800">{rec.siteName}</h3>
                            <button onClick={() => toggleSaved(rec.id)} className="text-amber-500 hover:text-amber-600 transition">
                              {rec.saved ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {rec.date}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {rec.time}</span>
                            <span className="flex items-center gap-1"><Zap size={12} className="text-cyan-500" /> {rec.surfaceType}</span>
                            <span className="flex items-center gap-1"><Droplet size={12} className="text-cyan-500" /> {rec.dirtType}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleViewDetails(rec.id)} className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-50 transition flex items-center gap-1">
                            <Eye size={12} /> View
                          </button>
                          <button onClick={() => handleReRun(rec)} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-600 transition flex items-center gap-1">
                            <RotateCcw size={12} /> Re‑run
                          </button>
                          <button className="px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-red-50 hover:text-red-600 transition">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-[10px] font-mono uppercase text-slate-400 mb-2">Matched Machines</p>
                          <div className="space-y-2">
                            {rec.recommendedMachines.map((m, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-700">{m.name}</span>
                                <div className="flex gap-3">
                                  <span className="text-cyan-600 text-xs font-bold">{m.match}% match</span>
                                  <span className="text-slate-500 text-xs">{m.tco}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-mono uppercase text-slate-400 mb-2">Recommended Detergent</p>
                          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl">
                            <Droplet size={16} className="text-cyan-500" />
                            <span className="text-sm font-medium text-slate-800">{rec.recommendedDetergent}</span>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button className="text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
                              <Download size={12} /> Download PDF Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Recent Activity & Stats */}
          <div className="lg:w-1/3 space-y-8">
            {/* Activity Feed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
                <Activity size={18} className="text-cyan-600" />
                <h2 className="font-black text-slate-800">Recent Activity</h2>
              </div>
              <div className="space-y-4">
                {mockActivities.map(act => (
                  <div key={act.id} className="flex gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      {act.type === 'recommendation' && <CheckCircle2 size={14} className="text-emerald-500" />}
                      {act.type === 'export' && <Download size={14} className="text-blue-500" />}
                      {act.type === 'save' && <Star size={14} className="text-amber-500" />}
                      {act.type === 'view' && <Eye size={14} className="text-cyan-500" />}
                      {act.type === 'compare' && <BarChart3 size={14} className="text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-700 text-xs leading-relaxed">{act.action}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{act.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-2 text-center text-xs text-cyan-600 hover:text-cyan-700 font-bold uppercase tracking-wider">
                View Full Log →
              </button>
            </div>

            {/* Stats Summary */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
              <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={18} /> Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total recommendations</span>
                  <span className="font-bold text-slate-800">{mockRecommendations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Saved reports</span>
                  <span className="font-bold text-slate-800">{mockRecommendations.filter(r => r.saved).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Exported PDFs</span>
                  <span className="font-bold text-slate-800">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Most used machine</span>
                  <span className="font-bold text-slate-800">Kärcher B 40 C/W Bp</span>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-cyan-200/50">
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>Last activity: {mockActivities[0].timestamp}</span>
                </div>
              </div>
            </div>

            {/* Quick Tip */}
            <div className="bg-slate-800 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Pro Tip</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Re‑run a past recommendation to adjust parameters like budget or surface type — the system will refresh the matching and TCO.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
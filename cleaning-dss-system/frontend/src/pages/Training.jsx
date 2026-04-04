import React, { useState } from 'react';
import { 
  Play,
  Download,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Droplet,
  Wrench,
  Shield,
  BookOpen,
  Video,
  FileText,
  Award,
  Clock,
  Battery,
  Thermometer,
  MapPin,
  Users,
  Building
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Training modules data (based on SRS and local context)
const trainingModules = [
  {
    id: 'machine-basics',
    title: 'Machine Operation Basics',
    icon: <Wrench size={20} />,
    description: 'How to safely operate scrubber-dryers, pressure washers, and single-disc machines.',
    duration: '25 min',
    level: 'Beginner',
    topics: ['Start-up procedures', 'Adjusting brush pressure', 'Water flow control', 'Emergency stop'],
    videoUrl: 'https://youtube/SPGkwtwhyh8?si=ZtdX_HkCebtzFhXe',
    pdfGuide: '#'
  },
  {
    id: 'maintenance',
    title: 'Preventive Maintenance',
    icon: <Shield size={20} />,
    description: 'Extend machine life with proper cleaning, battery care, and spare-part management.',
    duration: '35 min',
    level: 'Intermediate',
    topics: ['Daily cleaning checklist', 'Battery watering & charging', 'Brush/pad replacement', 'Squeegee adjustment'],
    videoUrl: 'https://youtube/SPGkwtwhyh8?si=ZtdX_HkCebtzFhXe',
    pdfGuide: '#'
  },
  {
    id: 'detergent-safety',
    title: 'Detergent Handling & Compatibility',
    icon: <Droplet size={20} />,
    description: 'Understand pH levels, dilution ratios, and safe chemical use for different surfaces.',
    duration: '20 min',
    level: 'Beginner',
    topics: ['pH scale explained', 'Matching detergent to soil type', 'Dilution calculators', 'PPE requirements'],
    videoUrl: 'https://youtu.be/SPGkwtwhyh8?si=ZtdX_HkCebtzFhXe',
    pdfGuide: '#'
  },
  {
    id: 'local-adaptation',
    title: 'Ugandan Site Adaptation',
    icon: <MapPin size={20} />,
    description: 'Deal with red laterite soil, power fluctuations, and high humidity.',
    duration: '30 min',
    level: 'Advanced',
    topics: ['Red laterite soil removal techniques', 'Surge protection & battery backup', 'Spare-part sourcing in Kampala', 'Humidity-resistant materials'],
    videoUrl: 'https://youtu.be/SPGkwtwhyh8?si=ZtdX_HkCebtzFhXe',
    pdfGuide: '#'
  },
  {
    id: 'tco-analysis',
    title: 'Total Cost of Ownership (TCO)',
    icon: <Clock size={20} />,
    description: 'Calculate 5-year costs including import duties, maintenance, and energy.',
    duration: '40 min',
    level: 'Advanced',
    topics: ['Import duty estimation', 'Energy cost calculation', 'Spare-part lifecycles', 'Resale value'],
    videoUrl: 'https://youtu.be/SPGkwtwhyh8?si=ZtdX_HkCebtzFhXe',
    pdfGuide: '#'
  },
  {
    id: 'safety-compliance',
    title: 'Workplace Safety & Compliance',
    icon: <Shield size={20} />,
    description: 'OSHA‑aligned safety for cleaning crews and chemical storage.',
    duration: '25 min',
    level: 'Intermediate',
    topics: ['Chemical labelling', 'Emergency response', 'Noise protection', 'Floor marking standards'],
    videoUrl: 'https://youtu.be/SPGkwtwhyh8?si=ZtdX_HkCebtzFhXe',
    pdfGuide: '#'
  }
];

// Quick tips based on SRS themes
const quickTips = [
  { icon: <Battery size={16} />, text: 'For unstable power, always use battery‑powered scrubbers (Rule R02).' },
  { icon: <Wrench size={16} />, text: 'Check spare‑part lead time before buying – local stock saves downtime (Theme 1).' },
  { icon: <Droplet size={16} />, text: 'Red laterite soil requires alkaline detergent (pH 8‑10) (Rule R01).' },
  { icon: <AlertTriangle size={16} />, text: 'Never use steel wire pads on vinyl – causes irreversible damage (Rule R07).' }
];

export default function Training() {
  const [activeModule, setActiveModule] = useState(trainingModules[0]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, video, pdf

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-cyan-200">
      {/* Tech background (matching home) */}
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
            <BookOpen size={12} /> Staff Knowledge Hub
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            Training & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Resource Centre</span>
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl">Empower your team with essential skills for machine operation, maintenance, detergent safety, and local best practices.</p>
        </div>

        {/* Quick Tips Row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {quickTips.map((tip, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 flex items-start gap-3 shadow-sm">
              <div className="text-cyan-600 mt-0.5">{tip.icon}</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar: Modules List */}
          <div className="lg:w-1/3 space-y-3">
            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Wrench size={18} /> Training Modules</h2>
            <div className="space-y-2">
              {trainingModules.map(module => (
                <button
                  key={module.id}
                  onClick={() => { setActiveModule(module); setActiveTab('overview'); }}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-start gap-3 ${
                    activeModule.id === module.id 
                      ? 'bg-white border border-cyan-200 shadow-md shadow-cyan-100' 
                      : 'bg-white/60 border border-slate-200 hover:border-cyan-200 hover:shadow-sm'
                  }`}
                >
                  <div className={`mt-0.5 ${activeModule.id === module.id ? 'text-cyan-600' : 'text-slate-400'}`}>
                    {module.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${activeModule.id === module.id ? 'text-cyan-700' : 'text-slate-800'}`}>
                      {module.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{module.duration} · {module.level}</p>
                  </div>
                  <ChevronRight size={14} className={`ml-auto ${activeModule.id === module.id ? 'text-cyan-500' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            {/* Downloadable Resources Card */}
            <div className="mt-8 bg-slate-800 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={18} className="text-cyan-400" />
                <h3 className="font-black text-sm">Offline Resources</h3>
              </div>
              <ul className="space-y-3 text-xs">
                <li className="flex items-center justify-between">
                  <span>Machine Operator's Handbook</span>
                  <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"><Download size={12} /> PDF</button>
                </li>
                <li className="flex items-center justify-between">
                  <span>Detergent Compatibility Matrix</span>
                  <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"><Download size={12} /> PDF</button>
                </li>
                <li className="flex items-center justify-between">
                  <span>Preventive Maintenance Checklist</span>
                  <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"><Download size={12} /> PDF</button>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Active Module Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              {/* Module Header */}
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-cyan-600">{activeModule.icon}</div>
                      <h2 className="text-xl font-black text-slate-800">{activeModule.title}</h2>
                    </div>
                    <p className="text-sm text-slate-500 max-w-xl">{activeModule.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <Clock size={12} /> {activeModule.duration} · {activeModule.level}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 px-6">
                {['overview', 'video', 'pdf'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === tab 
                        ? 'border-b-2 border-cyan-500 text-cyan-700' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab === 'overview' && '📖 Lesson'}
                    {tab === 'video' && '🎥 Video'}
                    {tab === 'pdf' && '📄 Guide'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 mb-3">What you'll learn</h3>
                      <ul className="space-y-2">
                        {activeModule.topics.map((topic, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <h3 className="text-sm font-black text-slate-800 mb-2">Why this matters for Uganda</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Based on industry research (SRS Sections 2.2.6 & 3.1.1), training covers critical local factors: 
                        spare‑part scarcity, power instability, red laterite soil, and import duty calculations. 
                        Mastering these reduces equipment downtime by up to 40% and lowers TCO by 25%.
                      </p>
                    </div>
                    <div className="bg-cyan-50 rounded-xl p-4 flex items-start gap-3">
                      <Award size={20} className="text-cyan-700 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-cyan-800 uppercase tracking-wider">Certification Ready</p>
                        <p className="text-xs text-cyan-700 mt-0.5">Complete all modules to earn a CleanMatch Operator Certificate.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'video' && (
                  <div className="space-y-4">
                    <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden">
                      <iframe 
                        src={activeModule.videoUrl} 
                        title={activeModule.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 flex items-center gap-1"><Play size={12} /> Watch the full demonstration</span>
                      <button className="text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1"><Download size={12} /> Download video</button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      *This video illustrates best practices for Ugandan conditions (power fluctuation adaptation, red laterite removal techniques).
                    </p>
                  </div>
                )}

                {activeTab === 'pdf' && (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Comprehensive PDF Guide</h3>
                    <p className="text-sm text-slate-500 mb-6">Includes step‑by‑step instructions, checklists, and local supplier references.</p>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold text-sm hover:bg-cyan-700 transition shadow-md">
                      <Download size={16} /> Download {activeModule.title} Guide (PDF)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Related SRS References */}
            <div className="mt-6 text-[10px] text-slate-400 text-center border-t border-slate-100 pt-6">
              <span className="flex items-center justify-center gap-2"><BookOpen size={12} /> FR-15: Staff training module with visual guides – aligned with stakeholder requirements (Section 3.1.1, Table 6).</span>
            </div>
          </div>
        </div>

        {/* Additional Section: Upcoming Webinars / Live Training */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700"><Users size={24} /></div>
              <div>
                <h3 className="font-black text-slate-800">Live Training Sessions</h3>
                <p className="text-xs text-slate-500">Join our monthly virtual workshops with industry experts.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600">Next: 15 May 2026 – Machine Maintenance</span>
              <button className="px-5 py-2 bg-cyan-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-700 transition">Register</button>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
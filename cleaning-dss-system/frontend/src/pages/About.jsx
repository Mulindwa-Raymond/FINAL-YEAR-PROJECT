import React, { useState } from 'react';
import { 
  Mail, 
  Linkedin, 
  Github, 
  Twitter, 
  MapPin, 
  Calendar, 
  Award, 
  Shield, 
  Cpu, 
  Sparkles,
  Zap,
  Droplet,
  Wrench,
  BarChart3,
  Globe,
  X,
  ExternalLink,
  Phone,
  Users,
  BookOpen
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Developer data
const developers = [
  {
    id: 1,
    name: "Mulindwa Raymond",
    role: "Project Developer & Team Lead",
    email: "mulindwa.raymond27@students.mak.ac.ug",
    phone: "+256 123 456 789",
    bio: "Full-stack developer with expertise in React, Node.js, and MongoDB. Leads the DSS architecture and integration of the rule engine.",
    avatar: "https://ui-avatars.com/api/?name=Mulindwa+Raymond&background=0ea5e9&color=fff&size=128",
    skills: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    social: {
      linkedin: "#",
      github: "#",
      twitter: "#"
    }
  },
  {
    id: 2,
    name: "Ddamulira Charles",
    role: "Project Developer",
    email: "ddamulira.charles@students.mak.ac.ug",
    phone: "+256 234 567 890",
    bio: "Backend specialist focused on the knowledge base and rule engine. Implements TCO calculation algorithms and local duty integration.",
    avatar: "https://ui-avatars.com/api/?name=Ddamulira+Charles&background=0ea5e9&color=fff&size=128",
    skills: ["Express.js", "MongoDB", "Python", "API Design"],
    social: {
      linkedin: "#",
      github: "#",
      twitter: "#"
    }
  },
  {
    id: 3,
    name: "Ssenyonga Kevin",
    role: "Project Developer",
    email: "ssenyonga.kevin@students.mak.ac.ug",
    phone: "+256 345 678 901",
    bio: "Frontend engineer crafting intuitive UI components and ensuring responsive design across devices. Specialises in data visualisation.",
    avatar: "https://ui-avatars.com/api/?name=Ssenyonga+Kevin&background=0ea5e9&color=fff&size=128",
    skills: ["React", "Tailwind CSS", "D3.js", "Figma"],
    social: {
      linkedin: "#",
      github: "#",
      twitter: "#"
    }
  },
  {
    id: 4,
    name: "Luwagga Eric",
    role: "Project Developer",
    email: "luwagga.eric57@students.mak.ac.ug",
    phone: "+256 456 789 012",
    bio: "Database administrator and security analyst. Manages MongoDB schemas, user authentication, and data encryption (AES-256).",
    avatar: "https://ui-avatars.com/api/?name=Luwagga+Eric&background=0ea5e9&color=fff&size=128",
    skills: ["MongoDB", "JWT", "Security", "Cloud Deployment"],
    social: {
      linkedin: "#",
      github: "#",
      twitter: "#"
    }
  },
  {
    id: 5,
    name: "Ssebunya Ronald",
    role: "Project Developer",
    email: "ssebunya.ronald@students.mak.ac.ug",
    phone: "+256 567 890 123",
    bio: "QA and documentation lead. Ensures system reliability, writes test cases, and maintains user manuals and training materials.",
    avatar: "https://ui-avatars.com/api/?name=Ssebunya+Ronald&background=0ea5e9&color=fff&size=128",
    skills: ["Testing", "Documentation", "User Training", "Agile"],
    social: {
      linkedin: "#",
      github: "#",
      twitter: "#"
    }
  }
];

// Key system features (from SRS)
const features = [
  { icon: <Cpu size={20} />, title: "Vendor‑Neutral Matching", desc: "Unbiased recommendations based on technical fit, not brand partnerships." },
  { icon: <BarChart3 size={20} />, title: "Local TCO Calculator", desc: "5‑year cost modelling including import duties, spare parts, and energy." },
  { icon: <Droplet size={20} />, title: "Chemical Compatibility", desc: "pH‑based alerts to prevent corrosion and surface damage." },
  { icon: <Zap size={20} />, title: "Power Stability Guard", desc: "Recommends battery‑powered or surge‑protected units for unstable grids." },
  { icon: <Wrench size={20} />, title: "Spare‑Part Intelligence", desc: "Flags machines with poor local parts availability (lead time >21 days)." },
  { icon: <Globe size={20} />, title: "Uganda‑Optimised", desc: "Built for red laterite soil, high humidity, and equatorial conditions." }
];

export default function About() {
  const [selectedDev, setSelectedDev] = useState(null);

  const openModal = (dev) => setSelectedDev(dev);
  const closeModal = () => setSelectedDev(null);

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
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 border border-cyan-200 text-cyan-700 text-[10px] font-mono font-bold tracking-[0.2em] uppercase rounded-full mb-4">
            <Sparkles size={12} /> Meet the Team
          </div>
          <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-900">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">CleanMatch</span>
          </h1>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            A vendor‑neutral Decision Support System (DSS) engineered for Ugandan cleaning companies — reducing procurement errors, optimising TCO, and ensuring chemical safety.
          </p>
        </div>

        {/* Project Overview Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl p-8 mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2"><Shield size={24} className="text-cyan-600" /> Project Overview</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                CleanMatch is the outcome of a comprehensive requirements study conducted with 5 Ugandan cleaning firms (Kweeeza Cleaning, Power Products Uganda Ltd, Freshly Kleen, C‑JAY Home Solutions, SASSY DRY Cleaners). 
                Using purposive sampling and triangulation (questionnaires, interviews, observations), we identified critical gaps: vendor bias (avg. 4.6/5), chemical incompatibility (4.2/5), and absent TCO awareness.
              </p>
              <p className="text-slate-600 leading-relaxed">
                The system implements 16 functional requirements (FR-01 to FR-16) including local TCO modelling, chemical pH alerts, spare‑part lead‑time flags, and eco‑friendly prioritisation. 
                Built with React, Node.js, and MongoDB, it delivers recommendations within 5 seconds (NFR-01) and is fully responsive (NFR-04).
              </p>
            </div>
            <div className="md:w-1/3 bg-slate-50 rounded-xl p-5 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={16} className="text-cyan-600" />
                <span className="text-xs font-bold text-slate-700">Submission Deadline</span>
              </div>
              <p className="text-2xl font-black text-slate-800 mb-4">17th March 2026</p>
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} className="text-cyan-600" />
                <span className="text-xs font-bold text-slate-700">Supervisor</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">Dr. Florence N. Kivunike</p>
              <p className="text-xs text-slate-500">Department of Information Systems, Makerere University</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-2xl font-black text-slate-800 mb-8 text-center">Key System Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-cyan-200 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700 mb-4 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Developers Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-slate-800 flex items-center justify-center gap-2"><Users size={24} className="text-cyan-600" /> Development Team</h2>
            <p className="text-sm text-slate-500 mt-2">IST 3201 – Systems Development & Systems Security</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map(dev => (
              <div key={dev.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-cyan-100 hover:border-cyan-300 transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden">
                  <img src={dev.avatar} alt={dev.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-800">{dev.name}</h3>
                  <p className="text-xs font-mono text-cyan-600 font-bold uppercase tracking-wider mb-3">{dev.role}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{dev.bio.substring(0, 100)}...</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {dev.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-mono">{skill}</span>
                    ))}
                  </div>
                  <button 
                    onClick={() => openModal(dev)}
                    className="w-full py-2.5 bg-slate-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-600 transition-all flex items-center justify-center gap-2"
                  >
                    View Profile <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acknowledgements & Contact */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-100">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Acknowledgements</h3>
              <p className="text-sm text-slate-600 max-w-xl">
                We extend our sincere gratitude to all participating organisations, our supervisor Dr. Florence N. Kivunike, 
                and the Department of Information Systems for their guidance. Special thanks to the cleaning industry professionals 
                who shared their invaluable expertise during the requirements gathering phase.
              </p>
            </div>
            <div className="flex gap-4">
              <a href="mailto:info@cleanmatch.ug" className="p-3 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-cyan-600 hover:border-cyan-300 transition">
                <Mail size={20} />
              </a>
              <a href="#" className="p-3 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-cyan-600 hover:border-cyan-300 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-3 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-cyan-600 hover:border-cyan-300 transition">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Popup for Developer Details */}
        {selectedDev && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
              <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center">
                <h3 className="font-black text-slate-800">Developer Profile</h3>
                <button onClick={closeModal} className="p-1 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <img src={selectedDev.avatar} alt={selectedDev.name} className="w-20 h-20 rounded-full border-2 border-cyan-200" />
                  <div>
                    <h4 className="text-xl font-black text-slate-800">{selectedDev.name}</h4>
                    <p className="text-sm text-cyan-600 font-mono">{selectedDev.role}</p>
                  </div>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-slate-400" />
                    <a href={`mailto:${selectedDev.email}`} className="text-slate-600 hover:text-cyan-600">{selectedDev.email}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-slate-400" />
                    <span className="text-slate-600">{selectedDev.phone}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-slate-500 leading-relaxed">{selectedDev.bio}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Core Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDev.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 flex gap-4">
                    <a href="#" className="text-slate-400 hover:text-cyan-600 transition"><Linkedin size={20} /></a>
                    <a href="#" className="text-slate-400 hover:text-cyan-600 transition"><Github size={20} /></a>
                    <a href="#" className="text-slate-400 hover:text-cyan-600 transition"><Twitter size={20} /></a>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <button onClick={closeModal} className="px-6 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-cyan-600 transition">Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
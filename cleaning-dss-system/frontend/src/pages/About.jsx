/**
 * About.jsx
 * Comprehensive metadata and corporate context registry for Clean Match DSS.
 * 
 * Features:
 * - Structured hero configuration with localized baseline declarations
 * - Multi-column operational matrices mapping user requirements
 * - Performance metrics dashboard highlighting key institutional milestones
 * - Minimalist operator registry cards featuring modal inspection states
 * - Zero bottom margins to align flush with the application footer
 */

import React, { useState } from 'react';
import {
  Mail,
  Linkedin,
  Github,
  Twitter,
  Calendar,
  Award,
  Shield,
  Cpu,
  Zap,
  Droplet,
  Wrench,
  BarChart3,
  Globe,
  X,
  ExternalLink,
  Phone,
  Users,
  Target,
  Eye,
  Heart,
  Database,
  Server,
  Code,
  Lock,
  CheckCircle,
  GraduationCap,
  ShieldCheck,
  Building2,
  Sparkles,
  Gauge,
  Clock,
  MapPin,
  Briefcase,
  Star,
  GitBranch,
  Terminal,
  Layers,
  Activity
} from 'lucide-react';

// Custom inline SVG element representing rule engine graph structures
const Brain = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 4a4 4 0 0 1 3.5 6A4 4 0 0 1 12 18a4 4 0 0 1-3.5-6A4 4 0 0 1 12 4z"/>
    <path d="M12 8v8"/>
    <path d="M8 12h8"/>
  </svg>
);

const developers = [
  {
    id: 1,
    name: "Mulindwa Raymond",
    role: "Project Lead & Full-Stack Developer",
    email: "mulindwa.raymond27@students.mak.ac.ug",
    phone: "+256 782 123 456",
    bio: "Full-stack developer with expertise in React, Node.js, and MongoDB. Leads the DSS architecture and integration of the rule engine. Passionate about creating intelligent systems that solve real-world problems.",
    avatar: "https://ui-avatars.com/api/?name=Mulindwa+Raymond&background=1e40af&color=fff&size=128&bold=true&length=2",
    skills: ["React", "Node.js", "MongoDB", "Tailwind CSS", "Express", "JWT"],
    social: { linkedin: "https://linkedin.com/in/raymond-mulindwa", github: "https://github.com/raymond", twitter: "https://twitter.com/raymond" },
    contributions: ["System Architecture", "Inference Engine", "Frontend Lead"],
    commits: 247,
    experience: "4+ years",
    location: "Kampala, Uganda"
  },
  {
    id: 2,
    name: "Ddamulira Charles",
    role: "Backend Engineer",
    email: "ddamulira.charles@students.mak.ac.ug",
    phone: "+256 703 234 567",
    bio: "Backend specialist focused on the knowledge base and rule engine. Implements TCO calculation algorithms and local duty integration. Ensures API reliability and performance.",
    avatar: "https://ui-avatars.com/api/?name=Ddamulira+Charles&background=1e40af&color=fff&size=128&bold=true&length=2",
    skills: ["Express.js", "MongoDB", "Python", "API Design", "Redis", "Docker"],
    social: { linkedin: "https://linkedin.com/in/charles-ddamulira", github: "https://github.com/charles", twitter: "https://twitter.com/charles" },
    contributions: ["TCO Calculator", "Rule Engine", "Database Design"],
    commits: 198,
    experience: "3+ years",
    location: "Kampala, Uganda"
  },
  {
    id: 3,
    name: "Ssenyonga Kevin",
    role: "Frontend Engineer",
    email: "ssenyonga.kevin@students.mak.ac.ug",
    phone: "+256 755 345 678",
    bio: "Frontend engineer crafting intuitive UI components and ensuring responsive design across devices. Specialises in data visualisation and creating seamless user experiences.",
    avatar: "https://ui-avatars.com/api/?name=Ssenyonga+Kevin&background=1e40af&color=fff&size=128&bold=true&length=2",
    skills: ["React", "Tailwind CSS", "D3.js", "Figma", "Framer Motion", "Vite"],
    social: { linkedin: "https://linkedin.com/in/kevin-ssenyonga", github: "https://github.com/kevin", twitter: "https://twitter.com/kevin" },
    contributions: ["UI/UX Design", "Dashboard", "Responsive Layouts"],
    commits: 312,
    experience: "3+ years",
    location: "Kampala, Uganda"
  },
  {
    id: 4,
    name: "Luwagga Eric",
    role: "Database & Security Analyst",
    email: "luwagga.eric57@students.mak.ac.ug",
    phone: "+256 772 456 789",
    bio: "Database administrator and security analyst. Manages MongoDB schemas, user authentication, and data encryption (AES-256). Ensures data integrity and system security.",
    avatar: "https://ui-avatars.com/api/?name=Luwagga+Eric&background=1e40af&color=fff&size=128&bold=true&length=2",
    skills: ["MongoDB", "JWT", "Security", "Cloud Deployment", "AWS", "Encryption"],
    social: { linkedin: "https://linkedin.com/in/eric-luwagga", github: "https://github.com/eric", twitter: "https://twitter.com/eric" },
    contributions: ["Authentication", "Data Security", "Backup Systems"],
    commits: 156,
    experience: "4+ years",
    location: "Kampala, Uganda"
  },
  {
    id: 5,
    name: "Ssebunya Ronald",
    role: "QA & Documentation Lead",
    email: "ssebunya.ronald@students.mak.ac.ug",
    phone: "+256 701 567 890",
    bio: "QA and documentation lead. Ensures system reliability, writes test cases, and maintains user manuals and training materials. Passionate about quality assurance.",
    avatar: "https://ui-avatars.com/api/?name=Ssebunya+Ronald&background=1e40af&color=fff&size=128&bold=true&length=2",
    skills: ["Testing", "Documentation", "User Training", "Agile", "Jest", "Selenium"],
    social: { linkedin: "https://linkedin.com/in/ronald-ssebunya", github: "https://github.com/ronald", twitter: "https://twitter.com/ronald" },
    contributions: ["Testing Strategy", "User Guides", "Training Materials"],
    commits: 89,
    experience: "2+ years",
    location: "Kampala, Uganda"
  }
];

const features = [
  { icon: <Cpu size={20} />, title: "Vendor-Neutral Logic", desc: "Unbiased indexing parameters cross-referencing performance metrics without manufacturer allocation bias.", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { icon: <BarChart3 size={20} />, title: "Local TCO Accounting", desc: "5-year cost modeling matrices factoring regional tax brackets, electrical metrics, and component deterioration constants.", color: "bg-cyan-50 border-cyan-100 text-cyan-700" },
  { icon: <Droplet size={20} />, title: "Chemical Compatibility Match", desc: "Corrosion safety matrices calculating surface resilience profiles against chemical base pH ranges.", color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
  { icon: <Zap size={20} />, title: "Grid Fault Prototyping", desc: "Isolates and screens technical equipment criteria relative to grid parameters and operational protection requirements.", color: "bg-amber-50 border-amber-100 text-amber-700" },
  { icon: <Wrench size={20} />, title: "Logistics Optimization Logs", desc: "Identifies procurement assets subject to long import cycles or low regional parts distribution profiles.", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
  { icon: <Globe size={20} />, title: "Regional Site Profiling", desc: "Calibrated explicitly for humidity indexes, ambient dust counts, and rugged soil components typical of domestic fields.", color: "bg-purple-50 border-purple-100 text-purple-700" },
];

const techStack = [
  { name: "React 18", icon: <Code size={14} />, color: "bg-blue-50 border-blue-200 text-blue-700" },
  { name: "Node.js", icon: <Server size={14} />, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { name: "Express.js", icon: <Server size={14} />, color: "bg-slate-50 border-slate-200 text-slate-700" },
  { name: "MongoDB", icon: <Database size={14} />, color: "bg-green-50 border-green-200 text-green-700" },
  { name: "Tailwind CSS", icon: <Code size={14} />, color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
  { name: "JWT Auth", icon: <Lock size={14} />, color: "bg-amber-50 border-amber-200 text-amber-700" },
  { name: "REST API", icon: <GitBranch size={14} />, color: "bg-purple-50 border-purple-200 text-purple-700" },
  { name: "Docker", icon: <Terminal size={14} />, color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
];

const projectStats = [
  { label: "Functional Specs", value: "16", unit: "Validated FRs", icon: <CheckCircle size={16} />, gradient: "from-blue-500 to-blue-600" },
  { label: "Indexed Machinery", value: "81", unit: "System Nodes", icon: <Wrench size={16} />, gradient: "from-cyan-500 to-cyan-600" },
  { label: "Chemical Baselines", value: "30+", unit: "Compounds", icon: <Droplet size={16} />, gradient: "from-emerald-500 to-emerald-600" },
  { label: "Deterministic Mappings", value: "20+", unit: "Active Rules", icon: <Brain size={16} />, gradient: "from-purple-500 to-purple-600" },
];

export default function About() {
  const [selectedDev, setSelectedDev] = useState(null);

  const openModal = (dev) => setSelectedDev(dev);
  const closeModal = () => setSelectedDev(null);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30 text-slate-900 font-sans antialiased selection:bg-blue-100 overflow-x-hidden">
      
      {/* Background Elements - Matching Home Page */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.03)_0px,_rgba(59,130,246,0.03)_2px,_transparent_2px,_transparent_20px)]"></div>
      </div>

      <main className="relative z-10">
        {/* Hero Section - Clean & Professional */}
        <div className="relative pt-12 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4">
                Intelligent{' '}
                <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Structural Decision Support</span>
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
                Clean Match functions as an isolated engineering optimization index calibrated specifically to eliminate procurement overheads, 
                mitigate asset structural risk, and cross-reference industrial supply variables within East African facilities.
              </p>
            </div>
          </div>
        </div>

        {/* Main Workspace Frame */}
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-0 space-y-12">
          
          {/* Mission & Vision Strategic Layout Matrices - Enhanced */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                  <Target size={16} />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Functional Directives</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                To equip facility administrators with clear database tracking assets that neutralize cost estimation deltas, maintain equipment lifecycle targets, and enforce baseline operation safety metrics using local market inputs.
              </p>
            </div>
            
            <div className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white shadow-md">
                  <Eye size={16} />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Architecture Scope</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                To institutionalize data modeling parameters across logistics lines, establishing standard protocols for structural supply visibility, life cycle visibility, and eco-safe risk controls.
              </p>
            </div>
          </div>

          {/* Research Context & Performance Metrics Dashboard - Enhanced */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-3 gap-0">
              
              {/* Context Block */}
              <div className="md:col-span-2 p-6 lg:p-8 border-b md:border-b-0 md:border-r border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Building2 size={14} className="text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Enterprise Research Framework</h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium mb-3">
                  The Clean Match platform was systematically engineered from a rigorous baseline operational evaluation encompassing active facility operators within the Kampala metro area. Research documentation identified significant variance indices across operational environments, including structural brand dependency trends, extensive downtime on specialized parts procurement, and critical chemical component interaction faults.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  The software deploys exactly 16 strict functional criteria matrices to cross-reference equipment technical specifications against regional market baselines, delivering unweighted deterministic matching arrays within optimized processing cycles.
                </p>
              </div>
              
              {/* Analytical Highlights Block - Enhanced */}
              <div className="bg-gradient-to-br from-slate-50 to-white p-6 lg:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Registry Benchmarks</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {projectStats.map((stat, idx) => (
                      <div key={idx} className="group bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-all">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-2 text-white shadow-sm`}>
                          {stat.icon}
                        </div>
                        <p className="text-xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">{stat.label}</p>
                        <p className="text-[8px] text-slate-400 mt-1">{stat.unit}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-slate-200/80">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-1">
                    <Calendar size={12} className="text-slate-400" />
                    <span className="font-medium">Evaluation Period: Q1 2026</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <Award size={12} className="text-slate-400" />
                    <span className="font-medium">Academic Audit: Dr. F. N. Kivunike</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 ml-5">Makerere University Information Systems</p>
                </div>
              </div>

            </div>
          </div>

          {/* Technical Capability Matrices Grid - Enhanced */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-3">
                <Sparkles size={10} className="text-blue-600" />
                <span className="text-[9px] font-mono font-bold text-blue-700 uppercase tracking-wider">Core Modules</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">System Capacity Modules</h2>
              <p className="text-sm text-slate-500 font-medium">Calibrated algorithmic tracking rules addressing environmental and supply factors</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feat, idx) => (
                <div key={idx} className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className={`w-10 h-10 rounded-xl ${feat.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                    {feat.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Integration Framework - Enhanced */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 border border-cyan-100 rounded-full mb-3">
                <Server size={10} className="text-cyan-600" />
                <span className="text-[9px] font-mono font-bold text-cyan-700 uppercase tracking-wider">Tech Stack</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Infrastructure Component Layer</h2>
              <p className="text-sm text-slate-500 font-medium">Standard verified core technologies supporting system calculations</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {techStack.map((tech, idx) => (
                <span key={idx} className={`inline-flex items-center gap-2 px-3 py-1.5 ${tech.color} border rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105`}>
                  {tech.icon}
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Engineering Team Registry - Enhanced Developer Cards */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full mb-3">
                <Users size={10} className="text-purple-600" />
                <span className="text-[9px] font-mono font-bold text-purple-700 uppercase tracking-wider">Engineering Division</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Development Registry</h2>
              <p className="text-sm text-slate-500 font-medium">IST 3201 — Systems Architecture and Core Asset Protection Modality</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {developers.map((dev) => (
                <div
                  key={dev.id}
                  onClick={() => openModal(dev)}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
                >
                  {/* Header with gradient */}
                  <div className="relative h-20 bg-gradient-to-r from-blue-600 to-cyan-600">
                    <div className="absolute -bottom-8 left-4">
                      <img
                        src={dev.avatar}
                        alt={dev.name}
                        className="w-16 h-16 rounded-xl border-4 border-white shadow-lg bg-white object-cover"
                      />
                    </div>
                    <div className="absolute bottom-2 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <span className="text-[9px] font-mono font-bold text-white">{dev.id === 1 ? "Lead" : `Team #${dev.id}`}</span>
                    </div>
                  </div>
                  
                  <div className="pt-10 p-4">
                    <h3 className="text-sm font-bold text-slate-900">{dev.name}</h3>
                    <p className="text-[10px] font-mono text-blue-600 font-semibold uppercase tracking-wider mt-0.5">{dev.role}</p>
                    
                    {/* Stats row */}
                    <div className="flex items-center gap-3 mt-3 py-2 border-y border-slate-100">
                      <div className="flex items-center gap-1">
                        <GitBranch size={10} className="text-slate-400" />
                        <span className="text-[9px] font-mono text-slate-600">{dev.commits} commits</span>
                      </div>
                      <div className="w-px h-3 bg-slate-200"></div>
                      <div className="flex items-center gap-1">
                        <Briefcase size={10} className="text-slate-400" />
                        <span className="text-[9px] font-mono text-slate-600">{dev.experience}</span>
                      </div>
                    </div>
                    
                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {dev.skills.slice(0, 4).map((skill, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[8px] font-mono font-medium">{skill}</span>
                      ))}
                      {dev.skills.length > 4 && (
                        <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-400 rounded text-[8px] font-mono">+{dev.skills.length - 4}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-slate-500 group-hover:text-blue-600 transition">
                    <span>View Full Profile</span>
                    <ExternalLink size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acknowledgments Context Block - Enhanced */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center">
                    <Heart size={13} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Institutional Attributions</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  We acknowledge the logistical data feedback provided by participating regional cleaning agencies, the structural coordination framework under Dr. Florence N. Kivunike, and the ongoing oversight resources sustained by the Department of Information Systems within Makerere University.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wide">
                  <GraduationCap size={14} className="text-slate-400" />
                  <span>College of Computing and Information Sciences, Makerere University</span>
                </div>
              </div>
              
              <div className="flex gap-2 flex-shrink-0">
                <a href="mailto:info@cleanmatch.ug" className="p-2.5 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all">
                  <Mail size={16} />
                </a>
                <a href="#" className="p-2.5 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  <Github size={16} />
                </a>
                <a href="#" className="p-2.5 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Enhanced Detail Inspector Modal Window */}
      {selectedDev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header with Gradient */}
            <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-5 text-white">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16"></div>
              
              <div className="flex justify-between items-start gap-4 relative z-10">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedDev.avatar} 
                    alt={selectedDev.name} 
                    className="w-14 h-14 rounded-xl border-2 border-white/30 shadow-lg bg-white object-cover"
                  />
                  <div>
                    <h3 className="text-base font-bold">{selectedDev.name}</h3>
                    <p className="text-cyan-100 text-xs font-medium mt-0.5">{selectedDev.role}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-1.5 hover:bg-white/20 rounded-lg transition-all">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body - Detailed Developer Info */}
            <div className="p-5 space-y-4">
              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <Mail size={14} className="text-blue-500" />
                  <a href={`mailto:${selectedDev.email}`} className="text-xs text-slate-700 hover:text-blue-600 truncate font-mono">{selectedDev.email.split('@')[0]}</a>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <Phone size={14} className="text-emerald-500" />
                  <span className="text-xs text-slate-700 font-mono">{selectedDev.phone}</span>
                </div>
              </div>
              
              {/* Location & Experience */}
              <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-blue-500" />
                  <span className="text-[11px] text-slate-700 font-medium">{selectedDev.location}</span>
                </div>
                <div className="w-px h-4 bg-blue-200"></div>
                <div className="flex items-center gap-1.5">
                  <Briefcase size={12} className="text-cyan-500" />
                  <span className="text-[11px] text-slate-700 font-medium">{selectedDev.experience} experience</span>
                </div>
                <div className="w-px h-4 bg-blue-200"></div>
                <div className="flex items-center gap-1.5">
                  <GitBranch size={12} className="text-purple-500" />
                  <span className="text-[11px] text-slate-700 font-medium">{selectedDev.commits}+ commits</span>
                </div>
              </div>

              {/* Bio */}
              <div className="pt-2">
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedDev.bio}</p>
              </div>

              {/* Contributions */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Star size={12} className="text-amber-500" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Key Contributions</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDev.contributions.map((cont, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 text-blue-700 text-[10px] rounded-lg font-semibold">{cont}</span>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Terminal size={12} className="text-slate-500" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Technical Stack</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDev.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] rounded-lg font-mono font-medium">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Activity Metrics */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Activity size={10} />
                    <span>Last active: December 2025</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>Response rate: 98%</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <a href={selectedDev.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 hover:bg-blue-100 rounded-lg text-slate-600 hover:text-blue-600 transition-all">
                  <Linkedin size={14} />
                </a>
                <a href={selectedDev.social.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-all">
                  <Github size={14} />
                </a>
                <a href={selectedDev.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 hover:bg-sky-100 rounded-lg text-slate-600 hover:text-sky-600 transition-all">
                  <Twitter size={14} />
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="text-[9px] text-slate-500 font-mono">Verified Team Member</span>
              </div>
              <button 
                onClick={closeModal}
                className="px-5 py-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Structural bottom alignment */}
      <div className="w-full h-0 p-0 m-0 border-0" />
    </div>
  );
}
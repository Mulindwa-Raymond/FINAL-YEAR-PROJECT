/**
 * Training.jsx
 * Professional learning and compliance resource portal for operator training.
 * Features:
 * - High-contrast hero panel focused on commercial equipment competency
 * - Responsive split architecture dividing module selection from the workspace
 * - Localized contextual training guides tailored to Ugandan site operators
 * - Zero bottom margins ensuring seamless alignment with the application footer
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Download,
  ChevronRight,
  AlertTriangle,
  BookOpen,
  Video,
  FileText,
  Clock,
  ExternalLink,
  GraduationCap,
  Award,
  CheckCircle,
  FileCheck2,
  ShieldAlert,
  Sparkles,
  Gauge,
  Layers,
  Zap
} from 'lucide-react';
import { getActiveTrainings } from '../services/trainingService';

export default function Training() {
  const [trainings, setTrainings] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await getActiveTrainings();
        const data = res.data.data?.trainings || [];
        setTrainings(data);
        if (data.length > 0) setActiveModule(data[0]);
      } catch (err) {
        console.error('Failed to load trainings:', err);
        setError('Unable to load training materials. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  useEffect(() => {
    if (activeModule && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeModule]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'article': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'video': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'pdf': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'article': return 'bg-blue-50 border-blue-200 text-blue-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[75vh]">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <GraduationCap className="absolute inset-0 m-auto w-5 h-5 text-blue-600" />
          </div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Accessing Skills Registry...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[65vh] px-6">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg max-w-md text-center">
            <ShieldAlert className="w-10 h-10 text-rose-600 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-900 mb-2">System Error</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-xs font-semibold hover:from-blue-700 hover:to-cyan-700 transition shadow-md"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (trainings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[65vh] px-6">
          <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-lg max-w-md text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Training Modules Found</h3>
            <p className="text-slate-500 text-xs">There are currently no training materials indexed for this workspace.</p>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Hero Area - Clean, Professional, No Extra Badges */}
        <div className="relative pt-12 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            {/* Hero Content - Centered, Clean, Professional */}
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4">
                Standardized{' '}
                <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Equipment Training</span>
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
                Access structured technical documentation, maintenance guides, and operational guidelines verified 
                for commercial cleaning crews in Uganda. Enhance machinery lifecycle metrics and ensure workplace compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Workspace Layout */}
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-0">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Module Catalog - ENHANCED DESIGN */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-blue-50 rounded-md">
                  <Layers size={12} className="text-blue-600" />
                  <h2 className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">Available Modules</h2>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-sm">
                  {trainings.length} {trainings.length === 1 ? 'Unit' : 'Units'}
                </span>
              </div>
              
              <div className="space-y-3">
                {trainings.map((module) => {
                  const isActive = activeModule?.id === module.id;
                  const typeStyles = getTypeColor(module.type);
                  
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module)}
                      className={`
                        w-full text-left bg-white rounded-xl border transition-all duration-200
                        hover:shadow-md hover:border-blue-200
                        ${isActive 
                          ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                          : 'border-slate-200 shadow-sm'}
                      `}
                    >
                      <div className="p-4">
                        <div className="flex gap-4">
                          {/* Categorized Icon Tag */}
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all
                            ${isActive 
                              ? 'bg-gradient-to-br from-blue-600 to-cyan-600 border-blue-600 text-white shadow-md' 
                              : 'bg-slate-50 border-slate-200 text-slate-500 group-hover:bg-blue-50'}
                          `}>
                            {getTypeIcon(module.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className={`font-bold text-sm line-clamp-2 leading-snug transition-colors ${isActive ? 'text-blue-700' : 'text-slate-900'}`}>
                                {module.title}
                              </h3>
                            </div>

                            <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium">
                              {module.description}
                            </p>

                            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                <span className="text-[10px] font-medium">Core Reference</span>
                              </div>
                              <div className={`flex items-center gap-1 font-semibold transition-colors uppercase text-[9px] tracking-wider
                                ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                                {isActive ? (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    Select
                                    <ChevronRight className="w-3 h-3" />
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Verified Performance Accountability Banner - MATCHES HOME PAGE STYLE */}
              <div className="mt-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-5 border border-blue-500/20 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">Compliance Auditing</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-normal font-medium">
                      Review all technical items to verify facility readiness and meet local workforce guidelines.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[9px] text-slate-500">
                      <Gauge size={10} className="text-cyan-400" />
                      <span>Standards: ISO & Local Compliance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document / Media Viewport Workspace - ENHANCED */}
            {activeModule && (
              <div ref={contentRef} className="lg:col-span-7 xl:col-span-8 mb-0">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                  
                  {/* Workspace Meta Header - ENHANCED */}
                  <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-5 border-b border-slate-200">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 shadow-md ${getTypeColor(activeModule.type)}`}>
                        {getTypeIcon(activeModule.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                            Resource Type: {activeModule.type}
                          </span>
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                            Verified Content
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mt-2 tracking-tight">
                          {activeModule.title}
                        </h2>
                        <p className="text-slate-600 text-xs mt-1.5 font-medium leading-relaxed">
                          {activeModule.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Resource Frame Renderers */}
                  <div className="p-6">
                    {activeModule.type === 'video' && activeModule.youtubeUrl && (
                      <div className="space-y-3">
                        <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                          <iframe
                            src={getYouTubeEmbedUrl(activeModule.youtubeUrl)}
                            title={activeModule.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="flex justify-end">
                          <a
                            href={activeModule.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition font-bold uppercase tracking-wider"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open Streaming Mirror
                          </a>
                        </div>
                      </div>
                    )}

                    {activeModule.type === 'pdf' && activeModule.url && (
                      <div className="text-center py-12 border-2 border-dashed border-blue-200 rounded-xl bg-gradient-to-br from-blue-50/30 to-cyan-50/30">
                        <div className="w-20 h-20 bg-white border-2 border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                          <FileText className="w-10 h-10 text-amber-600" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">Technical Manual Available</h3>
                        <p className="text-slate-500 text-xs mb-6 max-w-xs mx-auto">
                          Download this structured specifications sheet for offline field storage and supervisor distribution.
                        </p>
                        <a
                          href={activeModule.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl text-xs font-semibold shadow-md transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Manual
                        </a>
                      </div>
                    )}

                    {activeModule.type === 'article' && activeModule.url && (
                      <div className="text-center py-12 border-2 border-dashed border-blue-200 rounded-xl bg-gradient-to-br from-blue-50/30 to-cyan-50/30">
                        <div className="w-20 h-20 bg-white border-2 border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                          <BookOpen className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">Standard Operating Procedure</h3>
                        <p className="text-slate-500 text-xs mb-6 max-w-xs mx-auto">
                          Review documentation regarding chemical safety limits and dilution metrics directly via the corporate portal.
                        </p>
                        <a
                          href={activeModule.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-3 rounded-xl text-xs font-semibold shadow-md transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Launch Reference Text
                        </a>
                      </div>
                    )}

                    {/* Core Competencies Section - ENHANCED */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Core Competencies Covered</h4>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          'Preventative machinery care routines',
                          'Laterite dust mitigation and filtering',
                          'Chemical dilution ratios and safety handling',
                          'Power load configuration frameworks',
                          'Equipment storage & maintenance schedules',
                          'Operator safety & PPE requirements'
                        ].map((text, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium p-2 rounded-lg hover:bg-slate-50 transition">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Controls - ENHANCED */}
                  <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200 flex justify-between items-center">
                    <button
                      onClick={() => {
                        const currentIndex = trainings.findIndex(t => t.id === activeModule.id);
                        if (currentIndex > 0) {
                          setActiveModule(trainings[currentIndex - 1]);
                        }
                      }}
                      disabled={trainings.findIndex(t => t.id === activeModule.id) === 0}
                      className="text-xs font-semibold text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white"
                    >
                      <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                      Previous Unit
                    </button>
                    <div className="flex items-center gap-2">
                      <Zap size={10} className="text-amber-500" />
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm">
                        {trainings.findIndex(t => t.id === activeModule.id) + 1} / {trainings.length}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const currentIndex = trainings.findIndex(t => t.id === activeModule.id);
                        if (currentIndex < trainings.length - 1) {
                          setActiveModule(trainings[currentIndex + 1]);
                        }
                      }}
                      disabled={trainings.findIndex(t => t.id === activeModule.id) === trainings.length - 1}
                      className="text-xs font-semibold text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white"
                    >
                      Next Unit
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Zero structural element margin */}
      <div className="w-full h-0 p-0 m-0 border-0" />
    </div>
  );
}
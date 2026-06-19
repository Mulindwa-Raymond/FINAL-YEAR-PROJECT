/**
 * Training.jsx
 * Professional learning and compliance resource portal for operator training.
 * Features:
 * - High-contrast hero panel focused on commercial equipment competency
 * - Responsive split architecture dividing module selection from the workspace
 * - Localized contextual training guides tailored to Ugandan site operators
 * - Zero bottom margins ensuring seamless alignment with the application footer
 * - YouTube/Streaming-style dynamic thumbnail grids and real-time database queries.
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
  Zap,
  Search,
  SlidersHorizontal,
  RefreshCw,
  X,
  Share2,
  Eye,
  Bookmark
} from 'lucide-react';
import { getActiveTrainings } from '../services/trainingService';

export default function Training() {
  const [trainings, setTrainings] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'video', 'pdf', 'article'

  const contentRef = useRef(null);

  // Fetch training materials from backend database with optional filters
  const fetchTrainings = async (searchVal = '', typeVal = 'all') => {
    try {
      setSearching(true);
      const params = {};
      if (searchVal.trim()) params.search = searchVal.trim();
      if (typeVal !== 'all') params.type = typeVal;

      const res = await getActiveTrainings(params);
      const data = res.data.data?.trainings || [];
      setTrainings(data);

      // Keep active module selection persistent if it still exists in query results, or select the first matching module
      if (data.length > 0) {
        const stillExists = data.find(t => t.id === activeModule?.id);
        if (!stillExists) {
          setActiveModule(data[0]);
        }
      } else {
        setActiveModule(null);
      }
    } catch (err) {
      console.error('Failed to load trainings:', err);
      setError('Unable to load training materials. Please check your network connection.');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  // Run initial load
  useEffect(() => {
    fetchTrainings();
  }, []);

  // Run search query or filter updates
  const handleSearchAndFilter = (e) => {
    if (e) e.preventDefault();
    fetchTrainings(searchQuery, selectedType);
  };

  // Quick category chip filter click
  const handleTypeChange = (type) => {
    setSelectedType(type);
    fetchTrainings(searchQuery, type);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    fetchTrainings('', 'all');
  };

  useEffect(() => {
    if (activeModule && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeModule]);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : null;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'article': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'pdf': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'article': return 'bg-sky-50 border-sky-200 text-sky-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  if (loading && !searching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[75vh]">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <GraduationCap className="absolute inset-0 m-auto w-5 h-5 text-blue-600" />
          </div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider animate-pulse">Accessing Skills Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 text-slate-900 font-sans antialiased selection:bg-blue-100 overflow-x-hidden">

      {/* Background Elements - Brand Aesthetic */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.015)_0px,_rgba(59,130,246,0.015)_2px,_transparent_2px,_transparent_20px)]"></div>
      </div>

      <main className="relative z-10">
        {/* Modern Header Section */}
        <div className="relative pt-10 pb-6 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              {/* Brand Header */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 mb-2.5">
                  <GraduationCap size={13} className="animate-bounce" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Clean Match Knowledge Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Technical Standard <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Training Hub</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-medium">
                  Official operational manuals, preventative maintenance tutorials, and Ugandan site-specific compliance modules for professional cleaning teams.
                </p>
              </div>

              {/* Stats Overview */}
              <div className="flex items-center gap-4 bg-slate-100/80 p-3 rounded-2xl border border-slate-200/80">
                <div className="text-center px-4 border-r border-slate-200">
                  <span className="block text-xl font-bold text-blue-700">{trainings.length}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Units</span>
                </div>
                <div className="flex flex-col text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle size={12} />
                    Verified Content
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">Standards: ISO & Local</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Database Search & Filter Panel */}
        <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <form onSubmit={handleSearchAndFilter} className="flex flex-col lg:flex-row gap-4 items-center justify-between">

              {/* Search Bar */}
              <div className="relative w-full lg:max-w-lg">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search technical topics, machinery manuals, SOPs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      fetchTrainings('', selectedType);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Dynamic Categories Selector */}
              <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto overflow-x-auto scrollbar-none">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2 flex items-center gap-1">
                  <SlidersHorizontal size={12} /> Filter:
                </span>
                {[
                  { key: 'all', label: 'All Resources', icon: <Layers size={11} /> },
                  { key: 'video', label: 'Video Guides', icon: <Video size={11} /> },
                  { key: 'pdf', label: 'PDF Manuals', icon: <FileText size={11} /> },
                  { key: 'article', label: 'SOP Articles', icon: <BookOpen size={11} /> }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTypeChange(tab.key)}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 whitespace-nowrap
                      ${selectedType === tab.key
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-transparent'}
                    `}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}

                {(searchQuery || selectedType !== 'all') && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="ml-auto lg:ml-2 inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    Reset
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

          {/* Active Player / Cinema Workspace Viewport */}
          {activeModule ? (
            <div ref={contentRef} className="grid lg:grid-cols-12 gap-6 items-start mb-10">

              {/* LEFT COLUMN: Cinema Screen Viewer */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">

                {/* Visual Viewport */}
                <div className="bg-slate-950 aspect-video relative flex items-center justify-center text-white overflow-hidden shadow-inner group">
                  {activeModule.type === 'video' && activeModule.youtubeUrl ? (
                    <iframe
                      src={getYouTubeEmbedUrl(activeModule.youtubeUrl)}
                      title={activeModule.title}
                      className="w-full h-full absolute inset-0 border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : activeModule.type === 'pdf' ? (
                    // Elegant Premium PDF placeholder cover
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-900 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 transform group-hover:scale-110 transition duration-300">
                        <FileText className="w-8 h-8 text-amber-400" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-1 rounded border border-amber-500/20 mb-3">
                        PDF Technical Manual
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white max-w-md line-clamp-2">
                        {activeModule.title}
                      </h3>
                      <p className="text-slate-350 text-xs mt-2 max-w-sm font-medium">
                        Contains complete equipment breakdowns, certified parts references, and Ugandan grid compatibility.
                      </p>

                      {activeModule.url && (
                        <a
                          href={activeModule.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Download Standard Document
                        </a>
                      )}
                    </div>
                  ) : (
                    // SOP Article Cover style
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 transform group-hover:scale-110 transition duration-300">
                        <BookOpen className="w-8 h-8 text-blue-400" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase bg-blue-400/10 px-2.5 py-1 rounded border border-blue-500/20 mb-3">
                        Standard Operating Procedure (SOP)
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white max-w-md line-clamp-2">
                        {activeModule.title}
                      </h3>
                      <p className="text-slate-350 text-xs mt-2 max-w-sm font-medium">
                        Step-by-step guidance on workplace safety, chemical mixing, and machinery lifecycle practices.
                      </p>

                      {activeModule.url && (
                        <a
                          href={activeModule.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                          Launch Full Reference Text
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Workspace Content Meta Info */}
                <div className="p-6">

                  {/* Category badges */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${getTypeColor(activeModule.type)}`}>
                      {getTypeIcon(activeModule.type)}
                      Resource: {activeModule.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 border border-emerald-150 text-emerald-700 px-2.5 py-1 rounded-md">
                      <CheckCircle size={11} /> Active Certification
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md font-mono">
                      ID: #{activeModule.id?.substring(0, 6) || 'N/A'}
                    </span>
                  </div>

                  {/* Title & Detailed Description */}
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                    {activeModule.title}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed font-medium">
                    {activeModule.description}
                  </p>

                  {/* Operational checklists tailored for Uganda */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                          <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Facility Readiness & SOPs</h4>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">Uganda HSE Directives</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        'Dust protection and filter mitigation (laterite soil protocol)',
                        'Chemical dilution ratio precision (prevent acid damage)',
                        'Safe voltage ranges matching Uganda power grids',
                        'Daily machine sanitation and battery storage checklists',
                        'Appropriate PPE use and active warning decals',
                        'Emergency safety shutdown & local reporting steps'
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50/50 hover:bg-slate-50 border border-slate-100/60 transition duration-150 text-xs text-slate-600 font-medium">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Workspace External Actions and Support Controls */}
                  <div className="mt-6 pt-5 border-t border-slate-150 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-blue-500" />
                        Updated: Standard SOP
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeModule.youtubeUrl && (
                        <a
                          href={activeModule.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition"
                        >
                          <Share2 size={12} />
                          Share Source
                        </a>
                      )}

                      {activeModule.url && (
                        <a
                          href={activeModule.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition shadow-sm"
                        >
                          <ExternalLink size={12} />
                          Open Reference
                        </a>
                      )}
                    </div>
                  </div>

                </div>

                {/* Theater Navigation Bar */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                  <button
                    onClick={() => {
                      const currentIndex = trainings.findIndex(t => t.id === activeModule.id);
                      if (currentIndex > 0) {
                        setActiveModule(trainings[currentIndex - 1]);
                      }
                    }}
                    disabled={trainings.findIndex(t => t.id === activeModule.id) === 0}
                    className="text-xs font-bold text-slate-600 hover:text-blue-600 disabled:opacity-35 disabled:cursor-not-allowed transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Previous Module
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm">
                      {trainings.findIndex(t => t.id === activeModule.id) + 1} of {trainings.length} modules
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
                    className="text-xs font-bold text-slate-600 hover:text-blue-600 disabled:opacity-35 disabled:cursor-not-allowed transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200"
                  >
                    Next Module
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN: Up Next / Continuous Stream Sidebar */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm h-full">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <div className="inline-flex items-center gap-1.5">
                    <Layers size={13} className="text-blue-600 animate-pulse" />
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700">Course Index</h2>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                    Next Queue
                  </span>
                </div>

                <div className="space-y-3 max-h-[490px] overflow-y-auto pr-1">
                  {trainings.map((module, i) => {
                    const isActive = activeModule.id === module.id;
                    const isVideo = module.type === 'video';
                    const ytThumb = isVideo ? getYouTubeThumbnail(module.youtubeUrl) : null;

                    return (
                      <button
                        key={module.id || i}
                        onClick={() => setActiveModule(module)}
                        className={`w-full flex gap-3 p-2 rounded-xl border text-left transition-all ${isActive
                            ? 'bg-blue-50/70 border-blue-250 shadow-sm ring-1 ring-blue-500/10'
                            : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                      >
                        {/* Mini Thumbnail */}
                        <div className="w-20 h-14 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-200">
                          {isVideo && ytThumb ? (
                            <img
                              src={ytThumb}
                              alt={module.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${module.type === 'pdf' ? 'bg-amber-500/10' : 'bg-sky-500/10'
                              }`}>
                              {getTypeIcon(module.type)}
                            </div>
                          )}
                          <div className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 text-[8px] text-white rounded font-mono font-bold">
                            {module.type.toUpperCase()}
                          </div>
                        </div>

                        {/* Text Metadata */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-xs font-bold line-clamp-1 leading-snug ${isActive ? 'text-blue-700' : 'text-slate-900'
                            }`}>
                            {module.title}
                          </h3>
                          <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-normal">
                            {module.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-semibold text-slate-400 capitalize flex items-center gap-0.5">
                              {getTypeIcon(module.type)}
                              {module.type}
                            </span>
                            {isActive && (
                              <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 ml-auto">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                Playing
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Side Informative Compliance Banner */}
                <div className="mt-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-4 text-white border border-slate-700 shadow">
                  <div className="flex gap-2.5 items-start">
                    <Award size={16} className="text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Technical Readiness Audit</h4>
                      <p className="text-[10px] text-slate-350 mt-1 leading-relaxed">
                        Complete all materials to meet compliance guidelines before machinery operation.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            // Empty view when nothing matches the active criteria
            !searching && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto mb-10 shadow-sm">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No Active Topic Selection</h3>
                <p className="text-xs text-slate-500">
                  Select an operational module from the standard catalog or reset filters to begin.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
                >
                  Reset Active Filters
                </button>
              </div>
            )
          )}

          {/* Database Search Results Grid Heading */}
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 rounded bg-blue-600"></span>
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
                {searchQuery || selectedType !== 'all' ? 'Filtered Search Results' : 'Comprehensive Course Grid'}
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Showing {trainings.length} standard reference units
            </span>
          </div>

          {/* Live searching loader */}
          {searching ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Querying Clean Match Database...</p>
            </div>
          ) : trainings.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No matching modules found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                No items match "{searchQuery}" or selected category. Check your keyword spelling or change your category filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-4 px-3.5 py-1.5 bg-slate-150 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (

            /* High Fidelity Video-Platform Inspired Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trainings.map((module) => {
                const isSelected = activeModule?.id === module.id;
                const isVideo = module.type === 'video';
                const ytThumb = isVideo ? getYouTubeThumbnail(module.youtubeUrl) : null;
                const specColor = getTypeColor(module.type);

                return (
                  <div
                    key={module.id}
                    onClick={() => {
                      setActiveModule(module);
                      // Scroll to player smoothly
                      if (contentRef.current) {
                        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`
                      group cursor-pointer bg-white rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1.5
                      ${isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/15 shadow-md shadow-blue-500/5'
                        : 'border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300/90'}
                    `}
                  >
                    {/* Aspect-Ratio Video Card Cover */}
                    <div className="aspect-video w-full bg-slate-950 relative overflow-hidden border-b border-slate-100">

                      {/* Image Thumbnail Container */}
                      {isVideo && ytThumb ? (
                        <>
                          <img
                            src={ytThumb}
                            alt={module.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          {/* Centered Hover Play Icon overlay */}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                            <div className="w-11 h-11 rounded-full bg-white/90 shadow-md flex items-center justify-center text-rose-600 scale-90 group-hover:scale-100 transition duration-200">
                              <Play className="w-5 h-5 fill-rose-600 ml-0.5" />
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Premium visual gradients for article / pdf guides */
                        <div className={`
                          w-full h-full flex flex-col items-center justify-center p-4 text-center transition-all duration-300 group-hover:scale-105
                          ${module.type === 'pdf'
                            ? 'bg-gradient-to-br from-indigo-900 to-amber-900/40'
                            : 'bg-gradient-to-br from-slate-900 to-blue-900/40'}
                        `}>
                          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white mb-2 shadow-inner">
                            {getTypeIcon(module.type)}
                          </div>
                          <span className="text-[8px] font-bold uppercase tracking-widest text-white/70">
                            {module.type === 'pdf' ? 'Technical Spec' : 'SOP Standard'}
                          </span>
                        </div>
                      )}

                      {/* Floating Type Pill & Micro Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest text-slate-800 bg-white border border-slate-200 shadow-sm flex items-center gap-1`}>
                          {getTypeIcon(module.type)}
                          {module.type}
                        </span>
                      </div>

                      {/* Fake Duration Indicator to match YouTube aesthetic */}
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-slate-900/80 text-[9px] text-white rounded font-bold font-mono">
                        {isVideo ? '08:15' : module.type === 'pdf' ? '12 Pages' : '5 Min Read'}
                      </div>
                    </div>

                    {/* Metadata details */}
                    <div className="p-4">

                      {/* Author / Corporate Line */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                          <GraduationCap size={10} />
                        </div>
                        <span className="text-[9px] font-semibold text-slate-500 tracking-wider">Clean Match Official</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 ml-auto"></span>
                        <span className="text-[9px] font-bold text-slate-400">V2.4</span>
                      </div>

                      {/* Main Title */}
                      <h3 className={`text-xs font-bold leading-snug line-clamp-2 transition-colors duration-250 ${isSelected ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-600'
                        }`}>
                        {module.title}
                      </h3>

                      {/* Mini Description */}
                      <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {module.description}
                      </p>

                      {/* Status / Compliance Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Clock size={10} className="text-slate-300" />
                          Certified Unit
                        </span>

                        <div className="text-[10px] font-bold text-blue-600 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-0.5 uppercase tracking-widest">
                          {isSelected ? 'ACTIVE' : 'START'}
                          <ChevronRight size={12} />
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      {/* Strict zero structural bottom margin alignment element */}
      <div className="w-full h-0 p-0 m-0 border-0" />
    </div>
  );
}
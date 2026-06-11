/**
 * MachineTypeSelection.jsx
 * 
 * Step 1 – Complete machine category selection with all 8 categories and their subtypes.
 * Fetches categories from backend, displays beautiful cards, and allows subtype selection.
 * Fully integrated with SiteTaskProfile and RecommendationResults.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChevronRight, Loader2, AlertCircle, Sparkles, X,
  Brush, Wind, Droplets, SprayCan, Zap, Fan, Package, Wrench,
  CheckCircle, Star, ChevronLeft, Gauge, HardDrive, 
  Bot, Battery, Flame, Thermometer, Building2, User,
  LayoutGrid, ArrowRight, Shield, Clock, Award,
  Circle, Compass, HelpCircle, Activity, TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { getMachineCategories } from '../services/equipmentService';

// Professional icon mapping for subtypes
const subtypeIcons = {
  walk_behind: <User size={18} />,
  rider: <LayoutGrid size={18} />,
  robotic: <Bot size={18} />,
  micro: <Gauge size={18} />,
  wet_dry: <Droplets size={18} />,
  industrial: <Building2 size={18} />,
  backpack: <HardDrive size={18} />,
  electric: <Zap size={18} />,
  hot_water: <Flame size={18} />,
  petrol: <Battery size={18} />,
  portable: <Package size={18} />,
  continuous_fill: <Droplets size={18} />,
  portable_spot: <Package size={18} />,
  walk_behind_extractor: <User size={18} />,
  compact_sweeper: <Gauge size={18} />,
  compact_scrubber: <Gauge size={18} />,
  water_fed_pole: <Droplets size={18} />,
  robotic_window: <Bot size={18} />,
};

// Subtype definitions for each category
const categorySubtypes = {
  floor_scrubber: [
    { id: 'walk_behind', name: 'Walk-Behind Scrubber', description: 'Operator-guided unit ideal for small to medium facilities. Provides precise control and maneuverability.', icon: <User size={18} />, functionality: 'Perfect for retail stores, offices, and hospitals' },
    { id: 'rider', name: 'Ride-On Scrubber', description: 'High-productivity machine for large warehouses and industrial spaces. Operator sits for extended use.', icon: <LayoutGrid size={18} />, functionality: 'Ideal for distribution centers and factories' },
    { id: 'robotic', name: 'Robotic Scrubber', description: 'Autonomous navigation for hands-free operation. Perfect for overnight cleaning schedules.', icon: <Bot size={18} />, functionality: 'Set and forget — ideal for airports and supermarkets' },
    { id: 'micro', name: 'Micro Scrubber', description: 'Ultra-compact design for tight spaces, restrooms, and small retail areas.', icon: <Gauge size={18} />, functionality: 'Navigate narrow aisles and small rooms' },
  ],
  vacuum_cleaner: [
    { id: 'wet_dry', name: 'Wet & Dry Vacuum', description: 'Dual-purpose unit for liquid spills and dry debris. Essential for workshops and kitchens.', icon: <Droplets size={18} />, functionality: 'Commercial kitchens and workshop areas' },
    { id: 'industrial', name: 'Industrial Vacuum', description: 'Heavy-duty continuous operation for factories and construction sites.', icon: <Building2 size={18} />, functionality: 'Construction sites and manufacturing plants' },
    { id: 'backpack', name: 'Backpack Vacuum', description: 'Wearable design for maximum mobility in theatres, hotels, and offices.', icon: <HardDrive size={18} />, functionality: 'Hotels, theatres, and multi-level offices' },
  ],
  pressure_washer: [
    { id: 'electric', name: 'Electric Pressure Washer', description: 'Plug-and-clean solution for light to medium duty indoor and outdoor tasks.', icon: <Zap size={18} />, functionality: 'Indoor facilities and light exterior cleaning' },
    { id: 'hot_water', name: 'Hot Water Pressure Washer', description: 'Integrated heating element for grease, oil, and heavy stain removal.', icon: <Flame size={18} />, functionality: 'Food processing and automotive workshops' },
    { id: 'petrol', name: 'Fuel Powered Pressure Washer(Petrol & diseal)', description: 'Gas-powered for remote locations and heavy-duty exterior cleaning.', icon: <Battery size={18} />, functionality: 'Construction sites and outdoor facilities' },
  ],
  steam_cleaner: [
    { id: 'portable', name: 'Portable Steam Cleaner', description: 'Lightweight chemical-free sanitisation for spot cleaning and detail work.', icon: <Package size={18} />, functionality: 'Spot cleaning and detail work' },
    { id: 'continuous_fill', name: 'Continuous Fill Steam Cleaner', description: 'Unlimited runtime with onboard refill tank. Ideal for large surface areas.', icon: <Droplets size={18} />, functionality: 'Hotels, hospitals, and schools' },
  ],
  carpet_cleaner: [
    { id: 'portable', name: 'Portable Spot Cleaner', description: 'Compact unit for upholstery stains and small carpet areas.', icon: <Package size={18} />, functionality: 'Upholstery and spot treatment' },
    { id: 'walk_behind', name: 'Walk-Behind Extractor', description: 'Full-size extraction for commercial carpet maintenance and deep cleaning.', icon: <User size={18} />, functionality: 'Offices, hotels, and event spaces' },
  ],
  sweeper: [
    { id: 'walk_behind', name: 'Walk-Behind Sweeper', description: 'Operator-guided for parking lots, sidewalks, and warehouse aisles.', icon: <User size={18} />, functionality: 'Parking lots, sidewalks, warehouses' },
    { id: 'rider', name: 'Rider Sweeper', description: 'Sit-on sweeper for large outdoor areas and industrial campuses.', icon: <LayoutGrid size={18} />, functionality: 'Industrial campuses and large parking lots' },
    { id: 'compact', name: 'Compact Sweeper', description: 'Narrow design for indoor spaces and crowded retail environments.', icon: <Gauge size={18} />, functionality: 'Retail stores and crowded environments' },
  ],
  scrubber_drier: [
    { id: 'walk_behind', name: 'Walk-Behind Scrubber Drier', description: 'Simultaneous scrubbing and drying in one pass. Ideal for retail and hospitality.', icon: <User size={18} />, functionality: 'Retail, hospitality, and offices' },
    { id: 'rider', name: 'Rider Scrubber Drier', description: 'High-speed productivity for distribution centers and airports.', icon: <LayoutGrid size={18} />, functionality: 'Distribution centers and airports' },
    { id: 'compact', name: 'Compact Scrubber Drier', description: 'Maneuverable solution for tight corners and small commercial spaces.', icon: <Gauge size={18} />, functionality: 'Boutique stores and small commercial spaces' },
  ],
  window_cleaner: [
    { id: 'water_fed_pole', name: 'Water-Fed Pole System', description: 'Pure water reach-and-clean system for high-rise windows and facades.', icon: <Droplets size={18} />, functionality: 'High-rise buildings and glass facades' },
    { id: 'robotic', name: 'Robotic Window Cleaner', description: 'Autonomous glass cleaning with magnetic or vacuum attachment.', icon: <Bot size={18} />, functionality: 'Skyscrapers and commercial buildings' },
  ],
};

// Category metadata
const categoryMetadata = {
  floor_scrubber: {
    name: 'Floor Scrubbers',
    description: 'Hard floor cleaning and scrubbing for tile, concrete, and vinyl surfaces.',
    longDescription: 'Professional floor scrubbing machines that clean, scrub, and dry hard surfaces in one pass.',
    icon: Brush,
    gradient: 'from-cyan-500 to-blue-600',
    bgGradient: 'from-cyan-50 to-blue-50',
    usageIcon: <Building2 size={14} />,
    usage: 'Commercial & Industrial',
    stats: 'Up to 5,500 m²/hour',
  },
  vacuum_cleaner: {
    name: 'Vacuum Cleaners',
    description: 'Dust and debris removal for carpets and hard floors. Wet/dry variants available.',
    longDescription: 'High-performance vacuum systems for carpets and hard floors.',
    icon: Wind,
    gradient: 'from-indigo-500 to-purple-600',
    bgGradient: 'from-indigo-50 to-purple-50',
    usageIcon: <Building2 size={14} />,
    usage: 'Commercial & Hospitality',
    stats: 'HEPA filtration available',
  },
  window_cleaner: {
    name: 'Window Cleaners',
    description: 'Glass surface cleaning solutions for high-rise applications.',
    longDescription: 'Professional window cleaning solutions including water-fed pole systems.',
    icon: Droplets,
    gradient: 'from-sky-500 to-teal-600',
    bgGradient: 'from-sky-50 to-teal-50',
    usageIcon: <Building2 size={14} />,
    usage: 'High-rise & Commercial',
    stats: 'Up to 8m reach',
  },
  pressure_washer: {
    name: 'Pressure Washers',
    description: 'High-pressure water cleaning for exterior surfaces and heavy-duty tasks.',
    longDescription: 'Powerful pressure washers for removing grime and stains.',
    icon: SprayCan,
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    usageIcon: <Building2 size={14} />,
    usage: 'Exterior & Industrial',
    stats: 'Up to 200 bar pressure',
  },
  steam_cleaner: {
    name: 'Steam Cleaners',
    description: 'Chemical-free sanitisation using high-temperature steam.',
    longDescription: 'Eco-friendly steam cleaning that kills bacteria without chemicals.',
    icon: Flame,
    gradient: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-50 to-red-50',
    usageIcon: <Building2 size={14} />,
    usage: 'Healthcare & Food',
    stats: 'Up to 150°C steam',
  },
  carpet_cleaner: {
    name: 'Carpet Cleaners',
    description: 'Deep extraction machines for stain removal and embedded dirt.',
    longDescription: 'Professional carpet extraction machines that restore carpet appearance.',
    icon: Package,
    gradient: 'from-emerald-500 to-green-600',
    bgGradient: 'from-emerald-50 to-green-50',
    usageIcon: <Building2 size={14} />,
    usage: 'Hospitality & Office',
    stats: '40L tank capacity',
  },
  sweeper: {
    name: 'Sweepers',
    description: 'Large area debris collection for warehouses and industrial spaces.',
    longDescription: 'Heavy-duty sweepers for collecting dust and debris from large areas.',
    icon: Fan,
    gradient: 'from-rose-500 to-pink-600',
    bgGradient: 'from-rose-50 to-pink-50',
    usageIcon: <Building2 size={14} />,
    usage: 'Industrial & Outdoor',
    stats: 'Up to 8,000 m²/hour',
  },
  scrubber_drier: {
    name: 'Scrubber Driers',
    description: 'Combined scrubbing and drying in one efficient pass.',
    longDescription: 'All-in-one machines that scrub and dry in a single pass.',
    icon: Award,
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-50 to-purple-50',
    usageIcon: <Building2 size={14} />,
    usage: 'Commercial & Industrial',
    stats: 'Walk-behind & Ride-on',
  },
};

const FallbackIcon = Wrench;

// Simple Step Progress Bar - Compact and Clean
const StepProgress = () => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-md">
          <CheckCircle2 size={14} className="text-white" />
        </div>
        <span className="ml-2 text-xs font-semibold text-blue-700">Machine Type</span>
      </div>
      <div className="w-12 h-0.5 bg-slate-200"></div>
      <div className="flex items-center opacity-40">
        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
          <span className="text-xs font-bold text-slate-500">2</span>
        </div>
        <span className="ml-2 text-xs text-slate-400">Site Profile</span>
      </div>
      <div className="w-12 h-0.5 bg-slate-200"></div>
      <div className="flex items-center opacity-40">
        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
          <span className="text-xs font-bold text-slate-500">3</span>
        </div>
        <span className="ml-2 text-xs text-slate-400">Results</span>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ category, onClick, isSelected }) => {
  const Icon = category.icon || FallbackIcon;
  const gradient = category.gradient || 'from-slate-500 to-slate-600';
  const bgGradient = category.bgGradient || 'from-slate-50 to-slate-100';
  const subtypeCount = category.subtypes?.length || 0;

  return (
    <button
      onClick={() => onClick(category)}
      className={`
        group relative w-full text-left bg-white rounded-2xl border-2 p-5
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isSelected 
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg' 
          : 'border-slate-200 hover:border-blue-300'}
      `}
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}`} />
      
      <div className="relative flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm">
          {category.usageIcon}
          <span className="text-[9px] font-semibold text-slate-600">{category.usage}</span>
        </div>
      </div>
      
      <h3 className="relative text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
        {category.name}
      </h3>
      
      <p className="relative text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">
        {category.description}
      </p>
      
      <div className="relative inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-[9px] font-mono text-slate-500 mb-3">
        <Gauge size={10} />
        {category.stats}
      </div>
      
      {subtypeCount > 0 && (
        <div className="relative inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-semibold ml-2">
          <LayoutGrid size={10} />
          {subtypeCount} configurations
        </div>
      )}
      
      <div className="relative flex items-center text-blue-600 font-semibold text-sm mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
        {subtypeCount > 0 ? 'Select configuration' : 'Continue'} 
        <ArrowRight className="w-4 h-4 ml-1" />
      </div>
      
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg ring-2 ring-blue-300 animate-pulse" />
        </div>
      )}
    </button>
  );
};

// Subtype Modal Component
const SubtypeModal = ({ category, onSelect, onClose }) => {
  const [selectedSubtype, setSelectedSubtype] = useState(null);
  const subtypes = categorySubtypes[category.id] || [];

  const handleConfirm = () => {
    if (selectedSubtype) {
      onSelect({
        categoryId: category.id,
        categoryName: category.name,
        parentCategory: category.id,
        subtypeId: selectedSubtype.id,
        subtypeName: selectedSubtype.name,
      });
    }
  };

  const Icon = category.icon || FallbackIcon;
  const gradient = category.gradient || 'from-blue-500 to-cyan-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{category.name}</h2>
                <p className="text-white/80 text-xs mt-0.5">Select specific configuration</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-3 max-h-[50vh] overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Available configurations ({subtypes.length})
            </p>
          </div>
          
          {subtypes.map((subtype) => (
            <button
              key={subtype.id}
              onClick={() => setSelectedSubtype(subtype)}
              className={`
                w-full text-left p-4 rounded-xl border-2 transition-all
                ${selectedSubtype?.id === subtype.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all
                  ${selectedSubtype?.id === subtype.id
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-500'
                  }
                `}>
                  {subtype.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-bold text-slate-800">{subtype.name}</h4>
                    {selectedSubtype?.id === subtype.id && (
                      <div className="flex items-center gap-1 text-blue-600 text-[10px] font-semibold">
                        <CheckCircle size={12} /> Selected
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {subtype.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                    <p className="text-[9px] text-slate-400 font-mono">
                      {subtype.functionality}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSubtype}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Continue to Site Profile <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export const MachineTypeSelection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showSubtypeModal, setShowSubtypeModal] = useState(false);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getMachineCategories();
        let rawCategories = response?.data?.data || [];

        if (rawCategories.length > 0 && typeof rawCategories[0] === 'string') {
          rawCategories = rawCategories.map((catId) => ({
            id: catId,
            ...categoryMetadata[catId],
            subtypes: categorySubtypes[catId] || [],
          }));
        }
        setCategories(rawCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        const fallbackCategories = Object.entries(categoryMetadata).map(([id, meta]) => ({
          id,
          ...meta,
          subtypes: categorySubtypes[id] || [],
        }));
        setCategories(fallbackCategories);
        setError('Using local category data. Some features may be limited.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategoryId(category.id);
    
    if (category.subtypes && category.subtypes.length > 0) {
      setPendingCategory(category);
      setShowSubtypeModal(true);
    } else {
      navigate('/site-task-profile', {
        state: {
          machineCategory: category.id,
          machineSubtype: null,
          categoryName: category.name,
        },
      });
    }
  };

  const handleSubtypeConfirm = (selection) => {
    setShowSubtypeModal(false);
    setPendingCategory(null);
    
    navigate('/site-task-profile', {
      state: {
        machineCategory: selection.parentCategory,
        machineSubtype: selection.subtypeId,
        categoryName: selection.subtypeName,
        parentCategory: selection.parentCategory,
      },
    });
  };

  const handleModalClose = () => {
    setShowSubtypeModal(false);
    setPendingCategory(null);
    setSelectedCategoryId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <p className="text-slate-500 mt-6 font-medium">Loading equipment categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_rgba(59,130,246,0.03)_0px,_rgba(59,130,246,0.03)_2px,_transparent_2px,_transparent_20px)]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
        
        {/* Header - Compact Title First */}
        <div className={`text-center max-w-3xl mx-auto mb-6 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Machine Type</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Select the category of cleaning equipment you need. Each category offers specific configurations 
            optimized for different environments.
          </p>
        </div>
        
        {/* Step Progress - Compact, Right Before Categories */}
        <div className={`mb-8 transition-all duration-700 delay-100 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <StepProgress />
        </div>

        {/* User Status - Optional */}
        {user && (
          <div className={`flex justify-center mb-6 transition-all duration-700 delay-150 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] text-slate-500">Signed in as</span>
              <span className="text-[9px] font-bold text-slate-700">{user?.username || user?.email?.split('@')[0] || 'User'}</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-600 text-sm max-w-md mx-auto flex items-center gap-2 justify-center">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Categories Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              isSelected={selectedCategoryId === cat.id}
              onClick={handleCategoryClick}
            />
          ))}
        </div>

        {/* Help Section */}
        <div className={`mt-12 text-center p-5 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 max-w-md mx-auto transition-all duration-700 delay-300 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <p className="text-xs text-slate-500">
            Need help choosing?{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
              Compare categories <ArrowRight size={10} />
            </button>
          </p>
        </div>
      </main>

      {/* Subtype Selection Modal */}
      {showSubtypeModal && pendingCategory && (
        <SubtypeModal
          category={pendingCategory}
          onSelect={handleSubtypeConfirm}
          onClose={handleModalClose}
        />
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MachineTypeSelection;
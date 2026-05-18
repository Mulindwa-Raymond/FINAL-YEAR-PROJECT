/**
 * MachineTypeSelection.jsx
 * 
 * User page for selecting the type of cleaning machine needed.
 * Displays 8 machine categories as interactive cards.
 * After selection, navigates to /site-task-profile with the selected category.
 * 
 * Features:
 * - Fetches categories from backend API (or uses fallback static data)
 * - Responsive grid layout
 * - Glassmorphism card design with hover effects
 * - Loading and error states
 * - User greeting
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Sparkles,
  Brush,
  Wind,
  Droplets,
  Zap,
  Fan,
  Sparkle,
  Wrench,
  SprayCan,
  Package,
  Home,
  Building2,
  Factory,
  Trees,
  Car,
  Scissors
} from 'lucide-react';
import { getMachineCategories } from '../services/equipmentService';
import Navbar from '../components/Navbar';

// ============================================================
// MachineCategoryCard Component (embedded)
// ============================================================

/**
 * MachineCategoryCard - Reusable component for displaying a machine category card.
 * 
 * Props:
 * - id: string - unique identifier for the category
 * - name: string - display name
 * - description: string - brief description
 * - icon: React node or string - icon element or emoji
 * - color: string - gradient color class (e.g., 'from-cyan-500 to-blue-500')
 * - active: boolean - whether the card is selected
 * - onClick: function - callback when card is clicked
 * - disabled: boolean - disable interaction
 * - className: string - additional CSS classes
 */

// Predefined gradient color mappings
const gradientMap = {
  cyan: 'from-cyan-500 to-blue-500',
  indigo: 'from-indigo-500 to-purple-500',
  sky: 'from-sky-500 to-teal-500',
  blue: 'from-blue-500 to-cyan-500',
  orange: 'from-orange-500 to-red-500',
  emerald: 'from-emerald-500 to-green-500',
  rose: 'from-rose-500 to-pink-500',
  violet: 'from-violet-500 to-purple-500',
  purple: 'from-purple-500 to-pink-500',
  teal: 'from-teal-500 to-cyan-500',
  amber: 'from-amber-500 to-orange-500',
  lime: 'from-lime-500 to-emerald-500',
  gray: 'from-gray-500 to-gray-600',
};

// Icon mapping using ONLY valid Lucide exports that definitely exist
const iconMap = {
  floor_scrubber: Brush,
  vacuum_cleaner: Wind,
  window_cleaner: Droplets,
  pressure_washer: SprayCan,
  steam_cleaner: Zap,
  carpet_cleaner: Package,
  sweeper: Fan,
  scrubber_drier: Sparkle,
};

// Fallback icon for any missing categories
const FallbackIcon = Wrench;

const MachineCategoryCard = ({
  id,
  name,
  description,
  icon,
  color = 'cyan',
  active = false,
  onClick,
  disabled = false,
  className = '',
}) => {
  const gradientClass = typeof color === 'string' && gradientMap[color] 
    ? gradientMap[color] 
    : color.includes('from-') ? color : gradientMap.cyan;
  
  const IconComponent = icon || iconMap[id] || FallbackIcon;
  const isEmoji = typeof icon === 'string';

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick({ id, name, description });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        group relative w-full text-left bg-white/80 backdrop-blur-xl 
        rounded-2xl border border-white/40 shadow-xl p-6 
        transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
        ${active ? 'ring-2 ring-cyan-500 ring-offset-2 bg-white/90' : ''}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Gradient overlay on hover */}
      <div 
        className={`
          absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientClass} 
          opacity-0 group-hover:opacity-5 transition-opacity duration-300
          ${active ? 'opacity-10' : ''}
        `} 
      />

      {/* Icon container */}
      <div 
        className={`
          w-14 h-14 rounded-xl bg-gradient-to-br ${gradientClass} 
          flex items-center justify-center mb-4 shadow-md
          transition-transform duration-300 group-hover:scale-105
        `}
      >
        {isEmoji ? (
          <span className="text-3xl">{icon}</span>
        ) : (
          <IconComponent className="w-7 h-7 text-white" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-cyan-700 transition-colors">
        {name}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 leading-relaxed mb-4">
        {description}
      </p>

      {/* Arrow indicator */}
      <div className="flex items-center text-cyan-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
        Select <ChevronRight className="w-4 h-4 ml-1" />
      </div>

      {/* Active indicator */}
      {active && (
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
        </div>
      )}
    </button>
  );
};

// Preset configurations for the 8 machine categories
const machineCategoryPresets = [
  { id: 'floor_scrubber', name: 'Floor Scrubbers', description: 'For hard floor cleaning and scrubbing. Ideal for tile, concrete, and vinyl surfaces.', color: 'cyan' },
  { id: 'vacuum_cleaner', name: 'Vacuum Cleaners', description: 'For dust and debris removal on carpets and hard floors. Available in wet/dry variants.', color: 'indigo' },
  { id: 'window_cleaner', name: 'Window Cleaners', description: 'For glass surface cleaning. Includes water-fed pole systems and robotic cleaners.', color: 'sky' },
  { id: 'pressure_washer', name: 'Pressure Washers', description: 'High-pressure water cleaning for exterior surfaces, driveways, and heavy-duty tasks.', color: 'blue' },
  { id: 'steam_cleaner', name: 'Steam Cleaners', description: 'Steam-based sanitisation for deep cleaning without chemicals. Ideal for kitchens and bathrooms.', color: 'orange' },
  { id: 'carpet_cleaner', name: 'Carpet Cleaners', description: 'Deep carpet extraction machines for removing stains and embedded dirt.', color: 'emerald' },
  { id: 'sweeper', name: 'Sweepers', description: 'Large area debris collection for warehouses, parking lots, and industrial spaces.', color: 'rose' },
  { id: 'scrubber_drier', name: 'Scrubber Driers', description: 'Combined scrubbing and drying in one pass. Perfect for large commercial floors.', color: 'violet' },
];

// ============================================================
// Main MachineTypeSelection Page Component
// ============================================================

export const MachineTypeSelection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Try to fetch from backend
      const response = await getMachineCategories();
      if (response.data.data && response.data.data.length > 0) {
        // Map backend categories to preset format
        const fetchedCategories = response.data.data.map(catId => {
          const preset = machineCategoryPresets.find(p => p.id === catId);
          return preset || {
            id: catId,
            name: catId.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            description: 'Cleaning equipment',
            color: 'gray',
          };
        });
        setCategories(fetchedCategories);
      } else {
        // Fallback to presets
        setCategories(machineCategoryPresets);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      // Fallback to presets on error
      setCategories(machineCategoryPresets);
      setError('Could not load categories from server. Using local data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category.id);
    // Navigate to site task profile with selected category
    navigate('/site-task-profile', { 
      state: { 
        machineCategory: category.id, 
        categoryName: category.name 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
          <p className="text-slate-500">Loading machine categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-cyan-200">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,0.4)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 border border-cyan-200 text-cyan-700 text-[10px] font-mono font-bold tracking-[0.2em] uppercase rounded-full mb-4">
            <Sparkles size={12} /> Step 1 of 3
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            Select Machine Type
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Choose the category of cleaning equipment you need. Each type has unique specifications tailored to different cleaning tasks.
          </p>
          {error && (
            <div className="mt-4 max-w-md mx-auto p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Welcome user greeting */}
        <div className="mb-8 text-center">
          <p className="text-slate-600">
            Welcome back, <span className="font-semibold text-cyan-700">{user?.username || user?.email}</span>
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <MachineCategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              description={category.description}
              color={category.color}
              active={selectedCategory === category.id}
              onClick={handleSelectCategory}
            />
          ))}
        </div>

        {/* Help text */}
        <div className="mt-12 text-center text-xs text-slate-400">
          <p>Need help choosing? <button className="text-cyan-600 hover:underline">Contact our support team</button></p>
        </div>
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default MachineTypeSelection;
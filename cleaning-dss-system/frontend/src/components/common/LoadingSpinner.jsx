/**
 * LoadingSpinner.jsx
 * 
 * A reusable loading spinner component with modern styling.
 * Displays a spinning animation and optional loading text.
 * 
 * Props:
 * - size: 'sm' (24px), 'md' (32px), 'lg' (48px), 'xl' (64px) – default 'md'
 * - text: string – optional loading message (e.g., "Loading...")
 * - fullScreen: boolean – if true, centers spinner in viewport with overlay
 * - variant: 'primary', 'light', 'dark' – default 'primary'
 */

import React from 'react';
import { Sparkles, Cpu, Zap } from 'lucide-react';

const sizeClasses = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-3',
  lg: 'w-14 h-14 border-4',
  xl: 'w-20 h-20 border-4',
};

const variantClasses = {
  primary: {
    border: 'border-blue-200',
    top: 'border-t-blue-600',
    text: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  light: {
    border: 'border-white/30',
    top: 'border-t-white',
    text: 'text-white',
    bg: 'bg-white/10'
  },
  dark: {
    border: 'border-slate-200',
    top: 'border-t-slate-700',
    text: 'text-slate-700',
    bg: 'bg-slate-50'
  }
};

export const LoadingSpinner = ({ 
  size = 'md', 
  text = null, 
  fullScreen = false,
  variant = 'primary'
}) => {
  const styles = variantClasses[variant];
  
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Spinner */}
      <div className="relative">
        <div
          className={`
            ${sizeClasses[size]} 
            ${styles.border} 
            ${styles.top} 
            rounded-full animate-spin
          `}
        />
        {/* Inner icon for larger sizes */}
        {(size === 'lg' || size === 'xl') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu size={size === 'lg' ? 16 : 24} className={`${styles.text} animate-pulse`} />
          </div>
        )}
      </div>
      
      {/* Loading Text with animated dots */}
      {text && (
        <div className="flex flex-col items-center gap-1">
          <p className={`text-sm font-medium ${styles.text} animate-pulse flex items-center gap-1.5`}>
            <Sparkles size={12} className={styles.text} />
            {text}
          </p>
          <div className="flex gap-1">
            <div className={`w-1 h-1 rounded-full ${styles.text} opacity-60 animate-bounce`} style={{ animationDelay: '0s' }} />
            <div className={`w-1 h-1 rounded-full ${styles.text} opacity-60 animate-bounce`} style={{ animationDelay: '0.2s' }} />
            <div className={`w-1 h-1 rounded-full ${styles.text} opacity-60 animate-bounce`} style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 ${styles.bg} backdrop-blur-md z-50 flex items-center justify-center transition-all duration-300 animate-in fade-in`}>
        <div className="flex flex-col items-center gap-6">
          {/* Logo/Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <Zap size={32} className="text-white" />
          </div>
          {spinnerContent}
        </div>
      </div>
    );
  }

  return spinnerContent;
};

// Inline loading component for buttons or small areas
export const InlineSpinner = ({ size = 'sm', variant = 'primary' }) => {
  const styles = variantClasses[variant];
  const sizeClass = size === 'sm' ? 'w-4 h-4 border-2' : 'w-6 h-6 border-2';
  
  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`
          ${sizeClass} 
          ${styles.border} 
          ${styles.top} 
          rounded-full animate-spin
        `}
      />
    </div>
  );
};

// Skeleton loading component for cards
export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-10 bg-slate-100 rounded-xl w-full mt-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (type === 'table') {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-full" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-xl w-full" />
        ))}
      </div>
    );
  }
  
  return null;
};

export default LoadingSpinner;
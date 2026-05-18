/**
 * LoadingSpinner.jsx
 * 
 * A reusable loading spinner component with glassmorphism styling.
 * Displays a spinning animation and optional loading text.
 * 
 * Props:
 * - size: 'sm' (24px), 'md' (32px), 'lg' (48px) – default 'md'
 * - text: string – optional loading message (e.g., "Loading...")
 * - fullScreen: boolean – if true, centers spinner in viewport with overlay
 */

import React from 'react';

const sizeClasses = {
  sm: 'w-6 h-6 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

export const LoadingSpinner = ({ size = 'md', text = null, fullScreen = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`
          ${sizeClasses[size]}
          border-cyan-600/30 border-t-cyan-600 rounded-full animate-spin
        `}
      />
      {text && <p className="text-slate-500 text-sm animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};
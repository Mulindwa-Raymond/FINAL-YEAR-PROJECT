/**
 * DatabaseImage.jsx
 * Reusable image renderer for database image URLs with loading state and fallback.
 */

import React from 'react';
import { ImageWithFallback } from './ImageWithFallback';
import { Package, Droplet, Wrench } from 'lucide-react';

const iconMap = {
  equipment: Wrench,
  detergent: Droplet,
  default: Package,
};

export const DatabaseImage = ({
  src,
  alt = 'Image',
  className = '',
  type = 'default',
  fallbackSrc = 'https://via.placeholder.com/400x300?text=No+Image',
  ...props
}) => {
  const Icon = iconMap[type] || iconMap.default;

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`} {...props}>
        <Icon className="w-10 h-10" />
      </div>
    );
  }

  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      className={className}
      fallbackSrc={fallbackSrc}
      lazyLoad={true}
      {...props}
    />
  );
};

export default DatabaseImage;

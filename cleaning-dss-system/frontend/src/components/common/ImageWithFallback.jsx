/**
 * ImageWithFallback.jsx
 * Reusable image component with loading states, fallback, and error handling.
 */

import React, { useState, useEffect } from 'react';
import { Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';

export const ImageWithFallback = ({
  src,
  alt = 'Image',
  className = '',
  fallbackSrc = null,
  lazyLoad = true,
  showLoading = true,
  onError = null,
  onLoad = null,
  width = null,
  height = null,
  objectFit = 'cover',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Reset state when src changes
  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    if (retryCount < maxRetries) {
      // Retry loading after a short delay
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        setImageSrc(src + '?retry=' + Date.now());
      }, 500);
      return;
    }

    setIsLoading(false);
    setHasError(true);
    
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    
    if (onError) onError();
  };

  // Determine if we should show the image
  const showImage = imageSrc && !hasError;

  // Get object fit class
  const objectFitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    scaleDown: 'object-scale-down'
  }[objectFit] || 'object-cover';

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {/* Loading state */}
      {isLoading && showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 z-10 animate-pulse">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Image */}
      {showImage ? (
        <img
          src={imageSrc}
          alt={alt}
          loading={lazyLoad ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          width={width}
          height={height}
          className={`
            w-full h-full transition-opacity duration-300
            ${objectFitClass}
            ${isLoading ? 'opacity-0' : 'opacity-100'}
            ${hasError ? 'opacity-50' : ''}
          `}
          {...props}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
          <div className="text-center p-4">
            {hasError ? (
              <>
                <AlertCircle className="w-8 h-8 text-red-300 mx-auto mb-1" />
                <p className="text-[8px] text-slate-400">Failed to load</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-[8px] text-slate-400">No image</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Retry count badge (debug) */}
      {process.env.NODE_ENV === 'development' && retryCount > 0 && (
        <div className="absolute top-1 right-1 bg-yellow-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">
          {retryCount}
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
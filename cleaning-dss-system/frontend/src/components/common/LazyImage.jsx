/**
 * LazyImage.jsx
 * Intersection Observer based lazy loading with blur-up effect.
 */

import React, { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './ImageWithFallback';

export const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderSrc = null,
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setHasLoaded(true);
  };

  return (
    <div ref={ref} className="w-full h-full">
      {isVisible ? (
        <ImageWithFallback
          src={src}
          alt={alt}
          className={`
            ${className}
            transition-all duration-700
            ${hasLoaded ? 'blur-0 scale-100' : 'blur-sm scale-105'}
          `}
          onLoad={handleLoad}
          {...props}
        />
      ) : (
        <div className="w-full h-full bg-slate-200 animate-pulse">
          {placeholderSrc && (
            <img
              src={placeholderSrc}
              alt=""
              className="w-full h-full object-cover opacity-0"
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LazyImage;
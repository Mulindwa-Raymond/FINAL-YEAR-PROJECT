/**
 * cache.js
 * In-memory cache middleware with TTL support.
 * Can be replaced with Redis for production.
 */

const cache = new Map();
const DEFAULT_TTL = 300; // 5 minutes
const MAX_CACHE_SIZE = 1000; // Maximum items in cache

/**
 * Generate a cache key from request
 */
const generateCacheKey = (req) => {
  const key = `${req.method}:${req.originalUrl}`;
  return key;
};

/**
 * Clean expired cache entries
 */
const cleanExpiredCache = () => {
  const now = Date.now();
  let removed = 0;
  
  for (const [key, value] of cache) {
    if (value.expires < now) {
      cache.delete(key);
      removed++;
    }
  }
  
  return removed;
};

/**
 * Ensure cache doesn't exceed max size
 */
const enforceMaxCacheSize = () => {
  if (cache.size > MAX_CACHE_SIZE) {
    // Remove oldest entries (based on creation time)
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].created - b[1].created);
    
    const toRemove = entries.slice(0, Math.floor(cache.size * 0.2));
    for (const [key] of toRemove) {
      cache.delete(key);
    }
  }
};

/**
 * Cache middleware
 * @param {number} ttl - Time to live in seconds (default: 300)
 */
const cacheMiddleware = (ttl = DEFAULT_TTL) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip cache for admin routes (they need fresh data)
    if (req.originalUrl.includes('/admin') || req.originalUrl.includes('/auth')) {
      return next();
    }

    // Skip cache for recommendation endpoints (dynamic)
    if (req.originalUrl.includes('/recommend') || req.originalUrl.includes('/recommendations')) {
      return next();
    }

    const key = generateCacheKey(req);
    const cached = cache.get(key);

    // Clean expired entries periodically
    if (Math.random() < 0.01) { // 1% chance on each request
      cleanExpiredCache();
    }

    if (cached && cached.expires > Date.now()) {
      // Return cached response with cache headers
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', `max-age=${ttl}`);
      return res.json(cached.data);
    }

    // Store original json method
    const originalJson = res.json;
    
    res.json = function(data) {
      // Cache the response
      const cachedData = {
        data: data,
        expires: Date.now() + (ttl * 1000),
        created: Date.now()
      };
      
      cache.set(key, cachedData);
      enforceMaxCacheSize();
      
      // Set cache headers
      res.set('X-Cache', 'MISS');
      res.set('Cache-Control', `max-age=${ttl}`);
      
      // Call original json
      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Clear cache by key pattern
 * @param {string} pattern - Optional pattern to match
 */
const clearCache = (pattern = null) => {
  if (!pattern) {
    cache.clear();
    console.log('🗑️ Cache cleared completely');
    return;
  }
  
  let count = 0;
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
      count++;
    }
  }
  
  if (count > 0) {
    console.log(`🗑️ Cleared ${count} cache entries matching pattern: ${pattern}`);
  }
};

/**
 * Get cache stats
 */
const getCacheStats = () => {
  const now = Date.now();
  let active = 0;
  let expired = 0;
  
  for (const [, value] of cache) {
    if (value.expires > now) {
      active++;
    } else {
      expired++;
    }
  }
  
  return {
    total: cache.size,
    active,
    expired,
    maxSize: MAX_CACHE_SIZE
  };
};

module.exports = { 
  cacheMiddleware, 
  clearCache, 
  getCacheStats,
  cleanExpiredCache,
  enforceMaxCacheSize
};
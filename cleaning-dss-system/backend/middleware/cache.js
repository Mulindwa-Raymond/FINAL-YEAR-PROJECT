/**
 * Caching Middleware
 * Provides intelligent caching for API endpoints with different strategies
 */

const NodeCache = require('node-cache');
const crypto = require('crypto');

// Create cache instances with different TTLs
const shortCache = new NodeCache({ stdTTL: 300, checkperiod: 120 }); // 5 minutes
const mediumCache = new NodeCache({ stdTTL: 1800, checkperiod: 300 }); // 30 minutes
const longCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); // 1 hour

// Cache key generators
const generateCacheKey = (req, options = {}) => {
  const { includeQuery = true, includeUser = false, prefix = '' } = options;
  
  let keyParts = [req.method, req.originalUrl || req.url];
  
  if (includeQuery && Object.keys(req.query).length > 0) {
    const sortedQuery = Object.keys(req.query)
      .sort()
      .reduce((result, key) => {
        result[key] = req.query[key];
        return result;
      }, {});
    keyParts.push(JSON.stringify(sortedQuery));
  }
  
  if (includeUser && req.user && req.user.id) {
    keyParts.push(`user:${req.user.id}`);
  }
  
  if (prefix) {
    keyParts.unshift(prefix);
  }
  
  const keyString = keyParts.join(':');
  return crypto.createHash('md5').update(keyString).digest('hex');
};

// Cache middleware factory
const cacheMiddleware = (options = {}) => {
  const {
    ttl = 'short', // 'short', 'medium', 'long'
    includeQuery = true,
    includeUser = false,
    keyPrefix = '',
    condition = () => true // Function to determine if caching should be applied
  } = options;
  
  const cache = ttl === 'short' ? shortCache : ttl === 'medium' ? mediumCache : longCache;
  
  return (req, res, next) => {
    // Skip caching if condition is not met
    if (!condition(req, res)) {
      return next();
    }
    
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    const cacheKey = generateCacheKey(req, { includeQuery, includeUser, prefix: keyPrefix });
    
    // Try to get from cache
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      console.log(`🎯 Cache HIT for ${req.originalUrl} (${cacheKey})`);
      res.set(cachedResponse.headers);
      return res.status(cachedResponse.status).json(cachedResponse.data);
    }
    
    console.log(`❌ Cache MISS for ${req.originalUrl} (${cacheKey})`);
    
    // Override res.json to capture response
    const originalJson = res.json;
    const originalStatus = res.status;
    
    res.json = function(data) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const responseToCache = {
          status: res.statusCode,
          headers: res.getHeaders(),
          data: data
        };
        
        cache.set(cacheKey, responseToCache);
        console.log(`💾 Cached response for ${req.originalUrl} (${ttl} TTL)`);
      }
      
      return originalJson.call(this, data);
    };
    
    res.status = function(code) {
      originalStatus.call(this, code);
      return this;
    };
    
    next();
  };
};

// Cache invalidation utilities
const invalidateCache = (pattern, cacheInstance = null) => {
  const caches = cacheInstance ? [cacheInstance] : [shortCache, mediumCache, longCache];
  
  caches.forEach(cache => {
    const keys = cache.keys();
    const keysToDelete = keys.filter(key => {
      if (typeof pattern === 'string') {
        return key.includes(pattern);
      } else if (pattern instanceof RegExp) {
        return pattern.test(key);
      }
      return false;
    });
    
    if (keysToDelete.length > 0) {
      cache.del(keysToDelete);
      console.log(`🗑️ Invalidated ${keysToDelete.length} cache entries matching pattern: ${pattern}`);
    }
  });
};

const invalidateCacheByKey = (key, cacheInstance = null) => {
  const caches = cacheInstance ? [cacheInstance] : [shortCache, mediumCache, longCache];
  
  caches.forEach(cache => {
    if (cache.has(key)) {
      cache.del(key);
      console.log(`🗑️ Invalidated cache key: ${key}`);
    }
  });
};

// Clear all caches
const clearAllCaches = () => {
  shortCache.flushAll();
  mediumCache.flushAll();
  longCache.flushAll();
  console.log('🧹 Cleared all caches');
};

// Cache statistics
const getCacheStats = () => {
  return {
    short: shortCache.getStats(),
    medium: mediumCache.getStats(),
    long: longCache.getStats()
  };
};

// Predefined cache configurations for different endpoint types
const cacheConfigs = {
  // Static data that rarely changes
  static: {
    ttl: 'long',
    includeQuery: false,
    keyPrefix: 'static'
  },
  
  // Lists that change occasionally
  lists: {
    ttl: 'medium',
    includeQuery: true,
    keyPrefix: 'list'
  },
  
  // User-specific data
  userSpecific: {
    ttl: 'short',
    includeQuery: true,
    includeUser: true,
    keyPrefix: 'user'
  },
  
  // Recommendations (expensive computations)
  recommendations: {
    ttl: 'short',
    includeQuery: true,
    includeUser: true,
    keyPrefix: 'recommend'
  },
  
  // Search results
  search: {
    ttl: 'short',
    includeQuery: true,
    keyPrefix: 'search'
  }
};

module.exports = {
  cacheMiddleware,
  invalidateCache,
  invalidateCacheByKey,
  clearAllCaches,
  getCacheStats,
  cacheConfigs,
  generateCacheKey,
  // Direct access to cache instances for advanced usage
  caches: {
    short: shortCache,
    medium: mediumCache,
    long: longCache
  }
};

/**
 * Cache Invalidation Utilities
 * Provides centralized cache invalidation for different data types
 */

const { invalidateCache } = require('../middleware/cache');

/**
 * Invalidate caches related to equipment data
 */
const invalidateEquipmentCache = () => {
  console.log('🗑️ Invalidating equipment-related caches');
  invalidateCache('equipment');
  invalidateCache('list');
  invalidateCache('static');
};

/**
 * Invalidate caches related to detergent data
 */
const invalidateDetergentCache = () => {
  console.log('🗑️ Invalidating detergent-related caches');
  invalidateCache('detergent');
  invalidateCache('list');
};

/**
 * Invalidate caches related to compatibility data
 */
const invalidateCompatibilityCache = () => {
  console.log('🗑️ Invalidating compatibility-related caches');
  invalidateCache('compatibility');
  invalidateCache('list');
};

/**
 * Invalidate caches related to equipment specs
 */
const invalidateEquipmentSpecsCache = () => {
  console.log('🗑️ Invalidating equipment specs-related caches');
  invalidateCache('equipment-specs');
  invalidateCache('specs');
  invalidateCache('list');
  invalidateCache('static');
};

/**
 * Invalidate caches related to rules
 */
const invalidateRulesCache = () => {
  console.log('🗑️ Invalidating rules-related caches');
  invalidateCache('rules');
  invalidateCache('list');
  // Also invalidate recommendation cache since rules affect recommendations
  invalidateCache('recommend');
};

/**
 * Invalidate caches related to training data
 */
const invalidateTrainingCache = () => {
  console.log('🗑️ Invalidating training-related caches');
  invalidateCache('training');
  invalidateCache('list');
};

/**
 * Invalidate caches related to user recommendations
 */
const invalidateUserRecommendationCache = (userId) => {
  console.log(`🗑️ Invalidating recommendation cache for user: ${userId}`);
  invalidateCache('user');
  invalidateCache('recommend');
};

/**
 * Invalidate all caches (for major updates)
 */
const invalidateAllCaches = () => {
  console.log('🗑️ Invalidating all caches');
  invalidateCache(() => true); // Invalidate everything
};

/**
 * Middleware to automatically invalidate caches after successful write operations
 */
const cacheInvalidationMiddleware = (invalidationFn) => {
  return (req, res, next) => {
    // Store original res.json method
    const originalJson = res.json;
    
    // Override res.json to intercept successful responses
    res.json = function(data) {
      // If response is successful (2xx status code), invalidate caches
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Call the invalidation function asynchronously
        setImmediate(() => {
          try {
            invalidationFn(req, res, data);
          } catch (error) {
            console.error('Cache invalidation error:', error);
          }
        });
      }
      
      // Call original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

module.exports = {
  invalidateEquipmentCache,
  invalidateDetergentCache,
  invalidateCompatibilityCache,
  invalidateEquipmentSpecsCache,
  invalidateRulesCache,
  invalidateTrainingCache,
  invalidateUserRecommendationCache,
  invalidateAllCaches,
  cacheInvalidationMiddleware
};

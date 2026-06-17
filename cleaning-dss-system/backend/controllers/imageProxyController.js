/**
 * imageProxyController.js
 * Handles image proxying requests from the frontend.
 * Uses imageProxyService to fetch, cache, and serve images.
 */

const { getImageWithHeaders, getPlaceholder, getImageCacheStats, clearImageCache } = require('../services/imageProxyService');
const { success, error } = require('../utils/apiResponse');

/**
 * Proxy and serve an image from a URL
 * GET /api/image-proxy?url=<encoded_url>
 * 
 * Query Parameters:
 * - url: The URL of the image to fetch (required)
 * 
 * Response:
 * - On success: Image data with appropriate Content-Type
 * - On failure: A placeholder SVG image
 */
const proxyImage = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return error(res, 'Missing url parameter. Please provide a url query parameter.', 400);
  }

  try {
    console.log(`📸 Proxying image: ${url.substring(0, 100)}...`);
    
    const result = await getImageWithHeaders(url);
    
    if (!result) {
      console.warn(`⚠️ Failed to fetch image, returning placeholder: ${url.substring(0, 60)}...`);
      const placeholder = getPlaceholder();
      res.set('Content-Type', placeholder.contentType);
      res.set('Cache-Control', 'public, max-age=3600'); // Cache placeholder for 1 hour
      return res.send(placeholder.data);
    }

    // Set proper headers
    res.set('Content-Type', result.contentType);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.set('X-Cache-Key', result.cacheKey || '');
    
    // Send the image data
    res.send(result.data);
  } catch (err) {
    console.error('❌ Image proxy error:', err.message);
    
    // Return placeholder on error
    const placeholder = getPlaceholder();
    res.set('Content-Type', placeholder.contentType);
    res.set('Cache-Control', 'public, max-age=300'); // Cache error placeholder for 5 minutes
    res.send(placeholder.data);
  }
};

/**
 * Get image cache statistics (admin only)
 * GET /api/image-proxy/stats
 */
const getCacheStats = async (req, res) => {
  try {
    const stats = getImageCacheStats();
    return success(res, stats, 'Image cache statistics retrieved');
  } catch (err) {
    console.error('Failed to get cache stats:', err);
    return error(res, 'Failed to retrieve cache statistics', 500);
  }
};

/**
 * Clear image cache (admin only)
 * POST /api/image-proxy/clear-cache
 */
const clearCache = async (req, res) => {
  try {
    const count = clearImageCache();
    return success(res, { cleared: count }, `Cleared ${count} images from cache`);
  } catch (err) {
    console.error('Failed to clear cache:', err);
    return error(res, 'Failed to clear image cache', 500);
  }
};

module.exports = {
  proxyImage,
  getCacheStats,
  clearCache
};
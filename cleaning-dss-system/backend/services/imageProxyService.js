/**
 * imageProxyService.js
 * Handles image fetching, caching, and optimization.
 * Includes URL validation, size limits, and format detection.
 */

const axios = require('axios');
const crypto = require('crypto');

// In-memory image cache
const imageCache = new Map();
const IMAGE_CACHE_TTL = 86400; // 24 hours in seconds
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CACHE_SIZE = 200; // Maximum images in cache

// Allowed image hosts for security
// Add more hosts as needed
const ALLOWED_HOSTS = [
  's1.kaercher-media.com',
  'www.nilfisk.com',
  'numatic.com',
  'images.unsplash.com',
  's3.amazonaws.com',
  'cdn.shopify.com',
  'media.istockphoto.com',
  'via.placeholder.com', // Added for placeholder support
  'cleanmatch.vercel.app', // Added for self-hosted images
  'localhost', // Added for local development
  '127.0.0.1' // Added for local development
];

// Default placeholder image (SVG)
const PLACEHOLDER_SVG = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  <circle cx="8.5" cy="8.5" r="1.5" />
  <polyline points="21 15 16 10 5 21" />
</svg>`);

/**
 * Validate if URL is allowed
 */
const isUrlAllowed = (url) => {
  try {
    const parsedUrl = new URL(url);
    return ALLOWED_HOSTS.some(host => parsedUrl.hostname.includes(host));
  } catch {
    return false;
  }
};

/**
 * Generate cache key for image
 */
const getImageCacheKey = (url, maxWidth = null) => {
  const hash = crypto.createHash('md5').update(url).digest('hex');
  return maxWidth ? `${hash}:${maxWidth}` : hash;
};

/**
 * Clean expired image cache
 */
const cleanImageCache = () => {
  const now = Date.now();
  let removed = 0;
  
  for (const [key, value] of imageCache) {
    if (value.expires < now) {
      imageCache.delete(key);
      removed++;
    }
  }
  
  // Enforce max size
  if (imageCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(imageCache.entries());
    entries.sort((a, b) => a[1].created - b[1].created);
    const toRemove = entries.slice(0, Math.floor(entries.length * 0.3));
    for (const [key] of toRemove) {
      imageCache.delete(key);
    }
    removed += toRemove.length;
  }
  
  return removed;
};

/**
 * Fetch and cache an image from URL
 * @param {string} url - Image URL
 * @param {number} maxWidth - Max width to resize to (optional)
 * @returns {Promise<Buffer|null>} Image buffer or null on failure
 */
const fetchImage = async (url, maxWidth = null) => {
  if (!url) return null;

  // Validate URL
  if (!isUrlAllowed(url)) {
    console.warn(`⚠️ Image URL not allowed: ${url}`);
    return null;
  }

  const cacheKey = getImageCacheKey(url, maxWidth);
  
  // Check cache
  const cached = imageCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  try {
    console.log(`📥 Fetching image: ${url.substring(0, 60)}...`);

    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: {
        'User-Agent': 'CleanMatch-DSS/1.0 (https://cleanmatch.com)',
        'Accept': 'image/webp,image/*,*/*;q=0.8'
      },
      maxContentLength: MAX_IMAGE_SIZE,
      validateStatus: (status) => status === 200
    });

    // Check content type
    const contentType = response.headers['content-type'] || '';
    if (!contentType.startsWith('image/')) {
      console.warn(`⚠️ Invalid content type for image: ${contentType}`);
      return null;
    }

    let imageData = response.data;

    // Store in cache
    imageCache.set(cacheKey, {
      data: imageData,
      expires: Date.now() + (IMAGE_CACHE_TTL * 1000),
      created: Date.now(),
      contentType: contentType
    });

    // Clean cache periodically
    if (imageCache.size > MAX_CACHE_SIZE * 0.8) {
      cleanImageCache();
    }

    console.log(`✅ Image cached: ${cacheKey.substring(0, 16)}... (${imageData.length} bytes)`);
    return imageData;
  } catch (error) {
    console.error(`❌ Failed to fetch image: ${url}`, error.message);
    return null;
  }
};

/**
 * Get image with content type headers
 */
const getImageWithHeaders = async (url) => {
  const data = await fetchImage(url);
  if (!data) return null;
  
  const cacheKey = getImageCacheKey(url);
  const cached = imageCache.get(cacheKey);
  
  return {
    data,
    contentType: cached?.contentType || 'image/jpeg',
    cacheKey
  };
};

/**
 * Get placeholder image
 */
const getPlaceholder = () => {
  return {
    data: PLACEHOLDER_SVG,
    contentType: 'image/svg+xml'
  };
};

/**
 * Clear image cache
 */
const clearImageCache = () => {
  const count = imageCache.size;
  imageCache.clear();
  console.log(`🗑️ Cleared ${count} images from cache`);
  return count;
};

/**
 * Get image cache stats
 */
const getImageCacheStats = () => {
  const now = Date.now();
  let active = 0;
  let expired = 0;
  let totalSize = 0;
  
  for (const [, value] of imageCache) {
    if (value.expires > now) {
      active++;
    } else {
      expired++;
    }
    totalSize += value.data.length;
  }
  
  return {
    total: imageCache.size,
    active,
    expired,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    maxSize: MAX_CACHE_SIZE,
    allowedHosts: ALLOWED_HOSTS
  };
};

module.exports = {
  fetchImage,
  getImageWithHeaders,
  getPlaceholder,
  clearImageCache,
  getImageCacheStats,
  cleanImageCache,
  isUrlAllowed
};
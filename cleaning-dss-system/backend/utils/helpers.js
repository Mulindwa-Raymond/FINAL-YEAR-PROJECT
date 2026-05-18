/**
 * Helper Functions
 * Reusable utility functions for common tasks.
 */

/**
 * Capitalize the first letter of a string.
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert a string to slug (URL-friendly).
 * @param {string} str - Input string
 * @returns {string} Slug
 */
const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Format a number as currency (UGX).
 * @param {number} amount - Amount in UGX
 * @returns {string} Formatted currency string
 */
const formatCurrencyUGX = (amount) => {
  if (amount === undefined || amount === null) return 'UGX 0';
  return `UGX ${amount.toLocaleString('en-US')}`;
};

/**
 * Calculate the age of a document from its createdAt timestamp.
 * @param {Date} createdAt - MongoDB createdAt date
 * @returns {string} Human-readable age (e.g., '2 days ago')
 */
const getAge = (createdAt) => {
  const diff = Date.now() - new Date(createdAt).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
};

/**
 * Truncate a string to a maximum length and add ellipsis.
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Truncated string
 */
const truncate = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * Check if a value is a valid MongoDB ObjectId.
 * @param {string} id - Candidate ID
 * @returns {boolean} True if valid
 */
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Convert intensity string to human-readable label.
 * @param {string} intensity - 'light', 'medium', or 'heavy'
 * @returns {string} Human label
 */
const intensityToLabel = (intensity) => {
  const map = {
    light: 'Light Duty / Residential',
    medium: 'Medium Duty / Commercial',
    heavy: 'Heavy Duty / Industrial'
  };
  return map[intensity] || intensity;
};

/**
 * Convert domain to human-readable label.
 * @param {string} domain - 'domestic' or 'industrial'
 * @returns {string} Human label
 */
const domainToLabel = (domain) => {
  return domain === 'domestic' ? 'Domestic / Home' : 'Industrial / Commercial';
};

/**
 * Generate a random string (e.g., for temporary passwords).
 * @param {number} length - Desired length
 * @returns {string} Random alphanumeric string
 */
const randomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = {
  capitalize,
  slugify,
  formatCurrencyUGX,
  getAge,
  truncate,
  isValidObjectId,
  intensityToLabel,
  domainToLabel,
  randomString
};
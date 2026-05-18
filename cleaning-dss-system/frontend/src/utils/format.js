/**
 * format.js
 * 
 * Reusable formatting functions for currency, dates, strings, etc.
 */

/**
 * Format a number as Ugandan Shillings (UGX).
 * @param {number} amount - Amount in UGX
 * @returns {string} Formatted currency string
 */
export const formatCurrencyUGX = (amount) => {
  if (amount === undefined || amount === null) return 'UGX 0';
  return `UGX ${amount.toLocaleString('en-US')}`;
};

/**
 * Format a number as a percentage (e.g., 0.22 → 22%).
 * @param {number} value - Decimal value (0‑1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === undefined || value === null) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format a date string into a readable local date.
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Formatted date (e.g., "Apr 10, 2026")
 */
export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date and time.
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Truncate a string to a maximum length and add ellipsis.
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * Capitalize the first letter of each word.
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Convert intensity value to user-friendly label.
 * @param {string} intensity - 'light', 'medium', 'heavy'
 * @returns {string} Human‑readable label
 */
export const intensityToLabel = (intensity) => {
  const map = {
    light: 'Light Duty / Residential',
    medium: 'Medium Duty / Commercial',
    heavy: 'Heavy Duty / Industrial',
  };
  return map[intensity] || intensity;
};

/**
 * Convert domain to user-friendly label.
 * @param {string} domain - 'domestic' or 'industrial'
 * @returns {string} Human‑readable label
 */
export const domainToLabel = (domain) => {
  return domain === 'domestic' ? 'Domestic / Home' : 'Industrial / Commercial';
};

/**
 * Format a number with thousands separators.
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString('en-US');
};

/**
 * Get a readable file size from bytes.
 * @param {number} bytes - Size in bytes
 * @returns {string} Human‑readable size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
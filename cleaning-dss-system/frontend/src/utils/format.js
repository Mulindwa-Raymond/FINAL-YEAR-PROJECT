/**
 * format.js
 * 
 * Reusable formatting functions for currency, dates, strings, area, noise levels, etc.
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
 * Format a number as Ugandan Shillings with abbreviation (e.g., UGX 1.2M)
 * @param {number} amount - Amount in UGX
 * @returns {string} Abbreviated currency string
 */
export const formatCurrencyUGXAbbr = (amount) => {
  if (amount === undefined || amount === null) return 'UGX 0';
  
  if (amount >= 1_000_000) {
    return `UGX ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `UGX ${(amount / 1_000).toFixed(0)}K`;
  }
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
 * Convert snake_case to Title Case with spaces.
 * @param {string} str - Snake case string (e.g., "floor_scrubber")
 * @returns {string} Title Case (e.g., "Floor Scrubber")
 */
export const snakeToTitle = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
 * @param {string} domain - 'domestic', 'commercial', 'industrial'
 * @returns {string} Human‑readable label
 */
export const domainToLabel = (domain) => {
  const map = {
    domestic: 'Domestic / Home',
    commercial: 'Commercial / Professional',
    industrial: 'Industrial / Heavy-Duty',
  };
  return map[domain] || domain;
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

/**
 * Format area size with appropriate unit.
 * @param {number} areaSize - Area in square meters
 * @returns {string} Formatted area (e.g., "500 m²")
 */
export const formatArea = (areaSize) => {
  if (!areaSize) return '-';
  return `${formatNumber(areaSize)} m²`;
};

/**
 * Format noise level with dB unit.
 * @param {number} noiseLevel - Noise level in decibels
 * @returns {string} Formatted noise level (e.g., "68 dB")
 */
export const formatNoiseLevel = (noiseLevel) => {
  if (!noiseLevel) return '-';
  return `${noiseLevel} dB`;
};

/**
 * Format pressure with bar unit.
 * @param {number} pressure - Pressure in bar
 * @returns {string} Formatted pressure (e.g., "120 bar")
 */
export const formatPressure = (pressure) => {
  if (!pressure) return '-';
  return `${pressure} bar`;
};

/**
 * Format flow rate with L/min unit.
 * @param {number} flowRate - Flow rate in L/min
 * @returns {string} Formatted flow rate (e.g., "7.5 L/min")
 */
export const formatFlowRate = (flowRate) => {
  if (!flowRate) return '-';
  return `${flowRate} L/min`;
};

/**
 * Format tank capacity with liters unit.
 * @param {number} capacity - Capacity in liters
 * @returns {string} Formatted capacity (e.g., "45 L")
 */
export const formatTankCapacity = (capacity) => {
  if (!capacity) return '-';
  return `${capacity} L`;
};

/**
 * Format working width with mm unit.
 * @param {number} width - Width in millimeters
 * @returns {string} Formatted width (e.g., "750 mm")
 */
export const formatWorkingWidth = (width) => {
  if (!width) return '-';
  return `${width} mm`;
};

/**
 * Get noise level category based on dB value.
 * @param {number} dB - Decibel value
 * @returns {string} 'low', 'medium', or 'high'
 */
export const getNoiseCategory = (dB) => {
  if (!dB) return 'medium';
  if (dB <= 60) return 'low';
  if (dB <= 70) return 'medium';
  return 'high';
};

/**
 * Get color class for match score.
 * @param {number} score - Score from 0-100
 * @returns {string} Tailwind CSS color classes
 */
export const getMatchScoreColor = (score) => {
  if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(date);
};
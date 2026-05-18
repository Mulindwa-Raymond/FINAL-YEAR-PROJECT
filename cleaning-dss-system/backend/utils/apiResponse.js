/**
 * API Response Utility
 * Provides standard success and error response formatters.
 * All API responses will follow the same structure.
 */

/**
 * Send a success response.
 * @param {Object} res - Express response object
 * @param {any} data - Data payload to send
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default 200)
 * @returns {Object} Express response
 */
const success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send an error response.
 * @param {Object} res - Express response object
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {Object} details - Optional additional error details (e.g., validation errors)
 * @returns {Object} Express response
 */
const error = (res, error, statusCode = 500, details = null) => {
  const response = {
    success: false,
    error,
    timestamp: new Date().toISOString()
  };
  if (details) response.details = details;
  return res.status(statusCode).json(response);
};

module.exports = { success, error };
/**
 * Error Handler Middleware
 * Centralized error handling for the entire application.
 * Logs errors and sends appropriate HTTP responses.
 */

const logger = require('../config/logger');

/**
 * Global error handler.
 * Must be registered after all routes and middleware.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error (with stack trace in development)
  const logMessage = `${req.method} ${req.url} - ${err.message}`;
  if (process.env.NODE_ENV === 'development') {
    logger.error(logMessage, { stack: err.stack });
  } else {
    logger.error(logMessage);
  }

  // Default status and message
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `Duplicate value for ${field}. Please use another value.`;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle JWT errors (already caught in auth, but just in case)
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token.';
  }
  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired.';
  }

  res.status(status).json({ success: false, error: message });
};

module.exports = errorHandler;
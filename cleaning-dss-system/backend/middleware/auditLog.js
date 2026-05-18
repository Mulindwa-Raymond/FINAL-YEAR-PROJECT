/**
 * Audit Log Middleware
 * Automatically logs admin actions after the response is sent.
 * Uses the AuditLog model to store records.
 */

const AuditLog = require('../models/AuditLog');

/**
 * Factory to create an audit logging middleware for a specific action.
 * @param {string} action - The action name (e.g., 'CREATE_USER', 'UPDATE_EQUIPMENT')
 * @param {string} targetType - Optional, type of target (e.g., 'User', 'Equipment')
 * @param {Function} getTargetId - Optional function to extract targetId from request (req, res)
 * @returns {Function} Express middleware
 */
const auditLog = (action, targetType = null, getTargetId = null) => {
  return async (req, res, next) => {
    // Store original send function to intercept response
    const originalSend = res.json;
    let responseBody = null;

    // Override res.json to capture response body
    res.json = function(body) {
      responseBody = body;
      originalSend.call(this, body);
    };

    // Continue to route handler
    next();

    // After response is sent, log the action (but we need to wait for finish)
    res.on('finish', async () => {
      // Only log if user is authenticated and has admin role
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
        return;
      }

      let targetId = null;
      if (getTargetId) {
        targetId = getTargetId(req, res);
      } else if (req.params.id) {
        targetId = req.params.id;
      } else if (responseBody && responseBody.data && responseBody.data._id) {
        targetId = responseBody.data._id;
      }

      try {
        await AuditLog.create({
          adminId: req.user.id,
          action: action,
          targetType: targetType,
          targetId: targetId,
          details: {
            method: req.method,
            url: req.originalUrl,
            body: req.body,
            query: req.query,
            statusCode: res.statusCode,
            response: responseBody
          },
          ipAddress: req.ip || req.connection.remoteAddress
        });
      } catch (err) {
        console.error('Failed to save audit log:', err);
      }
    });
  };
};

/**
 * Middleware to manually log an action (for cases where automatic logging is not possible).
 * Can be called from controllers.
 */
const manualAuditLog = async (req, action, targetType, targetId, details = {}) => {
  try {
    await AuditLog.create({
      adminId: req.user.id,
      action: action,
      targetType: targetType,
      targetId: targetId,
      details: details,
      ipAddress: req.ip || req.connection.remoteAddress
    });
  } catch (err) {
    console.error('Failed to save manual audit log:', err);
  }
};

module.exports = { auditLog, manualAuditLog };
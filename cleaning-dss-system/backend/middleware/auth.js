/**
 * Authentication Middleware
 * - auth: Verifies JWT token and attaches user to request
 * - requireAdmin: Checks if user is admin or super_admin
 * - requireSuperAdmin: Checks if user is super_admin only
 * - requireAdminOrSelf: Allows admin to edit their own profile
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { roles } = require('../config/roles');

/**
 * Base authentication middleware
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password_hash');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, error: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired.' });
    }
    res.status(500).json({ success: false, error: 'Authentication error.' });
  }
};

/**
 * Require admin or super_admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }
  if (req.user.role !== roles.ADMIN && req.user.role !== roles.SUPER_ADMIN) {
    return res.status(403).json({ success: false, error: 'Admin access required.' });
  }
  next();
};

/**
 * Require super_admin role only
 */
const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }
  if (req.user.role !== roles.SUPER_ADMIN) {
    return res.status(403).json({ success: false, error: 'Super admin access required.' });
  }
  next();
};

/**
 * Require admin role OR the user is editing their own profile
 * Used for profile updates where admins can edit themselves
 */
const requireAdminOrSelf = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }
  
  const targetUserId = req.params.id || req.body.user_id;
  
  // Allow if user is admin/super_admin OR they are editing their own profile
  if (req.user.role === roles.ADMIN || req.user.role === roles.SUPER_ADMIN) {
    return next();
  }
  
  if (targetUserId && req.user._id.toString() === targetUserId) {
    return next();
  }
  
  return res.status(403).json({ success: false, error: 'You can only edit your own profile.' });
};

module.exports = { auth, requireAdmin, requireSuperAdmin, requireAdminOrSelf };
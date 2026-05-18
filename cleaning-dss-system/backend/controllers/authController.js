/**
 * authController.js
 * Handles user authentication and registration.
 * Updated to include organization field.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { success, error } = require('../utils/apiResponse');
const roles = require('../config/roles');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Register a new user
 * POST /api/v1/auth/register
 * Body: username, email, password, organization (optional)
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password, organization } = req.body;
    
    if (!username || !email || !password) {
      return error(res, 'Username, email and password are required', 400);
    }
    
    // Check if user already exists
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return error(res, 'Username or email already taken', 409);
    }
    
    const user = new User({
      username,
      email,
      password_hash: password,
      role: roles.USER,
      organization: organization || null
    });
    
    await user.save();
    
    const token = generateToken(user);
    
    return success(res, {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        organization: user.organization,
        created_at: user.created_at
      }
    }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Login user
 * POST /api/v1/auth/login
 * Body: username or email, password
 */
const login = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    const identifier = username || email;
    if (!identifier || !password) {
      return error(res, 'Username/email and password required', 400);
    }
    
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    }).select('+password_hash');
    
    if (!user) {
      return error(res, 'Invalid credentials', 401);
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return error(res, 'Invalid credentials', 401);
    }
    
    const token = generateToken(user);
    
    return success(res, {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        organization: user.organization,
        created_at: user.created_at
      }
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user profile
 * GET /api/v1/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    if (!user) {
      return error(res, 'User not found', 404);
    }
    return success(res, user, 'User profile retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Change password
 * PUT /api/v1/auth/change-password
 * Body: currentPassword, newPassword
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return error(res, 'Current and new password required', 400);
    }
    
    const user = await User.findById(req.user.id).select('+password_hash');
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return error(res, 'Current password is incorrect', 401);
    }
    
    user.password_hash = newPassword;
    await user.save();
    
    return success(res, null, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, changePassword };
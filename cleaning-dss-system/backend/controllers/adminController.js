/**
 * adminController.js
 * Administrative functions with role-based access control.
 */

const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const SystemMetric = require('../models/SystemMetric');
const TcoMultiplier = require('../models/TcoMultiplier');
const Training = require('../models/Training');
const RecommendationHistory = require('../models/RecommendationHistory');
const { importEquipment, importDetergents, importRules } = require('../services/dataImportService');
const { success, error } = require('../utils/apiResponse');
const { roles, hasPermission } = require('../config/roles');

// Models for export/import
const Equipment = require('../models/Equipment');
const Detergent = require('../models/Detergent');
const Rule = require('../models/Rule');
const fs = require('fs');

// ============================================
// USER MANAGEMENT (Role-Based)
// ============================================

/**
 * Get all users (with pagination and filters)
 * Only super_admin can see all users; admin sees only non-admin users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, is_active, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (is_active !== undefined) filter.is_active = is_active === 'true';
    
    // Admin cannot see super_admin or other admin accounts
    if (req.user.role === roles.ADMIN) {
      filter.role = { $ne: roles.SUPER_ADMIN };
      // Admin can only see standard users, not other admins
      filter.role = roles.STANDARD;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(filter).select('-password_hash').skip(skip).limit(parseInt(limit));
    const total = await User.countDocuments(filter);
    
    return success(res, { users, total, page: parseInt(page), limit: parseInt(limit) }, 'Users retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new user (role-based restrictions)
 * - Super admin can create any role
 * - Admin can only create standard users
 */
const createUser = async (req, res, next) => {
  try {
    const { username, email, password, role = roles.STANDARD, organization, is_active = true } = req.body;
    
    // Validate role permissions
    if (role === roles.SUPER_ADMIN && req.user.role !== roles.SUPER_ADMIN) {
      return error(res, 'Only super admin can create super admin accounts', 403);
    }
    
    if (role === roles.ADMIN && req.user.role !== roles.SUPER_ADMIN) {
      return error(res, 'Only super admin can create admin accounts', 403);
    }
    
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return error(res, 'Username or email already exists', 409);
    
    const user = new User({ 
      username, 
      email, 
      password_hash: password, 
      role, 
      organization,
      is_active,
      created_by: req.user.id 
    });
    await user.save();
    
    await AuditLog.create({
      adminId: req.user.id,
      action: 'CREATE_USER',
      targetType: 'User',
      targetId: user._id,
      details: { username, email, role },
      ipAddress: req.ip
    });
    
    return success(res, { id: user._id, username, email, role, organization, is_active }, 'User created successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update user (role-based restrictions)
 * - Super admin can update any user
 * - Admin can only update standard users
 * - Users can update themselves (handled in separate endpoint)
 */
const updateUser = async (req, res, next) => {
  try {
    const { role, is_active, username, email, organization, password } = req.body;
    const targetUser = await User.findById(req.params.id);
    
    if (!targetUser) return error(res, 'User not found', 404);
    
    // Permission checks
    if (req.user.role !== roles.SUPER_ADMIN) {
      // Non-super admin cannot modify super_admin accounts
      if (targetUser.role === roles.SUPER_ADMIN) {
        return error(res, 'Cannot modify super admin account', 403);
      }
      // Admin cannot modify other admin accounts
      if (targetUser.role === roles.ADMIN && req.user.role !== roles.SUPER_ADMIN) {
        return error(res, 'Only super admin can modify admin accounts', 403);
      }
      // Admin cannot promote users to admin
      if (role === roles.ADMIN && req.user.role !== roles.SUPER_ADMIN) {
        return error(res, 'Only super admin can create admin accounts', 403);
      }
    }
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (organization !== undefined) updateData.organization = organization;
    if (password) updateData.password_hash = password;
    if (role !== undefined && req.user.role === roles.SUPER_ADMIN) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password_hash');
    
    await AuditLog.create({
      adminId: req.user.id,
      action: 'UPDATE_USER',
      targetType: 'User',
      targetId: user._id,
      details: updateData,
      ipAddress: req.ip
    });
    
    return success(res, user, 'User updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete user (soft delete) - role-based
 * Only super admin can delete admin accounts
 */
const deleteUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return error(res, 'User not found', 404);
    
    // Permission checks
    if (req.user.role !== roles.SUPER_ADMIN) {
      if (targetUser.role === roles.ADMIN || targetUser.role === roles.SUPER_ADMIN) {
        return error(res, 'Only super admin can delete admin accounts', 403);
      }
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );
    
    await AuditLog.create({
      adminId: req.user.id,
      action: 'DELETE_USER',
      targetType: 'User',
      targetId: user._id,
      ipAddress: req.ip
    });
    
    return success(res, null, 'User deactivated');
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user's own profile
 */
const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    return success(res, user, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Update current user's own profile (name, password)
 */
const updateMyProfile = async (req, res, next) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password_hash');
    
    if (!user) return error(res, 'User not found', 404);
    
    // Update basic info
    if (username) user.username = username;
    if (email) user.email = email;
    
    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return error(res, 'Current password is incorrect', 401);
      }
      user.password_hash = newPassword;
    }
    
    await user.save();
    
    await AuditLog.create({
      adminId: req.user.id,
      action: 'UPDATE_OWN_PROFILE',
      targetType: 'User',
      targetId: user._id,
      ipAddress: req.ip
    });
    
    const userResponse = await User.findById(req.user.id).select('-password_hash');
    return success(res, userResponse, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

// ============================================
// EXISTING FUNCTIONS (unchanged, kept for reference)
// ============================================

const getSystemMetrics = async (req, res, next) => {
  try {
    const { date } = req.query;
    let query = {};
    if (date) query.date = new Date(date);
    else query.date = { $gte: new Date(new Date().setHours(0,0,0)) };
    const metrics = await SystemMetric.findOne(query);
    if (!metrics) return success(res, { message: 'No metrics for today yet' });
    return success(res, metrics, 'System metrics retrieved');
  } catch (err) {
    next(err);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const { adminId, action, limit = 50 } = req.query;
    const filter = {};
    if (adminId) filter.adminId = adminId;
    if (action) filter.action = action;
    const logs = await AuditLog.find(filter).sort({ timestamp: -1 }).limit(parseInt(limit)).populate('adminId', 'username');
    return success(res, logs, 'Audit logs retrieved');
  } catch (err) {
    next(err);
  }
};

const uploadEquipment = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);
    const format = req.body.format || 'csv';
    const result = await importEquipment(req.file.path, format);
    await AuditLog.create({
      adminId: req.user.id,
      action: 'BULK_UPLOAD_EQUIPMENT',
      details: { insertedCount: result.insertedCount, errors: result.errors.length },
      ipAddress: req.ip
    });
    return success(res, result, 'Equipment import completed');
  } catch (err) {
    next(err);
  }
};

const uploadDetergents = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);
    const format = req.body.format || 'csv';
    const result = await importDetergents(req.file.path, format);
    await AuditLog.create({
      adminId: req.user.id,
      action: 'BULK_UPLOAD_DETERGENTS',
      details: { insertedCount: result.insertedCount, errors: result.errors.length },
      ipAddress: req.ip
    });
    return success(res, result, 'Detergents import completed');
  } catch (err) {
    next(err);
  }
};

const uploadRules = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);
    const format = req.body.format || 'csv';
    const result = await importRules(req.file.path, format);
    await AuditLog.create({
      adminId: req.user.id,
      action: 'BULK_UPLOAD_RULES',
      details: { insertedCount: result.insertedCount, errors: result.errors.length },
      ipAddress: req.ip
    });
    const { loadRules } = require('../services/ruleLoader');
    await loadRules();
    return success(res, result, 'Rules import completed');
  } catch (err) {
    next(err);
  }
};

const getTcoMultipliers = async (req, res, next) => {
  try {
    const multipliers = await TcoMultiplier.findOne();
    if (!multipliers) return error(res, 'TCO multipliers not configured', 404);
    return success(res, multipliers, 'TCO multipliers retrieved');
  } catch (err) {
    next(err);
  }
};

const updateTcoMultipliers = async (req, res, next) => {
  try {
    const multipliers = await TcoMultiplier.findOneAndUpdate(
      {},
      { ...req.body, updated_by: req.user.id },
      { new: true, upsert: true }
    );
    await AuditLog.create({
      adminId: req.user.id,
      action: 'UPDATE_TCO_MULTIPLIERS',
      details: req.body,
      ipAddress: req.ip
    });
    return success(res, multipliers, 'TCO multipliers updated');
  } catch (err) {
    next(err);
  }
};

const exportDatabase = async (req, res, next) => {
  try {
    const equipment = await Equipment.find({});
    const detergents = await Detergent.find({});
    const rules = await Rule.find({});
    const users = await User.find({}).select('-password_hash');
    const tco = await TcoMultiplier.findOne();
    const exportData = { equipment, detergents, rules, users, tco };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=cleanmatch_backup.json');
    return res.send(JSON.stringify(exportData, null, 2));
  } catch (err) {
    next(err);
  }
};

const importDatabase = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No backup file uploaded', 400);
    const data = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));
    await Equipment.deleteMany({});
    await Detergent.deleteMany({});
    await Rule.deleteMany({});
    if (data.equipment) await Equipment.insertMany(data.equipment);
    if (data.detergents) await Detergent.insertMany(data.detergents);
    if (data.rules) await Rule.insertMany(data.rules);
    const { loadRules } = require('../services/ruleLoader');
    await loadRules();
    await AuditLog.create({ adminId: req.user.id, action: 'IMPORT_DATABASE', ipAddress: req.ip });
    return success(res, null, 'Database imported successfully');
  } catch (err) {
    next(err);
  }
};

// Training management functions (add as needed)
const getAllTrainings = async (req, res, next) => {
  try {
    const trainings = await Training.find();
    return success(res, trainings, 'Trainings retrieved');
  } catch (err) {
    next(err);
  }
};

const getRecommendationHistory = async (req, res, next) => {
  try {
    const history = await RecommendationHistory.find().sort({ timestamp: -1 }).limit(50);
    return success(res, history, 'History retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  // User management
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  // System
  getSystemMetrics,
  getAuditLogs,
  // Bulk upload
  uploadEquipment,
  uploadDetergents,
  uploadRules,
  // TCO
  getTcoMultipliers,
  updateTcoMultipliers,
  // Database
  exportDatabase,
  importDatabase,
  // Training & History
  getAllTrainings,
  getRecommendationHistory
};
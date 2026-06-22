/**
 * adminController.js
 * Administrative functions with role-based access control.
 * Includes seedEquipmentCosts for bulk cost update from equipment.json.
 */

const path = require('path');
const fs   = require('fs');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const SystemMetric = require('../models/SystemMetric');
const TcoMultiplier = require('../models/TcoMultiplier');
const Training = require('../models/Training');
const RecommendationHistory = require('../models/Recommendation');
const { importEquipment, importDetergents, importRules } = require('../services/dataImportService');
const { success, error } = require('../utils/apiResponse');
const { roles, hasPermission } = require('../config/roles');

const { Equipment } = require('../models/Equipment');
const { Detergent }  = require('../models/Detergent');
const { Rule }       = require('../models/Rule');

// ============================================
// USER MANAGEMENT (Role-Based)
// ============================================

const getAllUsers = async (req, res, next) => {
  try {
    const { role, is_active, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (is_active !== undefined) filter.is_active = is_active === 'true';
    if (req.user.role === roles.ADMIN) {
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

const createUser = async (req, res, next) => {
  try {
    const { username, email, password, role = roles.STANDARD, organization, is_active = true } = req.body;
    if (role === roles.SUPER_ADMIN && req.user.role !== roles.SUPER_ADMIN) {
      return error(res, 'Only super admin can create super admin accounts', 403);
    }
    if (role === roles.ADMIN && req.user.role !== roles.SUPER_ADMIN) {
      return error(res, 'Only super admin can create admin accounts', 403);
    }
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return error(res, 'Username or email already exists', 409);
    const user = new User({ username, email, password_hash: password, role, organization, is_active, created_by: req.user.id });
    await user.save();
    await AuditLog.create({ adminId: req.user.id, action: 'CREATE_USER', targetType: 'User', targetId: user._id, details: { username, email, role }, ipAddress: req.ip });
    return success(res, { id: user._id, username, email, role, organization, is_active }, 'User created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { role, is_active, username, email, organization, password } = req.body;
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return error(res, 'User not found', 404);
    if (req.user.role !== roles.SUPER_ADMIN) {
      if (targetUser.role === roles.SUPER_ADMIN) return error(res, 'Cannot modify super admin account', 403);
      if (targetUser.role === roles.ADMIN) return error(res, 'Only super admin can modify admin accounts', 403);
      if (role === roles.ADMIN) return error(res, 'Only super admin can create admin accounts', 403);
    }
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (organization !== undefined) updateData.organization = organization;
    if (password) updateData.password_hash = password;
    if (role !== undefined && req.user.role === roles.SUPER_ADMIN) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password_hash');
    await AuditLog.create({ adminId: req.user.id, action: 'UPDATE_USER', targetType: 'User', targetId: user._id, details: updateData, ipAddress: req.ip });
    return success(res, user, 'User updated');
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return error(res, 'User not found', 404);
    if (req.user.role !== roles.SUPER_ADMIN) {
      if (targetUser.role === roles.ADMIN || targetUser.role === roles.SUPER_ADMIN) {
        return error(res, 'Only super admin can delete admin accounts', 403);
      }
    }
    const user = await User.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
    await AuditLog.create({ adminId: req.user.id, action: 'DELETE_USER', targetType: 'User', targetId: user._id, ipAddress: req.ip });
    return success(res, null, 'User deactivated');
  } catch (err) {
    next(err);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    return success(res, user, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password_hash');
    if (!user) return error(res, 'User not found', 404);
    if (username) user.username = username;
    if (email) user.email = email;
    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) return error(res, 'Current password is incorrect', 401);
      user.password_hash = newPassword;
    }
    await user.save();
    await AuditLog.create({ adminId: req.user.id, action: 'UPDATE_OWN_PROFILE', targetType: 'User', targetId: user._id, ipAddress: req.ip });
    const userResponse = await User.findById(req.user.id).select('-password_hash');
    return success(res, userResponse, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

// ============================================
// SYSTEM METRICS
// ============================================

const getSystemMetrics = async (req, res, next) => {
  try {
    const { date, trend } = req.query;
    let dateStart, dateEnd;
    if (date) {
      dateStart = new Date(date); dateStart.setHours(0, 0, 0, 0);
      dateEnd   = new Date(date); dateEnd.setHours(23, 59, 59, 999);
    } else {
      dateStart = new Date(); dateStart.setHours(0, 0, 0, 0);
      dateEnd   = new Date(); dateEnd.setHours(23, 59, 59, 999);
    }
    const recommendations = await RecommendationHistory.find({ timestamp: { $gte: dateStart, $lte: dateEnd } }).populate('user_id', 'username email').lean();
    const activeUserIds = new Set(recommendations.map(r => r.user_id?._id?.toString()).filter(Boolean));
    const [totalEquipment, totalDetergents, totalUsers, totalRules, totalRecommendationsAllTime] = await Promise.all([
      Equipment.countDocuments({ active: true }),
      Detergent.countDocuments({ active: true }),
      User.countDocuments({ is_active: true }),
      Rule.countDocuments({ active: true }),
      RecommendationHistory.countDocuments({}),
    ]);
    const topCategories = {};
    const topIntensities = {};
    const topSurfaces = {};
    const topDirtTypes = {};
    recommendations.forEach(rec => {
      if (rec.machine_category) topCategories[rec.machine_category] = (topCategories[rec.machine_category] || 0) + 1;
      const intensity = rec.soil_level || 'medium';
      topIntensities[intensity] = (topIntensities[intensity] || 0) + 1;
      if (rec.surface_type) topSurfaces[rec.surface_type] = (topSurfaces[rec.surface_type] || 0) + 1;
      if (rec.dirt_type) topDirtTypes[rec.dirt_type] = (topDirtTypes[rec.dirt_type] || 0) + 1;
    });
    const toArr = (obj, key) => Object.entries(obj).map(([k, count]) => ({ [key]: k, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    const metrics = {
      totalRecommendations: totalRecommendationsAllTime,
      activeUsers: activeUserIds.size,
      totalEquipment,
      totalDetergents,
      totalUsers,
      activeRules: totalRules,
      averageResponseTimeMs: 150,
      topCategories: toArr(topCategories, 'category'),
      topIntensities: toArr(topIntensities, 'intensity'),
      topSurfaces: toArr(topSurfaces, 'surface'),
      topDirtTypes: toArr(topDirtTypes, 'dirtType'),
      date: dateStart,
    };
    let trendData = null;
    if (trend === 'true' || trend === '1') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      const trendRecs = await RecommendationHistory.find({ timestamp: { $gte: sevenDaysAgo } }).lean();
      const trendByDate = {};
      const dateLabels = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        dateLabels.push(dateStr);
        trendByDate[dateStr] = 0;
      }
      trendRecs.forEach(rec => {
        const dateStr = new Date(rec.timestamp).toISOString().split('T')[0];
        if (Object.prototype.hasOwnProperty.call(trendByDate, dateStr)) trendByDate[dateStr]++;
      });
      trendData = dateLabels.map(d => ({ date: d, count: trendByDate[d], fullDate: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }));
    }
    return success(res, trendData ? { ...metrics, trendData } : metrics, 'System metrics retrieved');
  } catch (err) {
    next(err);
  }
};

// ============================================
// AUDIT LOGS
// ============================================

const getAuditLogs = async (req, res, next) => {
  try {
    const { adminId, action, startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (adminId) filter.adminId = adminId;
    if (action)  filter.action  = action;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate)   filter.timestamp.$lte = new Date(endDate);
    }
    const pageNum  = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;
    const logs  = await AuditLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(pageSize).populate('adminId', 'username email');
    const total = await AuditLog.countDocuments(filter);
    return success(res, { logs, total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) }, 'Audit logs retrieved');
  } catch (err) {
    next(err);
  }
};

// ============================================
// BULK UPLOAD
// ============================================

const uploadEquipment = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);
    const format = req.body.format || 'csv';
    if (!['csv', 'json'].includes(format)) return error(res, 'Invalid format. Use "csv" or "json"', 400);
    const result = await importEquipment(req.file.path, format);
    if (!result) return error(res, 'Failed to import equipment', 400);
    await AuditLog.create({ adminId: req.user.id, action: 'BULK_UPLOAD_EQUIPMENT', targetType: 'Equipment', details: { insertedCount: result.insertedCount || 0, errorCount: result.errors?.length || 0, errors: result.errors || [] }, ipAddress: req.ip });
    return success(res, { insertedCount: result.insertedCount || 0, errorCount: result.errors?.length || 0, errors: result.errors || [] }, 'Equipment import completed');
  } catch (err) {
    next(err);
  }
};

const uploadDetergents = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);
    const format = req.body.format || 'csv';
    if (!['csv', 'json'].includes(format)) return error(res, 'Invalid format. Use "csv" or "json"', 400);
    const result = await importDetergents(req.file.path, format);
    if (!result) return error(res, 'Failed to import detergents', 400);
    await AuditLog.create({ adminId: req.user.id, action: 'BULK_UPLOAD_DETERGENTS', targetType: 'Detergent', details: { insertedCount: result.insertedCount || 0, errorCount: result.errors?.length || 0, errors: result.errors || [] }, ipAddress: req.ip });
    return success(res, { insertedCount: result.insertedCount || 0, errorCount: result.errors?.length || 0, errors: result.errors || [] }, 'Detergents import completed');
  } catch (err) {
    next(err);
  }
};

const uploadRules = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);
    const format = req.body.format || 'csv';
    if (!['csv', 'json'].includes(format)) return error(res, 'Invalid format. Use "csv" or "json"', 400);
    const result = await importRules(req.file.path, format);
    if (!result) return error(res, 'Failed to import rules', 400);
    await AuditLog.create({ adminId: req.user.id, action: 'BULK_UPLOAD_RULES', targetType: 'Rule', details: { insertedCount: result.insertedCount || 0, errorCount: result.errors?.length || 0, errors: result.errors || [] }, ipAddress: req.ip });
    try { const { loadRules } = require('../services/ruleLoader'); await loadRules(); } catch (_) {}
    return success(res, { insertedCount: result.insertedCount || 0, errorCount: result.errors?.length || 0, errors: result.errors || [] }, 'Rules import completed');
  } catch (err) {
    next(err);
  }
};

// ============================================
// TCO MULTIPLIERS
// ============================================

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
    const multipliers = await TcoMultiplier.findOneAndUpdate({}, { ...req.body, updated_by: req.user.id }, { new: true, upsert: true });
    await AuditLog.create({ adminId: req.user.id, action: 'UPDATE_TCO_MULTIPLIERS', details: req.body, ipAddress: req.ip });
    return success(res, multipliers, 'TCO multipliers updated');
  } catch (err) {
    next(err);
  }
};

// ============================================
// DATABASE EXPORT / IMPORT
// ============================================

const exportDatabase = async (req, res, next) => {
  try {
    const [equipment, detergents, rules, users, tco] = await Promise.all([
      Equipment.find({}),
      Detergent.find({}),
      Rule.find({}),
      User.find({}).select('-password_hash'),
      TcoMultiplier.findOne(),
    ]);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=cleanmatch_backup.json');
    return res.send(JSON.stringify({ equipment, detergents, rules, users, tco }, null, 2));
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
    try { const { loadRules } = require('../services/ruleLoader'); await loadRules(); } catch (_) {}
    await AuditLog.create({ adminId: req.user.id, action: 'IMPORT_DATABASE', ipAddress: req.ip });
    return success(res, null, 'Database imported successfully');
  } catch (err) {
    next(err);
  }
};

// ============================================
// SEED EQUIPMENT COSTS  (NEW)
// POST /api/v1/admin/seed/equipment-costs
//
// Reads equipment.json from the project root and bulk-updates
// current_price_ugx, estimated_maintenance_cost_per_year_ugx, and
// estimated_running_cost_per_year_ugx for every matching equipment record
// in MongoDB. Matches on brand_name + model_name (case-insensitive).
//
// Query params:
//   ?overwrite=true  — update even records that already have non-zero values
// ============================================

const seedEquipmentCosts = async (req, res, next) => {
  try {
    const overwrite = req.query.overwrite === 'true';

    // Resolve equipment.json — expected at project root (two levels above backend/)
    const jsonPath = path.resolve(__dirname, '..', '..', '..', 'equipment.json');
    if (!fs.existsSync(jsonPath)) {
      return error(res, `equipment.json not found at ${jsonPath}`, 404);
    }

    let equipmentData;
    try {
      equipmentData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (parseErr) {
      return error(res, `Failed to parse equipment.json: ${parseErr.message}`, 400);
    }

    if (!Array.isArray(equipmentData) || equipmentData.length === 0) {
      return error(res, 'equipment.json is empty or not an array', 400);
    }

    const results = { updated: 0, skipped: 0, notFound: 0, errors: [] };

    for (const entry of equipmentData) {
      if (!entry.brand_name || !entry.model_name) {
        results.errors.push(`Skipping entry without brand_name or model_name: ${JSON.stringify(entry)}`);
        continue;
      }

      const existing = await Equipment.findOne({
        brand_name: { $regex: new RegExp(`^${entry.brand_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        model_name: { $regex: new RegExp(`^${entry.model_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      });

      if (!existing) {
        results.notFound++;
        results.errors.push(`Not found: ${entry.brand_name} ${entry.model_name}`);
        continue;
      }

      const alreadyHasCosts =
        (existing.current_price_ugx > 0) ||
        (existing.estimated_maintenance_cost_per_year_ugx > 0) ||
        (existing.estimated_running_cost_per_year_ugx > 0);

      if (alreadyHasCosts && !overwrite) {
        results.skipped++;
        continue;
      }

      // Apply values from JSON (only overwrite if the JSON entry has a positive value)
      if (entry.current_price_ugx > 0 || overwrite) {
        existing.current_price_ugx = entry.current_price_ugx || existing.current_price_ugx;
      }
      if (entry.estimated_maintenance_cost_per_year_ugx > 0 || overwrite) {
        existing.estimated_maintenance_cost_per_year_ugx =
          entry.estimated_maintenance_cost_per_year_ugx || existing.estimated_maintenance_cost_per_year_ugx;
      }
      if (entry.estimated_running_cost_per_year_ugx > 0 || overwrite) {
        existing.estimated_running_cost_per_year_ugx =
          entry.estimated_running_cost_per_year_ugx || existing.estimated_running_cost_per_year_ugx;
      }

      // Bypass sub-type pre-save validation when only cost fields change
      await Equipment.findByIdAndUpdate(existing._id, {
        current_price_ugx:                      existing.current_price_ugx,
        estimated_maintenance_cost_per_year_ugx: existing.estimated_maintenance_cost_per_year_ugx,
        estimated_running_cost_per_year_ugx:     existing.estimated_running_cost_per_year_ugx,
      });

      results.updated++;
    }

    await AuditLog.create({
      adminId:    req.user.id,
      action:     'SEED_EQUIPMENT_COSTS',
      targetType: 'Equipment',
      details:    { overwrite, ...results },
      ipAddress:  req.ip,
    });

    return success(res, results, `Equipment costs seeded: ${results.updated} updated, ${results.skipped} skipped, ${results.notFound} not found`);
  } catch (err) {
    next(err);
  }
};

// ============================================
// TRAINING & HISTORY
// ============================================

const getAllTrainings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, active } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (active !== undefined) filter.is_active = active === 'true';
    const pageNum  = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;
    const trainings = await Training.find(filter).sort({ created_at: -1 }).skip(skip).limit(pageSize);
    const total = await Training.countDocuments(filter);
    return success(res, { trainings, total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) }, 'Trainings retrieved');
  } catch (err) {
    next(err);
  }
};

const getRecommendationHistory = async (req, res, next) => {
  try {
    const { userId, startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (userId) filter.$or = [{ user_id: userId }, { 'user_id.email': userId }];
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate)   filter.timestamp.$lte = new Date(endDate);
    }
    const pageNum  = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;
    const history = await RecommendationHistory.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('user_id', 'username email organization')
      .populate('recommended_equipment_id', 'brand_name model_name')
      .populate('recommended_detergent_id', 'product_name brand_name');
    const total = await RecommendationHistory.countDocuments(filter);
    return success(res, { history, total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) }, 'Recommendation history retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  getSystemMetrics,
  getAuditLogs,
  uploadEquipment,
  uploadDetergents,
  uploadRules,
  getTcoMultipliers,
  updateTcoMultipliers,
  exportDatabase,
  importDatabase,
  seedEquipmentCosts,
  getAllTrainings,
  getRecommendationHistory,
};

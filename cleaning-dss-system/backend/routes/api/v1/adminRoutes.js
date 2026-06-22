/**
 * Admin Routes
 * All routes require authentication and admin role.
 * Role-based restrictions applied within controllers.
 */

const express = require('express');
const multer  = require('multer');
const {
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
  exportDatabase,
  importDatabase,
  seedEquipmentCosts,
  getAllTrainings,
  getRecommendationHistory,
} = require('../../../controllers/adminController');
const { auth, requireAdmin, requireSuperAdmin } = require('../../../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(auth);

// ============================================
// USER PROFILE (Self)
// ============================================
router.get('/me',  getMyProfile);
router.put('/me',  updateMyProfile);

// ============================================
// USER MANAGEMENT (Admin only)
// ============================================
router.get('/users',       requireAdmin,       getAllUsers);
router.post('/users',      requireSuperAdmin,  createUser);
router.put('/users/:id',   requireSuperAdmin,  updateUser);
router.delete('/users/:id',requireSuperAdmin,  deleteUser);

// ============================================
// SYSTEM MONITORING
// ============================================
router.get('/metrics', requireAdmin, getSystemMetrics);
router.get('/audit',   requireAdmin, getAuditLogs);

// ============================================
// BULK DATA UPLOAD
// ============================================
router.post('/upload/equipment',  requireAdmin, upload.single('file'), uploadEquipment);
router.post('/upload/detergents', requireAdmin, upload.single('file'), uploadDetergents);
router.post('/upload/rules',      requireAdmin, upload.single('file'), uploadRules);

// ============================================
// SEED EQUIPMENT COSTS  (NEW)
// POST /api/v1/admin/seed/equipment-costs
// Optional query param: ?overwrite=true
// ============================================
router.post('/seed/equipment-costs', requireAdmin, seedEquipmentCosts);

// ============================================
// DATABASE EXPORT / IMPORT
// ============================================
router.get('/export',  requireAdmin, exportDatabase);
router.post('/import', requireAdmin, upload.single('file'), importDatabase);

// ============================================
// TRAINING & HISTORY
// ============================================
router.get('/trainings', requireAdmin, getAllTrainings);
router.get('/history',   requireAdmin, getRecommendationHistory);

module.exports = router;

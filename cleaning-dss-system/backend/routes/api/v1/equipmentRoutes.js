/**
 * Equipment Routes
 * GET /api/v1/equipment - List equipment (with filters)
 * GET /api/v1/equipment/categories - Get distinct machine categories
 * GET /api/v1/equipment/subtypes - Get valid sub-types for brand+category
 * GET /api/v1/equipment/category/:category - Get equipment by category with specs
 * GET /api/v1/equipment/:id - Get single equipment with specs
 * POST /api/v1/equipment - Create new equipment (admin)
 * PUT /api/v1/equipment/:id - Update equipment (admin)
 * DELETE /api/v1/equipment/:id - Delete equipment (admin)
 * 
 * Image routes:
 * POST /api/v1/equipment/:id/image - Upload image file (admin)
 * PUT /api/v1/equipment/:id/image-url - Update image URL (admin)
 * DELETE /api/v1/equipment/:id/image - Remove image (admin)
 */

const express = require('express');
const {
  getAllEquipment,
  getEquipmentById,
  getMachineCategories,
  getValidSubtypesApi,
  getEquipmentByCategory,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  uploadEquipmentImage,
  updateEquipmentImageUrl,
  deleteEquipmentImage
} = require('../../../controllers/equipmentController');
const { auth, requireAdmin } = require('../../../middleware/auth');
const { uploadEquipmentImage: uploadImageMiddleware } = require('../../../middleware/multer');
const { cacheMiddleware, cacheConfigs, invalidateCache } = require('../../../middleware/cache');

const router = express.Router();

// ============================================
// PUBLIC READ ROUTES (with caching)
// ============================================
router.get('/', cacheMiddleware(cacheConfigs.lists), getAllEquipment);
router.get('/categories', cacheMiddleware(cacheConfigs.static), getMachineCategories);
router.get('/subtypes', cacheMiddleware(cacheConfigs.lists), getValidSubtypesApi);  // NEW: Get valid sub-types for brand+category
router.get('/category/:category', cacheMiddleware(cacheConfigs.lists), getEquipmentByCategory);
router.get('/:id', cacheMiddleware(cacheConfigs.lists), getEquipmentById);

// ============================================
// ADMIN WRITE ROUTES
// ============================================
router.post('/', auth, requireAdmin, createEquipment);
router.put('/:id', auth, requireAdmin, updateEquipment);
router.delete('/:id', auth, requireAdmin, deleteEquipment);

// ============================================
// IMAGE ROUTES (ADMIN ONLY)
// ============================================
router.post('/:id/image', auth, requireAdmin, uploadImageMiddleware, uploadEquipmentImage);
router.put('/:id/image-url', auth, requireAdmin, updateEquipmentImageUrl);
router.delete('/:id/image', auth, requireAdmin, deleteEquipmentImage);

module.exports = router;
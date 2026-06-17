/**
 * Equipment Specs Routes
 * GET /api/v1/equipment-specs/equipment/:equipmentId - Get specs for equipment
 * GET /api/v1/equipment-specs/category/:category - Get specs by machine category
 * GET /api/v1/equipment-specs/attributes - Get common attribute names
 * POST /api/v1/equipment-specs - Create new spec (admin)
 * PUT /api/v1/equipment-specs/:id - Update spec (admin)
 * DELETE /api/v1/equipment-specs/:id - Delete spec (admin)
 */

const express = require('express');
const {
  getSpecsByEquipment,
  getSpecsByCategory,
  getCommonAttributes,
  createSpec,
  updateSpec,
  deleteSpec
} = require('../../../controllers/equipmentSpecsController');
const { auth, requireAdmin } = require('../../../middleware/auth');
const { cacheMiddleware, cacheConfigs } = require('../../../middleware/cache');

const router = express.Router();

// Public read routes (with caching)
router.get('/equipment/:equipmentId', cacheMiddleware(cacheConfigs.lists), getSpecsByEquipment);
router.get('/category/:category', cacheMiddleware(cacheConfigs.lists), getSpecsByCategory);
router.get('/attributes', cacheMiddleware(cacheConfigs.static), getCommonAttributes);

// Admin write routes
router.post('/', auth, requireAdmin, createSpec);
router.put('/:id', auth, requireAdmin, updateSpec);
router.delete('/:id', auth, requireAdmin, deleteSpec);

module.exports = router;
/**
 * Compatibility Routes
 * GET /api/v1/compatibility - List all compatibility records
 * GET /api/v1/compatibility/equipment/:equipmentId/detergents - Get compatible detergents for equipment
 * GET /api/v1/compatibility/detergent/:detergentId/equipment - Get compatible equipment for detergent
 * GET /api/v1/compatibility/check - Check if equipment-detergent pair is compatible
 * POST /api/v1/compatibility - Create compatibility record (admin)
 * PUT /api/v1/compatibility/:id - Update compatibility record (admin)
 * DELETE /api/v1/compatibility/:id - Delete compatibility record (admin)
 */

const express = require('express');
const {
  getAllCompatibilities,
  getCompatibleDetergents,
  getCompatibleEquipment,
  checkCompatibility,
  createCompatibility,
  updateCompatibility,
  deleteCompatibility
} = require('../../../controllers/compatibilityController');
const { auth, requireAdmin } = require('../../../middleware/auth');

const router = express.Router();

// Public read routes
router.get('/', getAllCompatibilities);
router.get('/equipment/:equipmentId/detergents', getCompatibleDetergents);
router.get('/detergent/:detergentId/equipment', getCompatibleEquipment);
router.get('/check', checkCompatibility);

// Admin write routes
router.post('/', auth, requireAdmin, createCompatibility);
router.put('/:id', auth, requireAdmin, updateCompatibility);
router.delete('/:id', auth, requireAdmin, deleteCompatibility);

module.exports = router;
/**
 * Detergent Routes
 * GET /api/v1/detergents - List detergents (with filters)
 * GET /api/v1/detergents/ph-range - Get detergents by pH range
 * GET /api/v1/detergents/category/:category - Get detergents by category
 * GET /api/v1/detergents/:id - Get single detergent
 * POST /api/v1/detergents - Create new detergent (admin)
 * PUT /api/v1/detergents/:id - Update detergent (admin)
 * DELETE /api/v1/detergents/:id - Delete detergent (admin)
 * 
 * Image routes:
 * POST /api/v1/detergents/:id/image - Upload image file (admin)
 * PUT /api/v1/detergents/:id/image-url - Update image URL (admin)
 * DELETE /api/v1/detergents/:id/image - Remove image (admin)
 */

const express = require('express');
const {
  getAllDetergents,
  getDetergentById,
  getDetergentsByPhRange,
  getDetergentsByCategory,
  createDetergent,
  updateDetergent,
  deleteDetergent,
  uploadDetergentImage,
  updateDetergentImageUrl,
  deleteDetergentImage
} = require('../../../controllers/detergentController');
const { auth, requireAdmin } = require('../../../middleware/auth');
const { uploadDetergentImage: uploadImageMiddleware } = require('../../../middleware/multer');

const router = express.Router();

// ============================================
// PUBLIC READ ROUTES
// ============================================
router.get('/', getAllDetergents);
router.get('/ph-range', getDetergentsByPhRange);
router.get('/category/:category', getDetergentsByCategory);
router.get('/:id', getDetergentById);

// ============================================
// ADMIN WRITE ROUTES
// ============================================
router.post('/', auth, requireAdmin, createDetergent);
router.put('/:id', auth, requireAdmin, updateDetergent);
router.delete('/:id', auth, requireAdmin, deleteDetergent);

// ============================================
// IMAGE ROUTES (ADMIN ONLY)
// ============================================
// Upload image file
router.post('/:id/image', auth, requireAdmin, uploadImageMiddleware, uploadDetergentImage);

// Update image URL directly (no file upload)
router.put('/:id/image-url', auth, requireAdmin, updateDetergentImageUrl);

// Remove image
router.delete('/:id/image', auth, requireAdmin, deleteDetergentImage);

module.exports = router;
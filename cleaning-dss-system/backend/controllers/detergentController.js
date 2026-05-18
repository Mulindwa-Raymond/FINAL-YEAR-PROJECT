/**
 * detergentController.js
 * Manages cleaning detergents with KB-DSS fields and image support.
 */

const Detergent = require('../models/Detergent');
const { success, error } = require('../utils/apiResponse');

/**
 * Get all detergents with optional filters
 * GET /api/v1/detergents
 */
const getAllDetergents = async (req, res, next) => {
  try {
    const { detergent_category, form, min_ph, max_ph, requires_ppe } = req.query;
    const filter = {};
    
    if (detergent_category) filter.detergent_category = detergent_category;
    if (form) filter.form = form;
    if (requires_ppe) filter.requires_ppe = requires_ppe === 'true';
    
    if (min_ph || max_ph) {
      filter.ph_value = {};
      if (min_ph) filter.ph_value.$gte = parseFloat(min_ph);
      if (max_ph) filter.ph_value.$lte = parseFloat(max_ph);
    }
    
    const detergents = await Detergent.find(filter);
    return success(res, detergents, 'Detergents retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get single detergent by ID
 * GET /api/v1/detergents/:id
 */
const getDetergentById = async (req, res, next) => {
  try {
    const detergent = await Detergent.findById(req.params.id);
    if (!detergent) {
      return error(res, 'Detergent not found', 404);
    }
    return success(res, detergent, 'Detergent retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get detergents by pH range
 * GET /api/v1/detergents/ph-range?min=6&max=8
 */
const getDetergentsByPhRange = async (req, res, next) => {
  try {
    const { min = 0, max = 14 } = req.query;
    
    const detergents = await Detergent.find({
      ph_value: { $gte: parseFloat(min), $lte: parseFloat(max) }
    });
    
    return success(res, detergents, 'Detergents by pH range retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get detergents by category
 * GET /api/v1/detergents/category/:category
 */
const getDetergentsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const detergents = await Detergent.find({ detergent_category: category });
    return success(res, detergents, 'Detergents by category retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Create new detergent (admin only)
 * POST /api/v1/detergents
 */
const createDetergent = async (req, res, next) => {
  try {
    const detergent = new Detergent(req.body);
    await detergent.save();
    return success(res, detergent, 'Detergent created', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update detergent (admin only)
 * PUT /api/v1/detergents/:id
 */
const updateDetergent = async (req, res, next) => {
  try {
    const detergent = await Detergent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!detergent) {
      return error(res, 'Detergent not found', 404);
    }
    
    return success(res, detergent, 'Detergent updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete detergent (admin only)
 * DELETE /api/v1/detergents/:id
 */
const deleteDetergent = async (req, res, next) => {
  try {
    const detergent = await Detergent.findByIdAndDelete(req.params.id);
    if (!detergent) {
      return error(res, 'Detergent not found', 404);
    }
    return success(res, null, 'Detergent deleted');
  } catch (err) {
    next(err);
  }
};

// ============================================
// IMAGE MANAGEMENT
// ============================================

/**
 * Upload image for detergent (file upload)
 * POST /api/v1/detergents/:id/image
 */
const uploadDetergentImage = async (req, res, next) => {
  try {
    const detergent = await Detergent.findById(req.params.id);
    if (!detergent) {
      return error(res, 'Detergent not found', 404);
    }
    
    if (!req.file) {
      return error(res, 'No image file uploaded', 400);
    }
    
    // Generate URL for the uploaded image
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/detergents/${req.file.filename}`;
    
    detergent.image_url = imageUrl;
    await detergent.save();
    
    return success(res, { 
      image_url: detergent.image_url,
      message: 'Image uploaded successfully'
    }, 'Image uploaded');
  } catch (err) {
    next(err);
  }
};

/**
 * Update detergent image URL (without file upload)
 * PUT /api/v1/detergents/:id/image-url
 * Body: { image_url: "https://example.com/image.jpg" }
 */
const updateDetergentImageUrl = async (req, res, next) => {
  try {
    const { image_url } = req.body;
    
    if (!image_url) {
      return error(res, 'Image URL is required', 400);
    }
    
    const detergent = await Detergent.findByIdAndUpdate(
      req.params.id,
      { image_url },
      { new: true, runValidators: true }
    );
    
    if (!detergent) {
      return error(res, 'Detergent not found', 404);
    }
    
    return success(res, { image_url: detergent.image_url }, 'Image URL updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete detergent image (remove image_url)
 * DELETE /api/v1/detergents/:id/image
 */
const deleteDetergentImage = async (req, res, next) => {
  try {
    const detergent = await Detergent.findById(req.params.id);
    if (!detergent) {
      return error(res, 'Detergent not found', 404);
    }
    
    detergent.image_url = null;
    await detergent.save();
    
    return success(res, null, 'Image removed');
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};
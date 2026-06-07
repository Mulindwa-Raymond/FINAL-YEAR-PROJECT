/**
 * detergentController.js
 * Manages cleaning detergents with KB-DSS fields and image support.
 */

const { Detergent } = require('../models/Detergent');
const { success, error } = require('../utils/apiResponse');
const AuditLog = require('../models/AuditLog');

// ============================================
// PUBLIC READ ROUTES
// ============================================

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

const getDetergentById = async (req, res, next) => {
  try {
    const detergent = await Detergent.findById(req.params.id);
    if (!detergent) return error(res, 'Detergent not found', 404);
    return success(res, detergent, 'Detergent retrieved');
  } catch (err) {
    next(err);
  }
};

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

const getDetergentsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const detergents = await Detergent.find({ detergent_category: category });
    return success(res, detergents, 'Detergents by category retrieved');
  } catch (err) {
    next(err);
  }
};

// ============================================
// ADMIN WRITE ROUTES
// ============================================

const createDetergent = async (req, res, next) => {
  try {
    console.log('[DetergentController] Creating detergent with data:', req.body);
    
    const detergent = new Detergent(req.body);
    await detergent.save();
    
    // Log audit event
    if (req.user?.id) {
      await AuditLog.create({
        adminId: req.user.id,
        action: 'CREATE_DETERGENT',
        targetType: 'Detergent',
        targetId: detergent._id,
        details: { product_name: req.body.product_name, detergent_category: req.body.detergent_category },
        ipAddress: req.ip
      }).catch(err => console.warn('Audit log failed:', err));
    }
    
    console.log('[DetergentController] ✅ Detergent created successfully:', detergent._id);
    return success(res, detergent, 'Detergent created', 201);
  } catch (err) {
    console.error('[DetergentController] ❌ Create error:', err.message);
    console.error('[DetergentController] Error details:', err);
    next(err);
  }
};

const updateDetergent = async (req, res, next) => {
  try {
    console.log('[DetergentController] Updating detergent ID:', req.params.id);
    console.log('[DetergentController] Update data:', req.body);
    
    const detergent = await Detergent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!detergent) return error(res, 'Detergent not found', 404);
    
    // Log audit event
    if (req.user?.id) {
      await AuditLog.create({
        adminId: req.user.id,
        action: 'UPDATE_DETERGENT',
        targetType: 'Detergent',
        targetId: detergent._id,
        details: req.body,
        ipAddress: req.ip
      }).catch(err => console.warn('Audit log failed:', err));
    }
    
    console.log('[DetergentController] ✅ Detergent updated successfully:', req.params.id);
    return success(res, detergent, 'Detergent updated');
  } catch (err) {
    console.error('[DetergentController] ❌ Update error:', err.message);
    console.error('[DetergentController] Error details:', err);
    next(err);
  }
};

const deleteDetergent = async (req, res, next) => {
  try {
    const detergent = await Detergent.findByIdAndDelete(req.params.id);
    if (!detergent) return error(res, 'Detergent not found', 404);
    
    // Log audit event
    if (req.user?.id) {
      await AuditLog.create({
        adminId: req.user.id,
        action: 'DELETE_DETERGENT',
        targetType: 'Detergent',
        targetId: detergent._id,
        details: { product_name: detergent.product_name },
        ipAddress: req.ip
      }).catch(err => console.warn('Audit log failed:', err));
    }
    
    return success(res, null, 'Detergent deleted');
  } catch (err) {
    next(err);
  }
};

// ============================================
// IMAGE MANAGEMENT
// ============================================

const uploadDetergentImage = async (req, res, next) => {
  try {
    const detergent = await Detergent.findById(req.params.id);
    if (!detergent) return error(res, 'Detergent not found', 404);
    if (!req.file) return error(res, 'No image file uploaded', 400);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/detergents/${req.file.filename}`;
    detergent.image_url = imageUrl;
    await detergent.save();
    return success(res, { image_url: detergent.image_url }, 'Image uploaded');
  } catch (err) {
    next(err);
  }
};

const updateDetergentImageUrl = async (req, res, next) => {
  try {
    const { image_url } = req.body;
    if (!image_url) return error(res, 'Image URL is required', 400);
    const detergent = await Detergent.findByIdAndUpdate(
      req.params.id,
      { image_url },
      { new: true, runValidators: true }
    );
    if (!detergent) return error(res, 'Detergent not found', 404);
    return success(res, { image_url: detergent.image_url }, 'Image URL updated');
  } catch (err) {
    next(err);
  }
};

const deleteDetergentImage = async (req, res, next) => {
  try {
    const detergent = await Detergent.findById(req.params.id);
    if (!detergent) return error(res, 'Detergent not found', 404);
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
  deleteDetergentImage,
};
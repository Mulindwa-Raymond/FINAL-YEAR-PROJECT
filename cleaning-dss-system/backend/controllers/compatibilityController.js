
/**
 * compatibilityController.js
 * Manages equipment-detergent compatibility junction table.
 */

const Compatibility = require('../models/EquipmentDetergentCompatibilty');
const { Equipment } = require('../models/Equipment');
const { Detergent } = require('../models/Detergent');
const { success, error } = require('../utils/apiResponse');

/**
 * Get all compatibility records
 * GET /api/v1/compatibility
 */
const getAllCompatibilities = async (req, res, next) => {
  try {
    const { equipment_id, detergent_id, is_recommended } = req.query;
    const filter = {};
    
    if (equipment_id) filter.equipment_id = equipment_id;
    if (detergent_id) filter.detergent_id = detergent_id;
    if (is_recommended !== undefined) filter.is_recommended = is_recommended === 'true';
    
    const compatibilities = await Compatibility.find(filter)
      .populate('equipment_id', 'brand_name model_name')
      .populate('detergent_id', 'product_name brand_name');
    
    return success(res, compatibilities, 'Compatibility records retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get compatible detergents for a specific equipment
 * GET /api/v1/compatibility/equipment/:equipmentId/detergents
 */
const getCompatibleDetergents = async (req, res, next) => {
  try {
    const { equipmentId } = req.params;
    
    const compatibilities = await Compatibility.find({ equipment_id: equipmentId })
      .populate('detergent_id');
    
    const detergents = compatibilities.map(c => ({
      detergent: c.detergent_id,
      compatibility_notes: c.compatibility_notes,
      is_recommended: c.is_recommended
    }));
    
    return success(res, detergents, 'Compatible detergents retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get compatible equipment for a specific detergent
 * GET /api/v1/compatibility/detergent/:detergentId/equipment
 */
const getCompatibleEquipment = async (req, res, next) => {
  try {
    const { detergentId } = req.params;
    
    const compatibilities = await Compatibility.find({ detergent_id: detergentId })
      .populate('equipment_id');
    
    const equipment = compatibilities.map(c => ({
      equipment: c.equipment_id,
      compatibility_notes: c.compatibility_notes,
      is_recommended: c.is_recommended
    }));
    
    return success(res, equipment, 'Compatible equipment retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Check if a specific equipment-detergent pair is compatible
 * GET /api/v1/compatibility/check?equipment_id=xxx&detergent_id=yyy
 */
const checkCompatibility = async (req, res, next) => {
  try {
    const { equipment_id, detergent_id } = req.query;
    
    if (!equipment_id || !detergent_id) {
      return error(res, 'Both equipment_id and detergent_id are required', 400);
    }
    
    const compatibility = await Compatibility.findOne({ equipment_id, detergent_id });
    
    if (!compatibility) {
      return success(res, {
        compatible: false,
        is_recommended: false,
        message: 'This equipment-detergent combination is not recommended'
      }, 'Compatibility check completed');
    }
    
    return success(res, {
      compatible: true,
      is_recommended: compatibility.is_recommended,
      notes: compatibility.compatibility_notes
    }, 'Compatibility check completed');
  } catch (err) {
    next(err);
  }
};

/**
 * Create new compatibility record (admin only)
 * POST /api/v1/compatibility
 */
const createCompatibility = async (req, res, next) => {
  try {
    const { equipment_id, detergent_id, compatibility_notes, is_recommended } = req.body;
    
    // Check if equipment exists
    const equipment = await Equipment.findById(equipment_id);
    if (!equipment) {
      return error(res, 'Equipment not found', 404);
    }
    
    // Check if detergent exists
    const detergent = await Detergent.findById(detergent_id);
    if (!detergent) {
      return error(res, 'Detergent not found', 404);
    }
    
    // Check for duplicate
    const existing = await Compatibility.findOne({ equipment_id, detergent_id });
    if (existing) {
      return error(res, 'Compatibility record already exists', 409);
    }
    
    const compatibility = new Compatibility({
      equipment_id,
      detergent_id,
      compatibility_notes,
      is_recommended: is_recommended !== false
    });
    
    await compatibility.save();
    
    return success(res, compatibility, 'Compatibility record created', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update compatibility record (admin only)
 * PUT /api/v1/compatibility/:id
 */
const updateCompatibility = async (req, res, next) => {
  try {
    const compatibility = await Compatibility.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!compatibility) {
      return error(res, 'Compatibility record not found', 404);
    }
    
    return success(res, compatibility, 'Compatibility record updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete compatibility record (admin only)
 * DELETE /api/v1/compatibility/:id
 */
const deleteCompatibility = async (req, res, next) => {
  try {
    const compatibility = await Compatibility.findByIdAndDelete(req.params.id);
    if (!compatibility) {
      return error(res, 'Compatibility record not found', 404);
    }
    return success(res, null, 'Compatibility record deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCompatibilities,
  getCompatibleDetergents,
  getCompatibleEquipment,
  checkCompatibility,
  createCompatibility,
  updateCompatibility,
  deleteCompatibility
};
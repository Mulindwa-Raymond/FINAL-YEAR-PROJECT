/**
 * equipmentController.js
 * Manages cleaning equipment (machines) with KB-DSS fields and image support.
 * Updated to handle machine_subtype, intensity classification, and new filtering fields.
 */

const { Equipment } = require('../models/Equipment');
const EquipmentSpecs = require('../models/EquipmentSpecs');
const { success, error } = require('../utils/apiResponse');
const { computeTCO } = require('../services/tcoCalculator');
const AuditLog = require('../models/AuditLog');
const { invalidateEquipmentCache } = require('../utils/cacheInvalidation');

// Helper to get valid sub-types for a brand and category
const getValidSubtypes = (brand, category) => {
  const { getValidSubtypes } = require('../utils/constants');
  return getValidSubtypes(brand, category);
};

// Helper to attach TCO to equipment (for list views)
const attachTCOToEquipment = async (equipmentArray) => {
  return Promise.all(equipmentArray.map(async (eq) => {
    try {
      const equipmentObj = eq.toJSON ? eq.toJSON() : eq;
      // Use virtual field from schema if all cost fields are present
      if (eq.current_price_ugx !== undefined) {
        equipmentObj.estimated_tco_per_year_ugx = eq.estimated_tco_per_year_ugx;
      }
      return equipmentObj;
    } catch (err) {
      console.error(`Error calculating TCO for equipment ${eq._id}:`, err);
      return eq.toJSON ? eq.toJSON() : eq;
    }
  }));
};

// ============================================
// PUBLIC READ ROUTES
// ============================================

/**
 * Get all equipment with optional filters
 * GET /api/v1/equipment
 */
const getAllEquipment = async (req, res, next) => {
  try {
    const { 
      machine_category, 
      machine_subtype,
      intensity,
      domain,
      environment,
      min_aisle_width_mm,
      max_noise_level_db,
      power_source, 
      brand_name, 
      min_price, 
      max_price,
      in_stock,
      active,
      search,
      page = 1,
      limit = 20
    } = req.query;
    
    const filter = {};
    
    if (machine_category) filter.machine_category = machine_category;
    if (machine_subtype) filter.machine_subtype = machine_subtype;
    if (intensity) filter.intensity = intensity;
    if (domain) filter.domain = domain;
    if (environment) filter.environment = environment;
    if (power_source) filter.power_source = power_source;
    if (in_stock !== undefined) filter.in_stock = in_stock === 'true';
    if (active !== undefined) filter.active = active === 'true';
    
    // Numeric filters
    if (min_aisle_width_mm) filter.min_aisle_width_mm = { $lte: parseInt(min_aisle_width_mm) };
    if (min_price || max_price) {
      filter.current_price_ugx = {};
      if (min_price) filter.current_price_ugx.$gte = parseInt(min_price);
      if (max_price) filter.current_price_ugx.$lte = parseInt(max_price);
    }
    
    // Multi-field text search across brand_name and model_name
    if (search) {
      filter.$or = [
        { brand_name: { $regex: search, $options: 'i' } },
        { model_name: { $regex: search, $options: 'i' } },
        { machine_category: { $regex: search, $options: 'i' } },
        { machine_subtype: { $regex: search, $options: 'i' } },
      ];
    } else if (brand_name) {
      filter.brand_name = { $regex: brand_name, $options: 'i' };
    }
    
    // Server-side pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;
    
    const [equipment, total] = await Promise.all([
      Equipment.find(filter).skip(skip).limit(limitNum),
      Equipment.countDocuments(filter)
    ]);
    
    const equipmentWithTCO = await attachTCOToEquipment(equipment);
    return success(res, {
      equipment: equipmentWithTCO,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum)
    }, 'Equipment retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get single equipment by ID
 * GET /api/v1/equipment/:id
 */
const getEquipmentById = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return error(res, 'Equipment not found', 404);
    }
    
    // Also fetch specs
    const specs = await EquipmentSpecs.find({ equipment_id: equipment._id });
    
    // Calculate detailed TCO (5-year)
    let tco5Year = null;
    try {
      tco5Year = await computeTCO(equipment, 'stable', 2000);
    } catch (err) {
      console.warn(`Could not calculate 5-year TCO for equipment ${equipment._id}:`, err.message);
      // Fall back to annual TCO
    }
    
    const response = {
      ...equipment.toJSON(),
      specifications: specs,
      intensity_label: equipment.intensity_label,
      estimated_tco_per_year_ugx: equipment.estimated_tco_per_year_ugx,
      estimated_tco_5_year_ugx: tco5Year
    };
    
    return success(res, response, 'Equipment retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get distinct machine categories
 * GET /api/v1/equipment/categories
 */
const getMachineCategories = async (req, res, next) => {
  try {
    const categories = await Equipment.distinct('machine_category');
    return success(res, categories, 'Machine categories retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get valid sub-types for a brand and category
 * GET /api/v1/equipment/subtypes?brand=Kärcher&category=floor_scrubber
 */
const getValidSubtypesApi = async (req, res, next) => {
  try {
    const { brand, category } = req.query;
    if (!brand || !category) {
      return error(res, 'Brand and category are required', 400);
    }
    const subtypes = getValidSubtypes(brand, category);
    return success(res, subtypes, 'Valid sub-types retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get equipment by category with specs
 * GET /api/v1/equipment/category/:category
 */
const getEquipmentByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const equipment = await Equipment.find({ machine_category: category });
    
    const equipmentWithSpecs = await Promise.all(
      equipment.map(async (eq) => {
        const specs = await EquipmentSpecs.find({ equipment_id: eq._id });
        return {
          ...eq.toJSON(),
          specifications: specs,
          intensity_label: eq.intensity_label,
          estimated_tco_per_year_ugx: eq.estimated_tco_per_year_ugx
        };
      })
    );
    
    return success(res, equipmentWithSpecs, 'Equipment by category retrieved');
  } catch (err) {
    next(err);
  }
};

// ============================================
// ADMIN WRITE ROUTES
// ============================================

/**
 * Create new equipment (admin only)
 * POST /api/v1/equipment
 */
const createEquipment = async (req, res, next) => {
  try {
    const { specifications, ...equipmentData } = req.body;
    
    // Validate that sub-type is valid for the brand and category
    const validSubtypes = getValidSubtypes(equipmentData.brand_name, equipmentData.machine_category);
    if (!validSubtypes.includes(equipmentData.machine_subtype)) {
      return error(res, `Invalid machine_subtype '${equipmentData.machine_subtype}' for brand '${equipmentData.brand_name}' and category '${equipmentData.machine_category}'`, 400);
    }
    
    const equipment = new Equipment(equipmentData);
    await equipment.save();
    
    // Save specifications if provided
    if (specifications && specifications.length > 0) {
      const specsData = specifications.map(spec => ({
        equipment_id: equipment._id,
        attribute_name: spec.attribute_name,
        attribute_value: spec.attribute_value,
        unit_of_measure: spec.unit_of_measure
      }));
      await EquipmentSpecs.insertMany(specsData);
    }
    
    // Log audit event
    if (req.user?.id) {
      await AuditLog.create({
        adminId: req.user.id,
        action: 'CREATE_EQUIPMENT',
        targetType: 'Equipment',
        targetId: equipment._id,
        details: { brand_name: equipmentData.brand_name, model_name: equipmentData.model_name },
        ipAddress: req.ip
      }).catch(err => console.warn('Audit log failed:', err));
    }
    
    // Invalidate equipment-related caches
    invalidateEquipmentCache();
    
    return success(res, equipment, 'Equipment created', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update equipment (admin only)
 * PUT /api/v1/equipment/:id
 */
const updateEquipment = async (req, res, next) => {
  try {
    const { specifications, ...equipmentData } = req.body;
    
    // If brand or category changed, validate sub-type
    const existing = await Equipment.findById(req.params.id);
    if (!existing) {
      return error(res, 'Equipment not found', 404);
    }
    
    const brand = equipmentData.brand_name || existing.brand_name;
    const category = equipmentData.machine_category || existing.machine_category;
    const subtype = equipmentData.machine_subtype || existing.machine_subtype;
    
    const validSubtypes = getValidSubtypes(brand, category);
    if (!validSubtypes.includes(subtype)) {
      return error(res, `Invalid machine_subtype '${subtype}' for brand '${brand}' and category '${category}'`, 400);
    }
    
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      equipmentData,
      { new: true, runValidators: true }
    );
    
    if (!equipment) {
      return error(res, 'Equipment not found', 404);
    }
    
    // Update specifications if provided
    if (specifications) {
      await EquipmentSpecs.deleteMany({ equipment_id: equipment._id });
      const specsData = specifications.map(spec => ({
        equipment_id: equipment._id,
        attribute_name: spec.attribute_name,
        attribute_value: spec.attribute_value,
        unit_of_measure: spec.unit_of_measure
      }));
      if (specsData.length > 0) {
        await EquipmentSpecs.insertMany(specsData);
      }
    }
    
    // Log audit event
    if (req.user?.id) {
      await AuditLog.create({
        adminId: req.user.id,
        action: 'UPDATE_EQUIPMENT',
        targetType: 'Equipment',
        targetId: equipment._id,
        details: equipmentData,
        ipAddress: req.ip
      }).catch(err => console.warn('Audit log failed:', err));
    }
    
    // Invalidate equipment-related caches
    invalidateEquipmentCache();
    
    return success(res, equipment, 'Equipment updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete equipment (admin only)
 * DELETE /api/v1/equipment/:id
 */
const deleteEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return error(res, 'Equipment not found', 404);
    }
    
    // Also delete associated specs
    await EquipmentSpecs.deleteMany({ equipment_id: req.params.id });
    
    // Log audit event
    if (req.user?.id) {
      await AuditLog.create({
        adminId: req.user.id,
        action: 'DELETE_EQUIPMENT',
        targetType: 'Equipment',
        targetId: equipment._id,
        details: { brand_name: equipment.brand_name, model_name: equipment.model_name },
        ipAddress: req.ip
      }).catch(err => console.warn('Audit log failed:', err));
    }
    
    // Invalidate equipment-related caches
    invalidateEquipmentCache();
    
    return success(res, null, 'Equipment deleted');
  } catch (err) {
    next(err);
  }
};

// ============================================
// IMAGE MANAGEMENT
// ============================================

/**
 * Upload image for equipment (file upload)
 * POST /api/v1/equipment/:id/image
 */
const uploadEquipmentImage = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return error(res, 'Equipment not found', 404);
    }
    
    if (!req.file) {
      return error(res, 'No image file uploaded', 400);
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/equipment/${req.file.filename}`;
    
    equipment.image_url = imageUrl;
    await equipment.save();
    
    return success(res, { 
      image_url: equipment.image_url,
      message: 'Image uploaded successfully'
    }, 'Image uploaded');
  } catch (err) {
    next(err);
  }
};

/**
 * Update equipment image URL (without file upload)
 * PUT /api/v1/equipment/:id/image-url
 */
const updateEquipmentImageUrl = async (req, res, next) => {
  try {
    const { image_url } = req.body;
    
    if (!image_url) {
      return error(res, 'Image URL is required', 400);
    }
    
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { image_url },
      { new: true, runValidators: true }
    );
    
    if (!equipment) {
      return error(res, 'Equipment not found', 404);
    }
    
    return success(res, { image_url: equipment.image_url }, 'Image URL updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete equipment image (remove image_url)
 * DELETE /api/v1/equipment/:id/image
 */
const deleteEquipmentImage = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return error(res, 'Equipment not found', 404);
    }
    
    equipment.image_url = null;
    await equipment.save();
    
    return success(res, null, 'Image removed');
  } catch (err) {
    next(err);
  }
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
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
};
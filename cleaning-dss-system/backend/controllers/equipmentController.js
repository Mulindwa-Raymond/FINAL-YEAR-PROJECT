/**
 * equipmentController.js
 * Manages cleaning equipment (machines) with KB-DSS fields and image support.
 */

const Equipment = require('../models/Equipment');
const EquipmentSpecs = require('../models/EquipmentSpecs');
const { success, error } = require('../utils/apiResponse');

/**
 * Get all equipment with optional filters
 * GET /api/v1/equipment
 */
const getAllEquipment = async (req, res, next) => {
  try {
    const { machine_category, power_source, brand_name, min_price, max_price } = req.query;
    const filter = {};
    
    if (machine_category) filter.machine_category = machine_category;
    if (power_source) filter.power_source = power_source;
    if (brand_name) filter.brand_name = { $regex: brand_name, $options: 'i' };
    if (min_price || max_price) {
      filter.current_price_ugx = {};
      if (min_price) filter.current_price_ugx.$gte = parseInt(min_price);
      if (max_price) filter.current_price_ugx.$lte = parseInt(max_price);
    }
    
    const equipment = await Equipment.find(filter);
    return success(res, equipment, 'Equipment retrieved');
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
    
    const response = {
      ...equipment.toJSON(),
      specifications: specs
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
          specifications: specs
        };
      })
    );
    
    return success(res, equipmentWithSpecs, 'Equipment by category retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Create new equipment (admin only)
 * POST /api/v1/equipment
 */
const createEquipment = async (req, res, next) => {
  try {
    const { specifications, ...equipmentData } = req.body;
    
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
    
    // Generate URL for the uploaded image
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
 * Body: { image_url: "https://example.com/image.jpg" }
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

module.exports = {
  getAllEquipment,
  getEquipmentById,
  getMachineCategories,
  getEquipmentByCategory,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  uploadEquipmentImage,
  updateEquipmentImageUrl,
  deleteEquipmentImage
};
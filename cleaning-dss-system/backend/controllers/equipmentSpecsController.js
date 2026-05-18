/**
 * equipmentSpecsController.js
 * Manages equipment technical specifications with dynamic attributes
 */

const EquipmentSpecs = require('../models/EquipmentSpecs');
const Equipment = require('../models/Equipment');
const { success, error } = require('../utils/apiResponse');

/**
 * Get specs for a specific equipment
 * GET /api/v1/equipment-specs/equipment/:equipmentId
 */
const getSpecsByEquipment = async (req, res, next) => {
  try {
    const { equipmentId } = req.params;

    // Verify equipment exists
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return error(res, 'Equipment not found', 404);
    }

    const specs = await EquipmentSpecs.find({ equipment_id: equipmentId });
    return success(res, specs, 'Equipment specs retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get specs by machine category
 * GET /api/v1/equipment-specs/category/:category
 */
const getSpecsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    // Find all equipment in this category
    const equipmentList = await Equipment.find({ machine_category: category });
    if (equipmentList.length === 0) {
      return success(res, [], 'No equipment found in this category');
    }

    const equipmentIds = equipmentList.map(e => e._id);
    const specs = await EquipmentSpecs.find({ equipment_id: { $in: equipmentIds } });

    return success(res, specs, 'Specs by category retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get all common attribute names across all equipment
 * GET /api/v1/equipment-specs/attributes
 */
const getCommonAttributes = async (req, res, next) => {
  try {
    const attributes = await EquipmentSpecs.distinct('attribute_name');
    return success(res, attributes, 'Common attributes retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new equipment spec
 * POST /api/v1/equipment-specs
 */
const createSpec = async (req, res, next) => {
  try {
    const { equipment_id, attribute_name, attribute_value, unit_of_measure } = req.body;

    // Validate required fields
    if (!equipment_id || !attribute_name || !attribute_value) {
      return error(res, 'Equipment ID, attribute name, and attribute value are required', 400);
    }

    // Verify equipment exists
    const equipment = await Equipment.findById(equipment_id);
    if (!equipment) {
      return error(res, 'Equipment not found', 404);
    }

    const spec = new EquipmentSpecs({
      equipment_id,
      attribute_name,
      attribute_value,
      unit_of_measure: unit_of_measure || null
    });

    const savedSpec = await spec.save();
    return success(res, savedSpec, 'Spec created successfully', 201);
  } catch (err) {
    // Handle duplicate key error
    if (err.code === 11000) {
      return error(res, 'This attribute already exists for this equipment', 400);
    }
    next(err);
  }
};

/**
 * Update equipment spec
 * PUT /api/v1/equipment-specs/:id
 */
const updateSpec = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { attribute_value, unit_of_measure } = req.body;

    if (!attribute_value) {
      return error(res, 'Attribute value is required', 400);
    }

    const spec = await EquipmentSpecs.findByIdAndUpdate(
      id,
      {
        attribute_value,
        unit_of_measure: unit_of_measure || null
      },
      { new: true, runValidators: true }
    );

    if (!spec) {
      return error(res, 'Spec not found', 404);
    }

    return success(res, spec, 'Spec updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete equipment spec
 * DELETE /api/v1/equipment-specs/:id
 */
const deleteSpec = async (req, res, next) => {
  try {
    const { id } = req.params;

    const spec = await EquipmentSpecs.findByIdAndDelete(id);

    if (!spec) {
      return error(res, 'Spec not found', 404);
    }

    return success(res, null, 'Spec deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSpecsByEquipment,
  getSpecsByCategory,
  getCommonAttributes,
  createSpec,
  updateSpec,
  deleteSpec
};

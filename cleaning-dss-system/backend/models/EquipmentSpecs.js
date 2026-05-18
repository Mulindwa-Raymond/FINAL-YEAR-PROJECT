/**
 * EquipmentSpecs Model
 * Stores category-specific technical specifications for each machine.
 * Allows dynamic attributes per machine type.
 */

const mongoose = require('mongoose');

const equipmentSpecsSchema = new mongoose.Schema({
  specs_id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true
  },
  equipment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: [true, 'Equipment ID is required']
  },
  attribute_name: {
    type: String,
    required: [true, 'Attribute name is required'],
    trim: true,
    maxlength: 50
  },
  attribute_value: {
    type: String,
    required: [true, 'Attribute value is required'],
    trim: true,
    maxlength: 255
  },
  unit_of_measure: {
    type: String,
    trim: true,
    maxlength: 20,
    default: null
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.specs_id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Compound unique index: equipment_id + attribute_name
equipmentSpecsSchema.index({ equipment_id: 1, attribute_name: 1 }, { unique: true });
equipmentSpecsSchema.index({ equipment_id: 1 });
equipmentSpecsSchema.index({ attribute_name: 1 });

module.exports = mongoose.model('EquipmentSpecs', equipmentSpecsSchema);
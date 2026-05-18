/**
 * EquipmentDetergentCompatibility Model
 * Junction table linking equipment to compatible detergents.
 * Ensures chemical safety and prevents equipment damage.
 */

const mongoose = require('mongoose');

const compatibilitySchema = new mongoose.Schema({
  compatibility_id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true
  },
  equipment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: [true, 'Equipment ID is required']
  },
  detergent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Detergent',
    required: [true, 'Detergent ID is required']
  },
  compatibility_notes: {
    type: String,
    default: null
  },
  is_recommended: {
    type: Boolean,
    default: true
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.compatibility_id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Unique compound index: equipment_id + detergent_id
compatibilitySchema.index({ equipment_id: 1, detergent_id: 1 }, { unique: true });
compatibilitySchema.index({ equipment_id: 1 });
compatibilitySchema.index({ detergent_id: 1 });
compatibilitySchema.index({ is_recommended: 1 });

module.exports = mongoose.model('EquipmentDetergentCompatibility', compatibilitySchema);
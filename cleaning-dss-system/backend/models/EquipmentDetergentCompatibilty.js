// backend/models/EquipmentDetergentCompatibilty.js
const mongoose = require('mongoose');

const compatibilitySchema = new mongoose.Schema(
  {
    compatibility_id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
    },
    equipment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: [true, 'Equipment ID is required'],
    },
    detergent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Detergent',
      required: [true, 'Detergent ID is required'],
    },
    compatibility_notes: {
      type: String,
      default: null,
    },
    is_recommended: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.compatibility_id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
compatibilitySchema.index({ equipment_id: 1, detergent_id: 1 }, { unique: true });
compatibilitySchema.index({ equipment_id: 1, is_recommended: 1 }); // most common query
compatibilitySchema.index({ detergent_id: 1 });

module.exports = mongoose.model('EquipmentDetergentCompatibility', compatibilitySchema);
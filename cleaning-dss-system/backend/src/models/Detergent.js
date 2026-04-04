import mongoose from 'mongoose';

const detergentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: String },
    phLevel: { type: Number },
    dilutionRatio: { type: String },
    ecoFriendly: { type: Boolean, default: false },
    certifications: [{ type: String }],
    specifications: {
      chemicalComposition: { type: String },
      safetyPrecautions: { type: String },
      haccpApproved: { type: Boolean, default: false },
    },
    compatibility: {
      surfaces: [{ type: String }],
      soilTypes: [{ type: String }],
      machineTypes: [{ type: String }],
    },
    price: { type: Number, required: true }, // Price per unit (e.g., per liter)
  },
  { timestamps: true }
);

const Detergent = mongoose.model('Detergent', detergentSchema);

export default Detergent;

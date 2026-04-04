import mongoose from 'mongoose';

const equipmentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: String },
    type: { type: String, required: true }, // e.g., Scrubber, Vacuum, Polisher
    specifications: {
      powerSource: { type: String },
      weight: { type: Number },
      noiseLevel: { type: Number },
      tankCapacity: { type: Number },
      areaPerformance: { type: Number }, // sq meters per hour
    },
    tcoData: {
      purchasePrice: { type: Number, required: true },
      lifespanYears: { type: Number, default: 5 },
      annualMaintenance: { type: Number },
      annualEnergyCost: { type: Number },
      annualSpareParts: { type: Number },
    },
    compatibility: {
      surfaces: [{ type: String }], // Tile, Vinyl, etc.
      soilTypes: [{ type: String }], // Grease, Oil, etc.
    },
    suppliers: [
      {
        name: { type: String },
        location: { type: String },
        price: { type: Number },
        leadTime: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;

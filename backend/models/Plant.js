const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  commonName: { type: String, required: true },
  botanicalName: { type: String, required: true },
  sanskritName: { type: String },
  hindiName: { type: String },
  family: { type: String },
  origin: { type: String },
  category: { type: String }, // e.g. "Stress Relief", "Immunity"
  tags: [{ type: String }],   // e.g. ["Stress Relief", "Immunity", "Sleep"]

  description: { type: String },

  medicinalUses: [{ type: String }],
  activeCompounds: [{ type: String }],
  precautions: { type: String },

  careGuide: {
    sunlight: { type: String },     // e.g. "Full Sun"
    water: { type: String },        // e.g. "Low", "Moderate"
    soil: { type: String },
    climate: [{ type: String }],
    difficulty: { type: String },   // e.g. "Easy", "Moderate", "Expert"
    growthRate: { type: String },
    harvestTime: { type: String },
    partUsed: { type: String },
  },

  images: [{ type: String }], // URLs

  studiesCited: { type: Number, default: 0 },
  embedding: { type: [Number], default: [] },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Plant", plantSchema);
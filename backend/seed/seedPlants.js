//This connects to your DB, wipes any existing plants (so we don't get duplicates if we run it twice), then inserts a starter batch:

const mongoose = require("mongoose");
require("dotenv").config();
const Plant = require("../models/Plant");

const plants = [
  {
    commonName: "Ashwagandha",
    botanicalName: "Withania somnifera",
    sanskritName: "Ashwagandha",
    family: "Solanaceae",
    origin: "India, Africa",
    category: "Immunity",
    tags: ["Stress Relief", "Immunity", "Sleep"],
    description: "One of the most important herbs in Ayurvedic medicine, used for over 3,000 years to relieve stress and improve concentration.",
    medicinalUses: ["Stress reduction", "Improves sleep quality", "Boosts immune function"],
    activeCompounds: ["Withanolides", "Withaferin A", "Alkaloids"],
    precautions: "Contraindicated during pregnancy.",
    careGuide: {
      sunlight: "Full Sun",
      water: "Low",
      soil: "Sandy, well-drained",
      climate: ["Tropical", "Arid"],
      difficulty: "Moderate",
      growthRate: "Slow-Moderate",
      harvestTime: "8-12 months",
      partUsed: "Root, leaf",
    },
    images: [],
    studiesCited: 47,
  },
  {
    commonName: "Holy Basil",
    botanicalName: "Ocimum tenuiflorum",
    sanskritName: "Tulsi",
    family: "Lamiaceae",
    origin: "India",
    category: "Immunity",
    tags: ["Immunity", "Respiratory"],
    description: "Known as Tulsi, this sacred plant is widely used in Ayurveda for respiratory and immune support.",
    medicinalUses: ["Boosts immunity", "Supports respiratory health", "Reduces inflammation"],
    activeCompounds: ["Ursolic acid", "Eugenol", "Rosmarinic acid"],
    precautions: "Generally safe, GRAS status.",
    careGuide: {
      sunlight: "Full Sun",
      water: "Moderate",
      soil: "Loamy, well-drained",
      climate: ["Tropical", "Temperate"],
      difficulty: "Easy",
      growthRate: "Fast",
      harvestTime: "3-4 months",
      partUsed: "Leaf",
    },
    images: [],
    studiesCited: 31,
  },
  {
    commonName: "Rhodiola",
    botanicalName: "Rhodiola rosea",
    family: "Crassulaceae",
    origin: "Arctic regions, Europe, Asia",
    category: "Energy",
    tags: ["Energy", "Stress"],
    description: "An adaptogenic herb traditionally used to combat fatigue and improve mental performance under stress.",
    medicinalUses: ["Reduces fatigue", "Improves mental performance", "Stress adaptation"],
    activeCompounds: ["Rosavins", "Salidroside", "Tyrosol"],
    precautions: "Use with caution during pregnancy.",
    careGuide: {
      sunlight: "Partial Shade",
      water: "Moderate",
      soil: "Rocky, poor soil",
      climate: ["Alpine", "Arctic"],
      difficulty: "Expert",
      growthRate: "Very Slow",
      harvestTime: "3-5 years",
      partUsed: "Root",
    },
    images: [],
    studiesCited: 23,
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Plant.deleteMany({});
    console.log("🗑️  Cleared existing plants");

    await Plant.insertMany(plants);
    console.log(`🌱 Inserted ${plants.length} plants`);

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
}

seedDB();
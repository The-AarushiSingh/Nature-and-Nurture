const mongoose = require("mongoose");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Plant = require("../models/Plant");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildPlantText(plant) {
  return `
Plant: ${plant.commonName} (${plant.botanicalName})
Category: ${plant.category}
Tags: ${plant.tags?.join(", ")}
Description: ${plant.description}
Medicinal Uses: ${plant.medicinalUses?.join(", ")}
Active Compounds: ${plant.activeCompounds?.join(", ")}
Precautions: ${plant.precautions}
Care: Sunlight - ${plant.careGuide?.sunlight}, Water - ${plant.careGuide?.water}, Soil - ${plant.careGuide?.soil}, Difficulty - ${plant.careGuide?.difficulty}, Climate - ${plant.careGuide?.climate?.join(", ")}
  `.trim();
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const plants = await Plant.find();
  console.log(`Found ${plants.length} plants. Generating embeddings...`);

  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

  for (const plant of plants) {
    const text = buildPlantText(plant);
    const result = await model.embedContent(text);
    plant.embedding = result.embedding.values;
    await plant.save();
    console.log(`✔ Embedded: ${plant.commonName}`);
  }

  console.log("🌱 All plants embedded successfully.");
  process.exit();
}

run().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
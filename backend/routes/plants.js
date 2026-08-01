const express = require("express");
const router = express.Router();
const Plant = require("../models/Plant");
const cosineSimilarity = require("../utils/similarity");
// GET all plants (supports optional search & filters later)
// GET all plants (supports search & filters via query params)
function regexIn(values) {
  return { $in: values.map((v) => new RegExp(v, "i")) };
}

router.get("/", async (req, res) => {
  try {
    const { search, category, climate, sunlight, water, difficulty, sort } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { commonName: { $regex: search, $options: "i" } },
        { botanicalName: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = regexIn(category.split(","));
    if (climate) query["careGuide.climate"] = regexIn(climate.split(","));
    if (sunlight) query["careGuide.sunlight"] = regexIn(sunlight.split(","));
    if (water) query["careGuide.water"] = regexIn(water.split(","));
    if (difficulty) query["careGuide.difficulty"] = regexIn(difficulty.split(","));

    let plantsQuery = Plant.find(query);
    if (sort === "az") plantsQuery = plantsQuery.sort({ commonName: 1 });
    else if (sort === "difficulty") plantsQuery = plantsQuery.sort({ "careGuide.difficulty": 1 });
    else if (sort === "recent") plantsQuery = plantsQuery.sort({ createdAt: -1 });

    const plants = await plantsQuery;
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET single plant by ID
router.get("/:id", async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ error: "Plant not found" });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new plant
router.post("/", async (req, res) => {
  try {
    const newPlant = new Plant(req.body);
    const savedPlant = await newPlant.save();
    res.status(201).json(savedPlant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/:id/similar", async (req, res) => {
  try {
    const target = await Plant.findById(req.params.id);
    if (!target || !target.embedding?.length) {
      return res.json([]);
    }

    const allPlants = await Plant.find({ _id: { $ne: target._id } });

    const scored = allPlants
      .filter((p) => p.embedding?.length > 0)
      .map((p) => ({ plant: p, score: cosineSimilarity(target.embedding, p.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((s) => s.plant);

    res.json(scored);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:id/guide", async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ error: "Plant not found" });

    if (plant.cultivationGuide?.length > 0) {
      return res.json(plant.cultivationGuide);
    }

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    const prompt = `
Create a beginner-friendly, step-by-step cultivation guide for growing ${plant.commonName} (${plant.botanicalName}) at home.
Known care info: Sunlight - ${plant.careGuide?.sunlight}, Water - ${plant.careGuide?.water}, Soil - ${plant.careGuide?.soil}, Difficulty - ${plant.careGuide?.difficulty}, Climate - ${plant.careGuide?.climate?.join(", ")}, Harvest time - ${plant.careGuide?.harvestTime}.

Respond with ONLY valid JSON (no markdown fences) as an array of 5-6 phases in this exact shape:
[
  { "phase": "Planting", "duration": "Week 1", "title": "string", "steps": ["string", "string", "string"] }
]
Cover: getting started/planting, early growth care, ongoing maintenance, common issues to watch for, and harvest/maturity. Keep steps practical and specific to this plant, assuming zero prior gardening experience.
    `.trim();

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim().replace(/^```json\s*/, "").replace(/```$/, "").trim();
    const guide = JSON.parse(text);

    plant.cultivationGuide = guide;
    await plant.save();

    res.json(guide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate cultivation guide." });
  }
});

module.exports = router;
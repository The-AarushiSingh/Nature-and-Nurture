const express = require("express");
const router = express.Router();
const Plant = require("../models/Plant");

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

module.exports = router;
const express = require("express");
const router = express.Router();
const Plant = require("../models/Plant");

router.post("/", async (req, res) => {
  try {
    const { climate, space, sunlight, maintenance, goals } = req.body;
    const plants = await Plant.find();

    const scored = plants.map((plant) => {
      let score = 0;
      const reasons = [];

      // Climate match (heaviest weight — wrong climate = plant likely won't survive)
      if (climate && plant.careGuide?.climate?.some((c) =>
        c.toLowerCase().includes(climate.toLowerCase())
      )) {
        score += 30;
        reasons.push(`Thrives in ${climate} climates`);
      }

      // Sunlight match
      if (sunlight && plant.careGuide?.sunlight?.toLowerCase().includes(sunlight.toLowerCase())) {
        score += 20;
        reasons.push(`Matches your ${sunlight.toLowerCase()} conditions`);
      }

      // Maintenance/difficulty match
      if (maintenance) {
        const diffMap = { low: "Easy", medium: "Moderate", high: "Expert" };
        if (plant.careGuide?.difficulty === diffMap[maintenance]) {
          score += 20;
          reasons.push(`Fits your preferred maintenance level`);
        }
      }

      // Space (indoor/outdoor) — approximate using difficulty + growth rate as a proxy
      if (space === "indoor" && plant.careGuide?.difficulty === "Easy") {
        score += 10;
        reasons.push("Manageable for indoor growing");
      }
      if (space === "outdoor") {
        score += 5;
      }

      // Health goals — match against tags/category/medicinalUses
      if (goals && goals.length > 0) {
        const goalMatches = goals.filter((goal) =>
          plant.tags?.some((t) => t.toLowerCase().includes(goal.toLowerCase())) ||
          plant.category?.toLowerCase().includes(goal.toLowerCase())
        );
        if (goalMatches.length > 0) {
          score += goalMatches.length * 15;
          reasons.push(`Supports ${goalMatches.join(", ")}`);
        }
      }

      return { plant, score, reasons };
    });

    // Sort by score, keep top matches with a non-zero score
    const topMatches = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((s) => ({
        id: s.plant._id,
        commonName: s.plant.commonName,
        botanicalName: s.plant.botanicalName,
        tags: s.plant.tags,
        matchScore: Math.min(s.score, 100),
        reasons: s.reasons,
      }));

    res.json(topMatches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
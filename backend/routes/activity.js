const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const requireAuth = require("../middleware/auth");

// Log a new activity (fire-and-forget from the frontend)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { type, title, subtitle, relatedPlantId } = req.body;
    const activity = new Activity({ user: req.userId, type, title, subtitle, relatedPlantId });
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recent activity feed
router.get("/recent", requireAuth, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recently viewed plants (distinct, most recent first)
router.get("/recently-viewed", requireAuth, async (req, res) => {
  try {
    const views = await Activity.find({ user: req.userId, type: "viewed_plant" })
      .sort({ createdAt: -1 })
      .populate("relatedPlantId")
      .limit(20);

    const seen = new Set();
    const distinct = [];
    for (const v of views) {
      if (v.relatedPlantId && !seen.has(v.relatedPlantId._id.toString())) {
        seen.add(v.relatedPlantId._id.toString());
        distinct.push({ plant: v.relatedPlantId, viewedAt: v.createdAt });
      }
      if (distinct.length >= 4) break;
    }
    res.json(distinct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lifetime stats for dashboard cards
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const [aiQueries, plantsIdd, recentActivity] = await Promise.all([
      Activity.countDocuments({ user: req.userId, type: "asked_ai" }),
      Activity.countDocuments({ user: req.userId, type: "identified_plant" }),
      Activity.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50),
    ]);

    const uniqueDays = new Set(
      recentActivity.map((a) => a.createdAt.toISOString().slice(0, 10))
    );

    res.json({ aiQueries, plantsIdd, activeDays: uniqueDays.size });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

// GET all saved plants for logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("savedPlants");
    res.json(user.savedPlants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST save a plant to garden
router.post("/:plantId", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const alreadySaved = user.savedPlants.includes(req.params.plantId);
    if (alreadySaved) {
      return res.status(400).json({ error: "Plant already saved" });
    }

    user.savedPlants.push(req.params.plantId);
    await user.save();

    res.status(201).json({ message: "Plant saved to garden" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE remove a plant from garden
router.delete("/:plantId", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.savedPlants = user.savedPlants.filter(
      (id) => id.toString() !== req.params.plantId
    );
    await user.save();

    res.json({ message: "Plant removed from garden" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
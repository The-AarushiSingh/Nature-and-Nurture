const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["viewed_plant", "asked_ai", "saved_garden", "identified_plant", "diagnosed_plant", "recommendation_quiz"],
    required: true,
  },
  title: { type: String, required: true },
  subtitle: { type: String },
  relatedPlantId: { type: mongoose.Schema.Types.ObjectId, ref: "Plant" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Activity", activitySchema);
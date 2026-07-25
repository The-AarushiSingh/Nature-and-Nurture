const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedPlants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plant" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
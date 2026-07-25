const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/plants", require("./routes/plants"));
app.use("/api/auth", require("./routes/auth"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Nature & Nurture backend is running 🌿");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
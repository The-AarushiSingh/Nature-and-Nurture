const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
//Base64-encoded images are roughly 33% larger than the original file, and photos can easily be a few MB — without raising this limit, Express would reject the request with a "payload too large" error before it even reaches our route.
app.use(express.json({ limit: "10mb" }));
app.use("/api/plants", require("./routes/plants"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/garden", require("./routes/garden"));
app.use("/api/assistant", require("./routes/assistant"));
app.use("/api/diagnosis", require("./routes/diagnosis"));

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
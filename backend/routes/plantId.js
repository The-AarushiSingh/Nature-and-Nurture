const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Plant = require("../models/Plant");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "An image is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    const prompt = `
You are a plant identification expert. Analyze the uploaded photo and identify the plant species.

Respond with ONLY valid JSON (no markdown code fences, no extra text) in exactly this shape:

{
  "commonName": "string - most common name for this plant",
  "hindiName": "string - common Hindi/Devanagari name for this plant if one exists (e.g. तुलसी for Tulsi), else empty string",
  "botanicalName": "string - scientific/Latin name",
  "confidence": number between 0-100,
  "family": "string - plant family",
  "description": "string - 2-3 sentences about this plant",
  "generalCare": {
    "sunlight": "string",
    "water": "string",
    "difficulty": "string - Easy, Moderate, or Expert"
  },
  "knownUses": "string - brief note on culinary, medicinal, or ornamental uses if any, else 'Primarily ornamental'"
}

If the image is unclear, blurry, or doesn't clearly show a plant, set commonName to "Unable to identify" and confidence to 0, and explain why in the description.
Be realistic with confidence — only use high confidence (85+) when the plant's identifying features are clearly visible.
    `.trim();

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType: mimeType || "image/jpeg",
        },
      },
    ]);

    let text = result.response.text().trim();
    text = text.replace(/^```json\s*/, "").replace(/```$/, "").trim();

    const identification = JSON.parse(text);

    // Cross-check against our own database — case-insensitive partial match
    // on either common name or botanical name
    let matchedPlant = null;
    if (identification.commonName && identification.commonName !== "Unable to identify") {
      matchedPlant = await Plant.findOne({
        $or: [
          { commonName: { $regex: identification.commonName, $options: "i" } },
          { botanicalName: { $regex: identification.botanicalName || "___NOMATCH___", $options: "i" } },
        ],
      });
    }

    res.json({
      ...identification,
      inDatabase: !!matchedPlant,
      databasePlantId: matchedPlant ? matchedPlant._id : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not process identification. Please try again." });
  }
});

module.exports = router;
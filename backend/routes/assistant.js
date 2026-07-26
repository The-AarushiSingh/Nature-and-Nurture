const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Plant = require("../models/Plant");
const cosineSimilarity = require("../utils/similarity");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1. Embed the user's question
    const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const embedResult = await embedModel.embedContent(message);
    const queryVector = embedResult.embedding.values;

    // 2. Fetch all plants and compute similarity
    const plants = await Plant.find();
    const scored = plants
      .filter((p) => p.embedding && p.embedding.length > 0)
      .map((p) => ({
        plant: p,
        score: cosineSimilarity(queryVector, p.embedding),
      }))
      .sort((a, b) => b.score - a.score);

    // 3. Take top 3 most relevant plants
    const topMatches = scored.slice(0, 3);

    // 4. Build context text from the retrieved plants
    const context = topMatches
      .map(({ plant }) => {
        return `
Plant: ${plant.commonName} (${plant.botanicalName})
Category: ${plant.category}
Description: ${plant.description}
Medicinal Uses: ${plant.medicinalUses?.join(", ")}
Active Compounds: ${plant.activeCompounds?.join(", ")}
Precautions: ${plant.precautions}
Care Guide: Sunlight - ${plant.careGuide?.sunlight}, Water - ${plant.careGuide?.water}, Difficulty - ${plant.careGuide?.difficulty}
        `.trim();
      })
      .join("\n\n---\n\n");

    // 5. Build the final prompt and call Gemini
    const prompt = `
You are a knowledgeable, careful medicinal plant assistant for the Nature & Nurture app.
Answer the user's question using ONLY the plant information provided below.
If the answer isn't in the provided information, say you don't have verified data on that specific point, rather than guessing.
Keep answers clear, practical, and concise. Include a brief safety note if precautions are relevant.

PLANT DATABASE CONTEXT:
${context}

USER QUESTION:
${message}
    `.trim();

    const chatModel = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    const result = await chatModel.generateContent(prompt);
    const answer = result.response.text();

    // 6. Return answer + which plants were retrieved (for transparency/citations)
    res.json({
      answer,
      sources: topMatches.map(({ plant, score }) => ({
        id: plant._id,
        name: plant.commonName,
        score: score.toFixed(3),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
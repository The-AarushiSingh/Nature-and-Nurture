const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { image, mimeType, plantName, symptoms } = req.body;

    if (!image) {
      return res.status(400).json({ error: "An image is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    const prompt = `
You are a plant pathology assistant. Analyze the uploaded photo of a plant (possibly showing disease, pest damage, or nutrient deficiency).

${plantName ? `The user says this plant is: ${plantName}` : ""}
${symptoms ? `The user describes these symptoms: ${symptoms}` : ""}

Respond with ONLY valid JSON (no markdown code fences, no extra text) in exactly this shape:

{
  "diseaseName": "string - common name of the issue, or 'Healthy' if no issue is visible",
  "scientificName": "string - pathogen/scientific name if applicable, else empty string",
  "confidence": number between 0-100,
  "description": "string - 2-3 sentence explanation of what this is and why it happens",
  "severity": "Low" | "Moderate" | "High",
  "spreadRisk": "Low" | "Medium" | "Medium-High" | "High",
  "actionUrgency": "string - e.g. 'Monitor only', 'Act within a week', 'Act within 48h'",
  "possibleCauses": [
    { "cause": "string", "likelihood": "Likely" | "Possible", "explanation": "string" }
  ],
  "suggestedTreatments": [
    { "name": "string", "type": "string - e.g. 'Organic', 'Chemical', 'Physical control'", "instructions": "string - concise, actionable" }
  ],
  "preventiveCare": ["string", "string", "string", "string"],
  "otherPossibilities": [
    { "name": "string", "percentage": number }
  ]
}

Be realistic and cautious with confidence scores. If the image is unclear or doesn't show a plant, set diseaseName to "Unable to determine" and explain why in the description.
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

    // Strip markdown code fences if the model adds them despite instructions
    text = text.replace(/^```json\s*/, "").replace(/```$/, "").trim();

    const diagnosis = JSON.parse(text);

    res.json(diagnosis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not process diagnosis. Please try again." });
  }
});

module.exports = router;
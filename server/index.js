require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
console.log(API_KEY);

app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
  {
        contents: [{
          parts: [{
text: `
You are a cinematic AI that judges how much someone is the "main character".

Return ONLY valid JSON. No text outside JSON.

Format:
{
  "score": integer (0-100),
  "role": "short relatable role",
  "analysis": "clear,simple language, meaningful explanation (not too fancy)",
  "metrics": {
    "control": "low/medium/high",
    "visibility": "low/medium/high",
    "influence": "low/medium/high"
  }
}

IMPORTANT:
- Use simple, real-life language (not film jargon)
- Make it feel insightful, not abstract
- Make the user understand immediately

Day: ${text}
`
          }]
        }]
      }
    );

    const raw = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);

    res.json(parsed);

 } catch (err) {
  console.error("FULL ERROR:", err.response?.data || err.message);
  res.status(500).json({
    error: err.response?.data || err.message
  });
}
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
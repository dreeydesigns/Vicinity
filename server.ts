import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Match Summary
  app.post("/api/match-summary", async (req, res) => {
    try {
      const { userBio, matchBio, sharedInterests } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not found." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a matchmaker app. Provide a short, fun, 2-sentence summary of why these two people are a great match based on their bios and shared interests.
User 1 Bio: ${userBio}
User 2 Bio: ${matchBio}
Shared Interests: ${sharedInterests.join(", ")}
Summary:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ summary: response.text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate match summary." });
    }
  });

  // API Route for AI Venue Suggestions
  app.post("/api/suggest-venues", async (req, res) => {
    try {
      const { sharedInterests } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not found." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert date planner. Suggest exactly 3 date venues based on the following shared interests: ${sharedInterests.join(", ")}.
Return the response in valid JSON format. It must be an array of objects with the following properties:
- id: a unique string id
- name: string (venue name)
- address: string
- rating: number (from 1 to 5)
- priceLevel: number (1 to 4)
- vibe: string (e.g. "romantic", "casual", "adventurous", "cozy")
- distanceMeters: number
- reason: a short 1-sentence reason why it's a good fit.
- photoUrl: an empty string ("")

Only return the JSON array, no markdown formatting.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const venues = JSON.parse(response.text || "[]");
      res.json({ venues });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to suggest venues." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client safely
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI client successfully initialized server-side.");
  } else {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features will fallback to client-side heuristics.");
  }

  // --- API Routes ---

  // Google Search Console Site Verification File Endpoint
  app.get("/googlec00b1f8351e9f2dc.html", (req, res) => {
    res.send("google-site-verification: googlec00b1f8351e9f2dc.html");
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Typing Coach Feedback Endpoint
  app.post("/api/ai/coach", async (req, res) => {
    try {
      if (!ai) {
        return res.status(200).json({
          feedback: "Great job! Keep practicing home-row and key combinations. (Fallback: Setup your GEMINI_API_KEY in Secrets for personalized AI coaching feedback)",
          weakLetters: ["e", "t", "s"],
          suggestedExercises: ["Practice home row shortcuts", "Focus on capital keys", "Take dynamic 1-minute speed trials"],
          predictedImprovement: "Your speed is predicted to increase by 5 WPM in 1 week if daily streaks are maintained.",
          motivationQuote: "The only limit is your finger dexterity. Keep pushing the limits!"
        });
      }

      const { statistics, sessionHistory, preferences } = req.body;

      // Create a contextualized prompt for TypeNova's Coach
      const prompt = `Analyze this typing user profile on TypeNova typing master app and generate custom structured coaching feedback:
      - Average Speed: ${statistics?.averageWpm || 0} WPM
      - Max Speed: ${statistics?.maxWpm || 0} WPM
      - Average Accuracy: ${statistics?.averageAccuracy || 0}%
      - Current Keyboard Layout: ${preferences?.keyboardLayout || "QWERTY"}
      - Selected Goal Language: ${preferences?.language || "English"}
      - Recent session logs: ${JSON.stringify(sessionHistory || [])}
      
      Suggest what specific key characters they struggle with, outline exercises, predict speed curves, and provide motivational coaching advice.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the Ultimate AI Typing Coach for TypeNova. You analyze analytics, trace weak characters, recommend practice strategies, predict growth, and motivate typing learners.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              feedback: {
                type: Type.STRING,
                description: "Human-like elite level typing coach feedback on weak areas, keys, or fingers."
              },
              weakLetters: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of specific character keys user struggles with."
              },
              suggestedExercises: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Specific exercise bullet items recommended for improvement."
              },
              predictedImprovement: {
                type: Type.STRING,
                description: "A calculated prediction of speed and accuracy growth."
              },
              motivationQuote: {
                type: Type.STRING,
                description: "An inspiring, high-energy gaming or motivational slogan."
              }
            },
            required: ["feedback", "weakLetters", "suggestedExercises", "predictedImprovement", "motivationQuote"]
          }
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText.trim()));
    } catch (error: any) {
      console.error("AI Coach Error:", error);
      res.status(500).json({ error: "Failed to generate coaching, fallback active.", details: error.message });
    }
  });

  // AI Custom Lesson Generator Endpoint
  app.post("/api/ai/lessons/generate", async (req, res) => {
    try {
      if (!ai) {
        return res.status(200).json({
          title: "AI Custom Focus Drill (Basic Feedback Mode)",
          promptText: "The quick brown fox jumps over the lazy dog repeatedly to master letters.",
          description: "A generic practice drill to reinforce full keyboard index mechanics.",
          targetKeys: ["f", "j", "o", "x"]
        });
      }

      const { level, weakLetters, type } = req.body;

      const prompt = `Generate an engaging custom lesson text for typing practice:
      - Difficulty/Level: ${level || "Intermediate"}
      - Areas to target (weak letters/punctuation): ${JSON.stringify(weakLetters || [])}
      - Practice category: ${type || "words"}
      
      Generate a Title, the practice text prompt (should have balanced spacing, and be very clean, length around 100-200 characters), a description of what finger placements to focus on, and a target characters array.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the Lesson Architect of TypeNova. Generate focused typing drills keeping text clean, engaging, and strictly tailored to the user's focus inputs.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Lesson title" },
              promptText: { type: Type.STRING, description: "Full coherent string of text for typing practice" },
              description: { type: Type.STRING, description: "Short descriptive guidance" },
              targetKeys: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Primary key characters emphasized in this lesson text"
              }
            },
            required: ["title", "promptText", "description", "targetKeys"]
          }
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText.trim()));
    } catch (error: any) {
      console.error("AI Lesson Generator Error:", error);
      res.status(500).json({ error: "Failed to generate custom lesson.", details: error.message });
    }
  });

  // --- Real-Time simulated Multiplayer Lobbies ---
  // Users fetch active online lobby lists or submit simulated high-score responses
  app.get("/api/lobby/rooms", (req, res) => {
    res.json([
      { id: "room-1", name: "🏆 Cyber Speedway [Ranked]", players: 4, mode: "Competitive", active: true },
      { id: "room-2", name: "⚡ Quantum Drag Race [1v1]", players: 1, mode: "Casual", active: true },
      { id: "room-3", name: "🔥 Home Row Rumble", players: 2, mode: "Beginner", active: true },
      { id: "room-4", name: "👾 Zombie Horde Survival", players: 3, mode: "Games", active: true }
    ]);
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving compiled static assets from dist/ folder.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TypeNova Server running on http://localhost:${PORT}`);
  });
}

startServer();

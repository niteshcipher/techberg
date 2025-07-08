import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import axios from "axios";
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import roadmapRoutes from './routes/roadmap.route.js';
import Goal from './models/goal.model.js';

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// Use the GEMINI_API_KEY from the .env file
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY is not defined in the .env file.");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(API_KEY);

// ✅ Apply CORS FIRST — before routes and JSON parsing
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

// ✅ Then JSON parsing
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ✅ Now your API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use('/api', roadmapRoutes);

app.post('/api/generate-roadmap', async (req, res) => {
  try {
    const { goalText } = req.body;

    if (!goalText) {
      return res.status(400).json({ error: 'Goal text is required' });
    }

    // Configure the model (using Gemini 1.5 Pro)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Prepare the prompt for Gemini
    const prompt = `
      Create a structured learning roadmap for the following goal: "${goalText}".
      
      Format your response as a JSON object with the following structure:
      {
        "title": "Short title for the roadmap",
        "description": "Brief description of the learning journey",
        "nodes": [
          {
            "id": "1", // Unique identifier
            "title": "Topic title",
            "description": "Brief description of what to learn",
            "level": 1, // Difficulty level (1=beginner, 2=intermediate, 3=advanced)
            "status": "not-started", // Initial status
            "prerequisites": [], // Array of node IDs that should be completed before this one
            "resources": [
              { "title": "Resource name", "url": "Resource URL" }
            ]
          },
          // More nodes...
        ]
      }
      
      Create at least 5 nodes with logical connections between them.
      Make sure each node has a clear title, description, and appropriate level.
      For prerequisites, reference the IDs of nodes that should be completed first.
      
      Return ONLY the JSON without any additional text or markdown formatting.
    `;

    // Generate response from Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    // Parse the JSON response
    let roadmapData;
    try {
      // Clean up any markdown code blocks if present
      let jsonText = rawText.replace(/```json|```/g, '').trim();
      roadmapData = JSON.parse(jsonText);

      // Basic validation
      if (!roadmapData.title || !roadmapData.nodes || !Array.isArray(roadmapData.nodes)) {
        throw new Error('Invalid roadmap structure');
      }

      // Ensure all nodes have the required properties
      roadmapData.nodes.forEach(node => {
        if (!node.id || !node.title || !node.level) {
          throw new Error('Invalid node structure');
        }

        // Ensure node has status
        if (!node.status) {
          node.status = 'not-started';
        }

        // Ensure resources is an array
        if (!node.resources) {
          node.resources = [];
        }
      });

      return res.json({ roadmap: roadmapData });

    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.log('Raw response:', rawText);
      return res.status(500).json({
        error: 'Failed to parse the AI-generated roadmap',
        rawResponse: rawText
      });
    }

  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});

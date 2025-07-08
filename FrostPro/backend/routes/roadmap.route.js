import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Use the GEMINI_API_KEY from the environment
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

router.post('/generate-roadmap', async (req, res) => {
  try {
    const { goalText } = req.body;

    if (!goalText) {
      return res.status(400).json({ error: 'Goal text is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      Create a structured learning roadmap for the following goal: "${goalText}".
      Format your response as a JSON object with the following structure:
      {
        "title": "Short title for the roadmap",
        "description": "Brief description of the learning journey",
        "nodes": [
          {
            "id": "1",
            "title": "Topic title",
            "description": "Brief description of what to learn",
            "level": 1,
            "status": "not-started",
            "prerequisites": [],
            "resources": [
              { "title": "Resource name", "url": "Resource URL" }
            ]
          }
        ]
      }
      Return ONLY the JSON without any additional text or markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    let roadmapData;
    try {
      let jsonText = rawText.replace(/```json|```/g, '').trim();
      roadmapData = JSON.parse(jsonText);

      if (!roadmapData.title || !roadmapData.nodes || !Array.isArray(roadmapData.nodes)) {
        throw new Error('Invalid roadmap structure');
      }

      roadmapData.nodes.forEach(node => {
        if (!node.id || !node.title || !node.level) {
          throw new Error('Invalid node structure');
        }
        if (!node.status) node.status = 'not-started';
        if (!node.resources) node.resources = [];
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

export default router;
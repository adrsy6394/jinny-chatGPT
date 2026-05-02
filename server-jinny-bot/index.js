const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "user", content: prompt }
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter for ranking
          "X-Title": "Jinny Bot", // Required by OpenRouter for ranking
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    
    res.json({ answer });

  } catch (error) {
    console.error("Error calling OpenRouter API:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch response from AI" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');
const History = require('./models/History');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

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

    // Save prompt to MongoDB
    await History.create({ prompt });

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
          "HTTP-Referer": "https://jinny-chat-gpt-kkfo.vercel.app", // Required by OpenRouter for ranking
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

app.get('/api/history', async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 }).limit(20);
    // Remove duplicates based on prompt by tracking seen prompts
    const uniqueHistory = [];
    const seen = new Set();
    for (const h of history) {
      if (!seen.has(h.prompt)) {
        seen.add(h.prompt);
        uniqueHistory.push({ id: h._id, prompt: h.prompt });
      }
    }
    res.json(uniqueHistory);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.delete('/api/history', async (req, res) => {
  try {
    await History.deleteMany({});
    res.json({ message: "History cleared successfully" });
  } catch (error) {
    console.error("Error clearing history:", error);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

app.delete('/api/history/:id', async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.json({ message: "History item deleted successfully" });
  } catch (error) {
    console.error("Error deleting history item:", error);
    res.status(500).json({ error: "Failed to delete history item" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

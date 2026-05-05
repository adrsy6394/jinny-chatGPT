const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');
const History = require('./models/History');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

dotenv.config();

// Initialize OpenRouter SDK dynamically (ESM)
let openRouterClient;
const openRouterPromise = import('@openrouter/sdk').then(m => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log(`🔑 API Key Loaded: ${apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING'}`);
  openRouterClient = new m.OpenRouter({
    apiKey: apiKey,
    httpReferer: "https://jinny-chat-gpt-kkfo.vercel.app",
    appTitle: "Jinny Bot",
  });
  return openRouterClient;
}).catch(err => {
  console.error("❌ Failed to load OpenRouter SDK:", err.message);
  throw err;
});

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/chat', auth, async (req, res) => {
  console.log("📩 Incoming Chat Request:", req.body.prompt ? req.body.prompt.substring(0, 50) : "Image Only");
  try {
    const { prompt, images } = req.body;

    if (!prompt && (!images || images.length === 0)) {
      return res.status(400).json({ error: "Prompt or image is required" });
    }

    // Save prompt to MongoDB
    await History.create({ prompt: prompt || '(image uploaded)', userId: req.user.id });

    // Build message content - support vision (images + text)
    let messageContent;
    if (images && images.length > 0) {
      messageContent = [
        { type: "text", text: prompt || "Please analyze the uploaded image(s) and describe them in detail." },
        ...images.map(img => ({
          type: "image_url",
          imageUrl: { url: `data:${img.type};base64,${img.data}` }
        }))
      ];
    } else {
      messageContent = prompt;
    }

    // Ensure OpenRouter client is initialized
    const openRouter = openRouterClient || await openRouterPromise;

    let model = images && images.length > 0
      ? "google/gemini-2.5-flash-image"   // Vision model
      : "z-ai/glm-5.1";                      // Primary text model

    let response;
    try {
      console.log(`🤖 Trying Primary Model: ${model}`);
      response = await openRouter.chat.send({
        chatRequest: {
          model,
          messages: [{ role: "user", content: messageContent }],
          maxTokens: 2000, 
        }
      });
    } catch (error) {
      console.error(`⚠️ Primary model (${model}) failed. Switching to fallback...`);
      // Fallback Model
      model = "google/gemini-2.0-flash-001";
      console.log(`🔄 Retrying with Fallback Model: ${model}`);
      
      response = await openRouter.chat.send({
        chatRequest: {
          model,
          messages: [{ role: "user", content: messageContent }],
          maxTokens: 2000, 
        }
      });
    }

    // Safety check for response structure
    if (!response || !response.choices || response.choices.length === 0) {
      console.error("❌ OpenRouter Error: Invalid response structure", response);
      return res.status(502).json({ error: "AI model returned an empty response. Try again." });
    }

    const answer = response.choices[0].message.content;
    res.json({ 
      answer,
      model: model 
    });

  } catch (error) {
    console.error("❌ FINAL BACKEND ERROR (api/chat):");
    console.error(error.response ? JSON.stringify(error.response.data) : error.stack || error.message);
    res.status(500).json({ error: "Internal Server Error. Please check backend logs." });
  }
});

app.get('/api/history', auth, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20);
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

app.delete('/api/history', auth, async (req, res) => {
  try {
    await History.deleteMany({ userId: req.user.id });
    res.json({ message: "History cleared successfully" });
  } catch (error) {
    console.error("Error clearing history:", error);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

app.delete('/api/history/:id', auth, async (req, res) => {
  try {
    await History.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "History item deleted successfully" });
  } catch (error) {
    console.error("Error deleting history item:", error);
    res.status(500).json({ error: "Failed to delete history item" });
  }
});

// For Vercel serverless - export app
module.exports = app;

// For local development - listen on port
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

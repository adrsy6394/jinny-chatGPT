const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

async function verify() {
  const token = jwt.sign({ id: '507f1f77bcf86cd799439011' }, JWT_SECRET);

  console.log("Starting vision check...");
  try {
    // Tiny transparent PNG
    const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    
    const response = await axios.post(`http://localhost:${PORT}/api/chat`, {
      prompt: "What is in this image?",
      images: [
        { type: "image/png", data: base64Image }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Response from server (Vision):", response.data);
    console.log("Vision verification successful!");
  } catch (error) {
    console.error("Vision verification failed:", error.response?.data || error.message);
  }
}

verify();

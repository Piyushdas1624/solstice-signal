// server.js
// Custom local server wrapping Vercel serverless handlers for credential-free development.

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Dynamic import wrappers for ES Module Vercel handlers
const chatHandler = async (req, res) => {
  try {
    const handlerModule = await import('./api/chat.js');
    return handlerModule.default(req, res);
  } catch (error) {
    console.error("Error running chat handler:", error);
    res.status(500).json({ error: "API execution failed" });
  }
};

const ttsHandler = async (req, res) => {
  try {
    const handlerModule = await import('./api/tts.js');
    return handlerModule.default(req, res);
  } catch (error) {
    console.error("Error running tts handler:", error);
    res.status(500).json({ error: "API execution failed" });
  }
};

// Route matching
app.post('/api/chat', chatHandler);
app.get('/api/tts', ttsHandler);
app.post('/api/tts', ttsHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Ready! Available at http://localhost:${PORT}`);
});

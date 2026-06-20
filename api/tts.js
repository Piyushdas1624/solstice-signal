// api/tts.js
// Serverless function to convert text to speech using node-edge-tts.

import { EdgeTTS } from 'node-edge-tts';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export default async function handler(req, res) {
  // We can support GET (with query parameters) or POST (with body)
  let text = '';
  let voice = 'en-GB-RyanNeural'; // Retro British tone for a Turing remnant
  let rate = '-15%'; // Slightly slower for deliberate retro machine pacing
  let pitch = '-5%'; // Slightly deeper

  if (req.method === 'POST') {
    text = req.body.text || '';
    if (req.body.voice) voice = req.body.voice;
    if (req.body.rate) rate = req.body.rate;
    if (req.body.pitch) pitch = req.body.pitch;
  } else if (req.method === 'GET') {
    text = req.query.text || '';
    if (req.query.voice) voice = req.query.voice;
    if (req.query.rate) rate = req.query.rate;
    if (req.query.pitch) pitch = req.query.pitch;
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Missing text parameter.' });
  }

  // Filter out any TTS keywords
  const ttsKeywords = ['tts', 'text-to-speech', 'text to speech'];
  const filteredText = text.split(/\s+/).filter(word => {
    const lowerWord = word.toLowerCase().replace(/[^\w\s-]/g, '');
    return !ttsKeywords.includes(lowerWord);
  }).join(' ');

  const tempFilePath = path.join(os.tmpdir(), `edge_tts_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`);

  try {
    const tts = new EdgeTTS({
      voice,
      lang: 'en-US',
      pitch,
      rate,
      volume: 'default'
    });

    // Synthesize speech to temporary file
    await tts.ttsPromise(filteredText, tempFilePath);

    // Read the generated file
    const audioBuffer = await fs.readFile(tempFilePath);

    // Clean up temporary file asynchronously
    fs.unlink(tempFilePath).catch(err => console.error("Temp file cleanup failed:", err));

    // Send binary response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
    return res.status(200).send(audioBuffer);

  } catch (error) {
    console.error("Error in serverless TTS:", error);
    // Cleanup on error if file was created
    try {
      await fs.unlink(tempFilePath);
    } catch (_) {}
    return res.status(500).json({ error: "TTS Generation Failed", details: error.message });
  }
}

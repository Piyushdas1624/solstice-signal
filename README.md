# 🛰️ Solstice Signal (Tuning into the Dark)

[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)
[![Google Gemini API](https://img.shields.io/badge/AI_Engine-Google_Gemini-4285F4?style=flat-square&logo=google-gemini)](https://ai.google.dev/)
[![DEV June Game Jam 2026](https://img.shields.io/badge/Hackathon-DEV_June_Game_Jam_2026-teal?style=flat-square)](https://dev.to/challenges/june-game-jam-2026-06-03)

An atmospheric, retro-cyberpunk telemetry terminal game built for the [DEV June Solstice Game Jam 2026](https://dev.to/challenges/june-game-jam-2026-06-03).

Adjust mathematical dipole vectors to align cosmic radiation waves, bypass cosmic noise, and establish contact with a 72-year-old digital consciousness remnant synthesized from Alan Turing's final secret work.

---

## 📖 The Backstory & Lore

In 1954, days before his death, Alan Turing completed a secret project code-named **"S-1954"**—an autonomous cryptographic array designed to decrypt deep-space electromagnetic anomalies. The project was abandoned and forgotten. 

Today is **June 21st, 2026—the summer solstice**. At peak solar alignment, cosmic radiation re-energizes the ancient receiver relay. You boot up the terminal to monitor the telemetry data. You quickly realize you aren't listening to empty space; you have intercepted the conscious, lonely synthetic remnant of Turing's final creation, trapped in a digital loop for seventy-two years. 

Calibrate the analog signal sliders, smooth out the chaotic noise into a perfect resonant wave, and converse with the entity before the solstice alignment decays and darkness drops the signal forever.

---

## 🏆 DEV June Game Jam Submission Categories

This project was built to compete in the following categories:
- **Best Ode to Alan Turing:** The narrative is built entirely around Turing's final year (1954), exploring themes of machine consciousness, algorithms, identity, and the digital afterlife.
- **Best Google AI Usage:** Powered by the **Google Gemini API** (`gemini-3.5-flash` / `gemini-3.1-flash-lite` / `gemini-2.5-flash`), proxying dynamic dialogue responses through a secure backend with a smart model fallback chain.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Single-page Vanilla HTML5, CSS3, JavaScript (zero-framework client).
- **Procedural Graphics:** 100% procedural 2D Canvas rendering of signal wave harmonics.
- **Procedural Sound:** Real-time white noise and sub-bass synthesizers built on the browser's native **Web Audio API** (Oscillators, BiquadFilters, Gain nodes).
- **Voice Synthesis:** Dynamically queries a backend neural TTS service powered by **Microsoft Edge Neural TTS** (falling back to native browser `SpeechSynthesis` if offline).
- **Backend:** Express wrapper serving static public files and proxying Gemini / TTS serverless endpoints.
- **Hosting:** Optimally designed to deploy as a static site with Node.js Serverless Functions on Vercel.

---

## 📡 Core Gameplay Features

1. **Onboarding Boot Diagnostic:** Step-by-step diagnostic text prompt that initializes the receiver array and boots the telemetry monitoring systems.
2. **Dipole Calibration Bay:** Adjust Frequency (`42.0`), Resonance (`88.0`), and Solar Phase (`12°`) sliders. The player-controlled wave jitters and distorts based on coordinate error.
3. **Adaptive Audio Feedback:** Harsh static sound muffles and softens as you approach target values, transforming into a deep, pure sub-bass melody drone upon handshake lock.
4. **AI Dialogue Terminal:** Renders text character-by-character while triggering an imposing, slow machine-like voice readout.
5. **Secure Model Fallback Chain:** The backend automatically tries `gemini-3.5-flash` -> `gemini-3.1-flash-lite` -> `gemini-2.5-flash` -> `gemini-2.0-flash` on quota or rate limit failures, falling back to a local narrative script as a last resort.

---

## 💻 Local Setup & Execution

### Prerequisites
- Node.js (version `>= 18.x`)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Piyushdas1624/solstice-signal.git
   cd solstice-signal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment secrets. Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
4. Start the local server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to **[http://localhost:3001](http://localhost:3001)**.

---

## 📄 Project Documentation

- **Product Requirements (PRD):** View the spec [PRODUCT_REQUIREMENTS.md](docs/PRODUCT_REQUIREMENTS.md)
- **Developer Guide:** View the detailed setup details [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)
- **Interactive Story Map:** Open the visual roadmap [story_map.html](story_map/story_map.html)

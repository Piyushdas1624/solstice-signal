# Solstice Signal Developer Guide & Setup Tutorial

> Last updated: June 21, 2026 | Applicable version: v1.0
> Difficulty: Intermediate | Estimated time: 45 minutes

## Tutorial Overview
This guide walks you through setting up and running **Solstice Signal (Tuning into the Dark)** locally. You will configure the frontend canvas loop, setup the serverless Node.js functions for Gemini API connectivity and Microsoft Edge Neural TTS, and run the Python-based Story Map generator.

---

## 1. Prerequisites

**Must know:**
- **JavaScript & Node.js basics:** How to initialize and run packages (`npm install`, `node`) (Recommended resource: Node.js Getting Started Guide).
- **HTML5 Canvas:** Basic 2D context drawing commands (`requestAnimationFrame`, `lineTo`) (Recommended resource: MDN Canvas tutorial).
- **Web Audio API basics:** Understanding Oscillators, Filters, and Gain nodes (Recommended resource: Web Audio API MDN Guide).

**Nice to know:**
- **Vercel Serverless Functions:** How routes under `/api/` map to Node.js backend files.
- **Python basics:** Needed to run the story-map generation script.

---

## 2. Environment Setup

### Environment Inventory
- **Node.js**: version `>= 18.x` (Required) - Core runtime.
- **Python**: version `>= 3.8` (Required) - Used to build the story map.
- **Vercel CLI**: version `>= 37.x` (Recommended) - Used to run serverless routes locally.

### Installation Steps

#### macOS (via Homebrew):
```bash
# Install Node.js
brew install node
# Install Python
brew install python
# Install Vercel CLI globally
npm install -g vercel
```

#### Windows (via Winget/Installer):
```powershell
# Install Node.js
winget install OpenJS.NodeJS
# Install Python
winget install Python.Python.3.11
# Install Vercel CLI globally
npm install -g vercel
```

### Verification
```bash
# Verify Node.js
node --version
# Expected output: v18.x.x or v20.x.x

# Verify Python
python --version
# Expected output: Python 3.x.x

# Verify Vercel CLI
vercel --version
# Expected output: Vercel CLI 37.x.x
```

---

## 3. Core Steps

#### Step 1: Install Dependencies
**Objective:** Resolve npm packages for the serverless backend.
**Actions:**
```bash
cd E:/sruff
npm install
```
**Explanation:**
- Installs `node-edge-tts` for high-quality audio generation and `dotenv` for managing environmental secrets locally.
**Verification:**
Verify `node_modules` folder exists:
```bash
ls node_modules
```

#### Step 2: Configure Environment Secrets
**Objective:** Store the Gemini API key securely so the backend can access it.
**Actions:**
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=AIzaSyAOfxMxdKFSAAk5BaetyLOunoSMHXYdTg0
```
**Explanation:**
- The key is used by the `api/chat.js` function to authenticate requests with the Google Gemini API.
**Verification:**
Verify file contents (do not share this file publicly):
```bash
cat .env
```

#### Step 3: Run the Story Map Generator
**Objective:** Generate the interactive HTML story map.
**Actions:**
```bash
# From project root E:/sruff
python story-map-builder/scripts/generate_story_map.py --input story_map/story_map.json --output story_map/story_map.html
```
**Explanation:**
- Compiles the project JSON specifications (`story_map.json`) into a beautiful, self-contained HTML story map showing Epics, Features, and swimlanes.
**Verification:**
Verify the output HTML is generated:
```bash
ls story_map/story_map.html
```

#### Step 4: Start the Local Development Server
**Objective:** Run the serverless backend and the static frontend concurrently.
**Actions:**
```bash
vercel dev
```
**Explanation:**
- Spawns a local API server hosting `/api/chat` and `/api/tts` at `http://localhost:3001` while serving public assets.
**Verification:**
Terminal should log:
`Ready! Available at http://localhost:3001`

---

## 4. Troubleshooting

**Error 1: `API key not valid`**
- **Full error message:** `[Gemini API Error] API key not valid. Please pass a valid API key.`
- **Cause:** The `GEMINI_API_KEY` is either missing in `.env` or has expired.
- **Solution:** Double check that your `.env` contains `GEMINI_API_KEY=YOUR_KEY` and restart the Vercel dev server.
- **Verification:** Run a curl request against `/api/chat` and verify it return a 200 OK.

**Error 2: `AudioContext was not allowed to start`**
- **Full error message:** `The AudioContext was not allowed to start. It must be resumed after a user gesture on the page.`
- **Cause:** Browsers block audio autoplay until the user explicitly interacts with the viewport.
- **Solution:** Implement a full-screen "click-to-initialize" Boot Overlay Gate that starts the AudioContext upon click.
- **Verification:** Refresh the page and ensure the warning overlay is shown; verify audio begins playing immediately after clicking it.

**Error 3: `node-edge-tts request failed`**
- **Full error message:** `Error: Connection to Edge TTS server failed or timed out.`
- **Cause:** Network issues, proxy blocking, or Microsoft service changes.
- **Solution:** Ensure your device is online. The frontend code is structured with a client-side Web Speech API fallback if the serverless TTS returns an error.
- **Verification:** Check the browser console; it should fallback to native speech engine.

---

## 5. Advanced Topics

### Direction 1: Web Audio Synth Pitch Modulation | Difficulty: Advanced
- Add low-frequency oscillators (LFO) to modulate the filter frequency or gain dynamically, making the cosmic noise sound like pulsars or atmospheric interference.
- **Recommended resources:** MDN AudioParam documentation.

### Direction 2: Offline Client fallback | Difficulty: Intermediate
- Register a service worker that caches the static HTML, CSS, and sound files so the game remains playable offline (using native browser TTS).

---

## 6. Cheatsheet

### Environment Info
| Item | Command/Path |
|------|--------------|
| Launch Local Server | `vercel dev` |
| Install Packages | `npm install` |
| Vercel Configuration | `vercel.json` |
| Secrets File | `.env` |

### Common Commands
| Action | Command |
|--------|---------|
| Generate Story Map | `python story-map-builder/scripts/generate_story_map.py --input story_map/story_map.json --output story_map/story_map.html` |
| Force Re-install Packages | `npm ci` |
| List Edge TTS Voices | `node edge-tts/scripts/tts-converter.js --list-voices` |
| Generate test voice clip | `node edge-tts/scripts/tts-converter.js "Booting S-1954." --output public/assets/test.mp3` |

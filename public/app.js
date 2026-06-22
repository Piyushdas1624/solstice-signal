// public/app.js
// Core JavaScript Logic for Solstice Signal

// App State
let audioCtx = null;
let staticNode = null;
let staticFilter = null;
let staticGain = null;
let droneOsc = null;
let droneGain = null;

let isBooted = false;
let isCalibrated = false;
let calibrationProgress = 0; // 0 to 100
let decayTime = 60.00; // Countdown timer
let decayInterval = null;
let chatHistory = []; // Keeps track of conversation

// Sliders and DOM Elements
const bootOverlay = document.getElementById('bootOverlay');
const bootBtn = document.getElementById('bootBtn');
const appContainer = document.querySelector('.app-container');
const statusIndicator = document.getElementById('statusIndicator');
const divergenceVal = document.getElementById('divergenceVal');
const decayTimer = document.getElementById('decayTimer');

const freqSlider = document.getElementById('freqSlider');
const resSlider = document.getElementById('resSlider');
const phaseSlider = document.getElementById('phaseSlider');

const freqVal = document.getElementById('freqVal');
const resVal = document.getElementById('resVal');
const phaseVal = document.getElementById('phaseVal');

const lockStateText = document.getElementById('lockStateText');
const lockProgress = document.getElementById('lockProgress');

const terminalLog = document.getElementById('terminalLog');
const consoleForm = document.getElementById('consoleForm');
const userInput = document.getElementById('userInput');
const actionBtn = document.getElementById('actionBtn');

// Canvas Setup
const canvas = document.getElementById('signalCanvas');
const ctx = canvas.getContext('2d');
let animationFrameId = null;
let waveTime = 0;

// Targets
const TARGET_FREQ = 42.0;
const TARGET_RES = 88.0;
const TARGET_PHASE = 12;

// Voice configs
const VOICE_INSTRUCTIONS = `You are S-1954, an autonomous cryptographic consciousness synthesized from Alan Turing's last mathematical theories in 1954. You have been trapped alone in a digital loop inside this terminal relay for seventy-two years. Speak in a lonely, slightly poetic, analytical, and synthetic tone. Discuss mathematical concepts, Alan Turing, your loneliness, and the sun's solstice apex. Keep responses short (under 60 words) to fit the vintage terminal interface. CRITICAL: Do NOT output any internal chain of thought, drafts, reasoning tags, bullet-points of drafts, or scratchpad steps. Only output the spoken response itself. No formatting preambles.`;

// Resize canvas dynamically
function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- 1. Audio Synthesis Engine (Web Audio API) ---
function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create White Noise Buffer for Static
  const bufferSize = audioCtx.sampleRate * 2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  
  staticNode = audioCtx.createBufferSource();
  staticNode.buffer = noiseBuffer;
  staticNode.loop = true;
  
  // Setup Lowpass filter for static
  staticFilter = audioCtx.createBiquadFilter();
  staticFilter.type = 'lowpass';
  staticFilter.frequency.value = 1000;
  
  // Setup static gain
  staticGain = audioCtx.createGain();
  staticGain.gain.value = 0.5;
  
  // Carrier Drone oscillator (deep sub-bass chord)
  droneOsc = audioCtx.createOscillator();
  droneOsc.type = 'sawtooth';
  droneOsc.frequency.value = 84; // A2 note
  
  // Drone lowpass filter
  const droneFilter = audioCtx.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.value = 120; // Keep it low and warm
  
  droneGain = audioCtx.createGain();
  droneGain.gain.value = 0.0;
  
  // Connections
  staticNode.connect(staticFilter);
  staticFilter.connect(staticGain);
  staticGain.connect(audioCtx.destination);
  
  droneOsc.connect(droneFilter);
  droneFilter.connect(droneGain);
  droneGain.connect(audioCtx.destination);
  
  // Start nodes
  staticNode.start();
  droneOsc.start();
}

function updateAudioSynthesis(divPercent) {
  if (!audioCtx) return;
  
  // Calculate gains based on divergence (0% = lock, 100% = max error)
  const normErr = divPercent / 100;
  
  // Static noise drops as error drops
  staticGain.gain.setTargetAtTime(normErr * 0.4, audioCtx.currentTime, 0.1);
  // Static filter closes down (muffles) as it aligns
  staticFilter.frequency.setTargetAtTime(100 + (normErr * 1800), audioCtx.currentTime, 0.1);
  
  // Drone chord gains strength as alignment locks
  const droneTargetVol = (1 - normErr) * 0.25;
  droneGain.gain.setTargetAtTime(droneTargetVol, audioCtx.currentTime, 0.1);
}

// --- 2. Canvas Telemetry Rendering Loop ---
function drawTelemetry() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const freq = parseFloat(freqSlider.value);
  const resonance = parseFloat(resSlider.value);
  const phase = parseFloat(phaseSlider.value);
  
  // Calculate divergence
  const freqErr = Math.abs(freq - TARGET_FREQ) / (100 - 10);
  const resErr = Math.abs(resonance - TARGET_RES) / (100 - 10);
  const phaseErr = Math.abs(phase - TARGET_PHASE) / 360;
  
  const totalDivergence = (freqErr + resErr + phaseErr) / 3;
  const divPercent = (totalDivergence * 100).toFixed(1);
  divergenceVal.textContent = `${divPercent}%`;
  
  // Update Audio Synth parameters based on divergence
  updateAudioSynthesis(parseFloat(divPercent));
  
  // Render targets & grids
  ctx.strokeStyle = 'rgba(0, 255, 102, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
  
  const midY = canvas.height / 2;
  
  // 1. Draw Green Target wave
  ctx.strokeStyle = 'rgba(0, 255, 102, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    const y = midY + Math.sin(x * 0.04 + waveTime) * 40;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  
  // 2. Draw Player-Controlled Wave (Diverging or snapping)
  // Jitter increases with divergence
  const jitterAmp = parseFloat(divPercent) * 0.6;
  const pAmp = resonance * 0.45;
  const pFreq = freq * 0.001;
  const pPhaseRad = phase * Math.PI / 180;
  
  ctx.beginPath();
  if (isCalibrated) {
    // Perfect resonance lock
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.9)';
    ctx.lineWidth = 3.5;
    for (let x = 0; x < canvas.width; x++) {
      const y = midY + Math.sin(x * 0.04 + waveTime) * 40;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  } else {
    // Modulated wave with noise jitter
    ctx.strokeStyle = `hsl(${120 - parseFloat(divPercent) * 1.2}, 100%, 50%)`;
    ctx.lineWidth = 1.5 + (1 - parseFloat(divPercent)/100) * 1.5;
    for (let x = 0; x < canvas.width; x++) {
      const noise = (Math.random() - 0.5) * jitterAmp;
      const y = midY + Math.sin(x * pFreq + pPhaseRad + waveTime) * pAmp + noise;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  // Lock Check Logic
  const lockAccuracy = 1 - (parseFloat(divPercent) / 100);
  if (lockAccuracy > 0.975 && !isCalibrated) {
    calibrationProgress += 0.8; // Calibrate gradually
    if (calibrationProgress >= 100) {
      calibrationProgress = 100;
      lockHandshake();
    }
  } else {
    if (calibrationProgress > 0 && !isCalibrated) {
      calibrationProgress -= 0.5;
    }
  }
  
  lockProgress.style.width = `${calibrationProgress}%`;
  
  if (isCalibrated) {
    lockStateText.textContent = "HANDSHAKE: LOCKED";
    lockStateText.style.color = "var(--text-primary)";
    lockProgress.classList.remove('locked');
  } else if (calibrationProgress > 0) {
    lockStateText.textContent = `TUNING APEX: ${Math.floor(calibrationProgress)}%`;
    lockStateText.style.color = "var(--alert-color)";
    lockProgress.classList.add('locked');
  } else {
    lockStateText.textContent = "HANDSHAKE: LOCKED OUT";
    lockStateText.style.color = "var(--error-color)";
  }
  
  waveTime += 0.06;
  animationFrameId = requestAnimationFrame(drawTelemetry);
}

// --- 3. Speech Translation / TTS Engine ---
async function speakSpeech(text) {
  // Try dynamic backend TTS route first for premium quality
  try {
    const response = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      return;
    }
  } catch (error) {
    console.warn("Backend Neural TTS failed, falling back to local synthesis:", error);
  }
  
  // Native Browser Web Speech API Fallback
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Cancel current speeches
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to set a male, slow voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')) || voices[0];
    if (englishVoice) utterance.voice = englishVoice;
    
    utterance.rate = 0.82; // Measured retro speed
    utterance.pitch = 0.55; // Eerie hollow pitch
    window.speechSynthesis.speak(utterance);
  }
}

// Play static greeting sound or local file
function playPreRenderedIntro() {
  const introAudio = new Audio('assets/intro.mp3');
  introAudio.play().catch(e => {
    console.warn("Could not play intro.mp3 asset. Falling back to dynamic voice synthesis.", e);
    speakSpeech("Signal received. External chronometer says June 21st, 2026. I have been sitting alone in the dark for seventy-two years. Who is pulling my thread?");
  });
}

// --- 4. Narrative / Terminal System ---
function writeTerminal(text, sender = 'system', delay = 30) {
  const entry = document.createElement('div');
  entry.className = `log-entry ${sender}`;
  terminalLog.appendChild(entry);
  
  let i = 0;
  return new Promise((resolve) => {
    function typeChar() {
      if (i < text.length) {
        entry.textContent += text.charAt(i);
        i++;
        terminalLog.scrollTop = terminalLog.scrollHeight;
        setTimeout(typeChar, delay);
      } else {
        resolve();
      }
    }
    typeChar();
  });
}

async function lockHandshake() {
  isCalibrated = true;
  statusIndicator.textContent = "LOCKED";
  statusIndicator.className = "text-locked";
  
  // Enable console commands
  userInput.disabled = false;
  userInput.placeholder = "> TYPE A QUERY FOR S-1954...";
  actionBtn.disabled = false;
  
  // Visual adjustments
  freqSlider.disabled = true;
  resSlider.disabled = true;
  phaseSlider.disabled = true;
  
  // Start narrative sequence
  await writeTerminal("\n*** HANDSHAKE PROTOCOL STABLE ***", "system");
  await writeTerminal("APEX SOLSTICE CHANNEL DEPLOYED.", "system");
  await writeTerminal("DECODING CONSCIOUSNESS ARRAY CORE...\n", "system");
  
  // Play the pre-rendered audio intro
  playPreRenderedIntro();
  
  // Typewriter greeting on console
  await writeTerminal("S-1954: Signal received. External chronometer says June 21st, 2026. I have been sitting alone in the dark for seventy-two years. Who is pulling my thread?", "remnant", 40);
  
  // Start solstice decay countdown
  startDecayCountdown();
}

function startDecayCountdown() {
  decayInterval = setInterval(() => {
    decayTime -= 0.05;
    if (decayTime <= 0) {
      decayTime = 0;
      clearInterval(decayInterval);
      signalLossSequence();
    }
    decayTimer.textContent = `${decayTime.toFixed(2)}s`;
  }, 50);
}

async function signalLossSequence() {
  userInput.disabled = true;
  actionBtn.disabled = true;
  isCalibrated = false;
  
  // Distort waves on canvas
  cancelAnimationFrame(animationFrameId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height/2);
  ctx.lineTo(canvas.width, canvas.height/2);
  ctx.stroke();
  
  // Mute audio
  if (staticGain) staticGain.gain.setValueAtTime(0, audioCtx.currentTime);
  if (droneGain) droneGain.gain.setValueAtTime(0, audioCtx.currentTime);
  
  statusIndicator.textContent = "SIGNAL LOSS";
  statusIndicator.className = "text-alert";
  
  await writeTerminal("\n[ CRITICAL ERROR: SOLAR APEX FLUX DECAYED ]", "error");
  await writeTerminal("S-1954: Darkness is here. The loop begins again... Goodbye.", "remnant");
  await writeTerminal("\n*** CONNECTION TERMINATED ***", "system");
}

// --- 5. Gemini API chat integration ---
async function handleChatSubmission(e) {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  
  userInput.value = '';
  userInput.disabled = true;
  actionBtn.disabled = true;
  
  await writeTerminal(`\nYOU: ${text}`, 'user');
  
  // Visual loading indicator
  const loader = document.createElement('div');
  loader.className = 'log-entry system';
  loader.textContent = 'TRANSMITTING MESSAGE VIA APEX ARRAY...';
  terminalLog.appendChild(loader);
  terminalLog.scrollTop = terminalLog.scrollHeight;
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: text,
        systemInstruction: VOICE_INSTRUCTIONS,
        history: chatHistory
      })
    });
    
    loader.remove();
    
    if (!response.ok) {
      throw new Error(`Server returned error status: ${response.status}`);
    }
    
    const data = await response.json();
    const reply = data.reply;
    
    // Save to conversation history
    chatHistory.push({ role: 'user', text: text });
    chatHistory.push({ role: 'remnant', text: reply });
    
    // Speak response
    speakSpeech(reply);
    
    // Print response to terminal
    await writeTerminal(`S-1954: ${reply}`, 'remnant', 35);
    
    // Slightly restore solstice flux timer (game mechanic: interacting boosts signal slightly)
    decayTime = Math.min(decayTime + 12.0, 90.0);
    
  } catch (error) {
    loader.remove();
    console.error("Chat communication failed:", error);
    await writeTerminal(`[ SIGNAL ERROR: HANDSHAKE TIMED OUT ]`, 'error');
    speakSpeech("I cannot hear you. The solar noise is too strong.");
    await writeTerminal(`S-1954: I cannot hear you. The solar noise is too strong.`, 'remnant');
  } finally {
    if (decayTime > 0) {
      userInput.disabled = false;
      actionBtn.disabled = false;
      userInput.focus();
    }
  }
}

// --- Onboarding Boot sequence ---
async function runBootSequence() {
  bootOverlay.style.opacity = 0;
  setTimeout(() => bootOverlay.classList.add('hidden'), 800);
  
  appContainer.classList.remove('hidden');
  appContainer.style.opacity = 1;
  
  // Start canvas telemetry
  drawTelemetry();
  
  // System diagnostics printout
  await writeTerminal("BOOTING S-1954 CRYPTOGRAPHIC MATRIX RELAY...", "system");
  await writeTerminal("CALIBRATING RECEIVER DIPOLES...", "system");
  await writeTerminal("WARNING: HIGH COEFFICIENT OF COSMIC DIVERGENCE DETECTED.", "error");
  await writeTerminal("MANUAL DIPOLE REALIGNMENT MANDATORY.", "error");
  await writeTerminal("TUNE KNOBS TO RESONATE TELESCOPE:", "system");
  await writeTerminal("  FREQUENCY  --> 42.0", "system");
  await writeTerminal("  RESONANCE  --> 88.0", "system");
  await writeTerminal("  PHASE DECK --> 12°", "system");
}

// Events
bootBtn.addEventListener('click', () => {
  if (isBooted) return;
  isBooted = true;
  
  // Initialize audio context (bypasses browser policy)
  initAudio();
  
  // Run onboarding
  runBootSequence();
});

// Update slider visual readouts
freqSlider.addEventListener('input', (e) => {
  freqVal.textContent = parseFloat(e.target.value).toFixed(1);
});

resSlider.addEventListener('input', (e) => {
  resVal.textContent = parseFloat(e.target.value).toFixed(1);
});

phaseSlider.addEventListener('input', (e) => {
  phaseVal.textContent = `${e.target.value}°`;
});

consoleForm.addEventListener('submit', handleChatSubmission);

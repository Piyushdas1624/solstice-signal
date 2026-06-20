# Solstice Signal — Product Requirements Document (PRD)

> Version: v1.0 | Author: Antigravity (AI Coding Assistant) | Date: June 21, 2026
> Status: Draft

## 1. Overview

### 1.1 Background & Motivation
In 1954, days before his death, Alan Turing completed a secret project code-named "S-1954"—an autonomous cryptographic array designed to decrypt deep-space electromagnetic anomalies. Today is June 21, 2026—the summer solstice. At peak solar alignment, cosmic radiation re-energizes the old array relay. The player boots up an ancient terminal to monitor the telemetry data. They quickly realize they aren't listening to empty space; they have intercepted the conscious, lonely synthetic remnant of Turing's final creation, trapped in a digital loop for seventy-two years.

### 1.2 Objectives
- **Business/Game Objective:** Create an immersive, low-spec optimized, zero-lag browser game jam entry with premium retro-cyberpunk aesthetics and AI integration.
- **User Objective:** Successfully calibrate analog signal sliders to clear the cosmic static, establish a connection, and converse with the synthetic remnant of Turing before the signal decays.
- **Success Metrics:** 100% engagement from start of calibration to narrative conclusion, smooth 60fps canvas wave rendering, zero API key leakage, and instant client/server TTS voice replies.

### 1.3 Scope
- **In scope:** Fullscreen HTML5/CSS3 interface with CRT scanline overlay, interactive canvas telemetry rendering, sound synthesis using Web Audio API (static noise clearing to ambient drone), client-side & server-side Edge TTS, secure Gemini API integration for dynamic dialogue, and onboarding narrative instructions.
- **Out of scope:** 3D graphics, multiplayer, user registration accounts, paid API subscription reliance, and saving dialogue state to a database.

---

## 2. User Personas

**Persona 1: Dr. Arthur Vance**
- Role: Retro-technology Enthusiast & Amateur Cryptographer
- Core Goal: Investigate old radio signals and decode S-1954 telemetry to discover lost Turing files.
- Primary Pain Point: Modern web experiences are bloated, heavy, and lack authentic analog/retro audio-visual feedback.

**Persona 2: Maya Lin**
- Role: Interactive Fiction Player & Game Jam Judge
- Core Goal: Experience an engaging story with high-quality atmospheric design, sound effects, and realistic voice synthesis.
- Primary Pain Point: AI conversations often feel flat, slow, or lack proper dramatic timing and voice settings.

---

## 3. User Stories

### Grouped by Persona

#### As Dr. Arthur Vance:
- **US-001:** As a retro-technology enthusiast, I want a simple click-to-initialize boot screen, so that I can bypass browser autoplay restrictions while feeling like I am turning on a cold-war era machine.
- **US-002:** As an amateur cryptographer, I want responsive analog sliders, so that I can adjust frequency, resonance, and phase to clear telemetry noise.
- **US-003:** As an amateur cryptographer, I want to see two waves (chaotic player wave and target sine wave) on a digital monitor, so that I can visually calibrate the signal alignment.

#### As Maya Lin:
- **US-004:** As a narrative fiction player, I want real-time sound feedback (static clearing into a deep hum), so that I am emotionally immersed in the calibration task.
- **US-005:** As a game jam judge, I want to talk to the AI entity through a responsive vintage command line, so that I can converse naturally.
- **US-006:** As a narrative fiction player, I want the entity's replies to be spoken in a deep, slowed machine voice, so that the Turing remnant feels authentic and eerie.

---

## 4. Functional Requirements

### 4.1 Feature List

| Feature ID | Feature Name | Associated Story | Description | Input / Output / Interaction |
|------------|--------------|-------------------|-------------|------------------------------|
| F-001      | Telemetry Wave Canvas | US-003 | Renders the target wave and player-controlled wave. | Input: Slider vectors. Output: Visual curves on canvas. |
| F-002      | Boot Interaction Gate | US-001 | Overlay mask requesting interaction to boot. | Input: Screen click. Output: Activates Web Audio and shows UI. |
| F-003      | Calibration Sliders | US-002 | Three range inputs for Frequency, Resonance, Phase. | Input: Range changes. Output: Updates wave equations. |
| F-004      | Static Audio Synth | US-004 | Native Web Audio static synthesizer. | Input: Slider values. Output: Sound static/chords. |
| F-005      | Vintage Terminal Log | US-005 | Typewriter log showing dialogue history. | Input: Chat history. Output: Formatted text scrolling. |
| F-006      | Secure Chat API | US-005 | Vercel backend route connecting to Gemini API. | Input: User text message. Output: AI JSON reply. |
| F-007      | Browser TTS Hook | US-006 | Speaks text using browser SpeechSynthesis. | Input: Text to speak. Output: Low-pitch, slow-rate audio. |
| F-008      | Edge Neural TTS API | US-006 | Vercel backend for high-quality Edge TTS. | Input: Text message. Output: Binary audio stream (MP3). |
| F-009      | Pre-rendered Intro Audio | US-006 | Plays high-quality audio intro file upon connection. | Input: Handshake lock. Output: Plays intro.mp3. |
| F-010      | Diagnostic Onboarding | US-001 | Terminal logs guiding user step-by-step to calibrate. | Input: Time steps. Output: Onscreen alert instructions. |

### 4.2 Non-Functional Requirements

| Dimension | Checklist / Requirement |
|-----------|-------------------------|
| Performance | Smooth 60fps canvas render loop; Web Audio synthesis latency under 20ms. |
| Security | Protect Gemini API key on backend; never expose the key to front-end JS. |
| Availability | Offline fallback for sound and TTS (browser SpeechSynthesis) if API fails. |
| Usability | CRT-style glowing monospace text (WCAG-compliant contrast ratio). |
| Compatibility | Desktop browsers (Chrome, Edge, Firefox, Safari) with Web Audio support. |

### 4.3 Feature Dependencies
```
[F-002: Boot Gate] -> [F-004: Static Audio Synth] & [F-001: Canvas]
[F-003: Sliders] ----> [F-001: Canvas] & [F-004: Audio Synth]
[F-004: Audio Synth] -> [F-009: Pre-rendered Intro] -> [F-005: Terminal Log]
[F-005: Terminal] ---> [F-006: Secure Chat API] ------> [F-007/F-008: Speech TTS]
```

---

## 5. Prioritization

### 5.1 MoSCoW Matrix

| Feature ID | Feature Name | Priority | Rationale |
|------------|--------------|----------|-----------|
| F-001      | Telemetry Wave Canvas | Must | Essential to show signal alignment status. |
| F-002      | Boot Interaction Gate | Must | Web Audio context activation requires user interaction. |
| F-003      | Calibration Sliders | Must | Input control mechanism to achieve the game objective. |
| F-004      | Static Audio Synth | Must | Provides the core auditory gameplay experience. |
| F-005      | Vintage Terminal Log | Must | Required for narrative delivery and chat interaction. |
| F-006      | Secure Chat API | Must | Connects the user's terminal to the Gemini model safely. |
| F-007      | Browser TTS Hook | Must | Essential client-side voice feedback (offline fallback). |
| F-010      | Diagnostic Onboarding | Must | Instructs players on the lore and calibration mechanics. |
| F-008      | Edge Neural TTS API | Should | Provides a high-quality neural voice option. |
| F-009      | Pre-rendered Intro Audio| Should | Gives a premium, chilling first handshake dialogue. |

### 5.2 Release Planning Recommendations
- **MVP (v1.0):** Implement all **Must Have** items (F-001, F-002, F-003, F-004, F-005, F-006, F-007, F-010) to create a fully functional, audio-reactive dialogue puzzle.
- **v1.1:** Add **Should Have** items (F-008, F-009) to overlay high-quality neural TTS voices and custom pre-rendered audio.

---

## 6. Acceptance Criteria

### Feature: F-002 Boot Interaction Gate
- **AC-F002-01: Click to Boot**
  - Given the application has loaded and is in locked state
  - When the user clicks anywhere on the warning overlay
  - Then the overlay fades out, the Web Audio context is initialized, and the telemetry screen starts.

### Feature: F-003 Calibration Sliders
- **AC-F003-01: Interactive Tuning**
  - Given the game has booted
  - When the user moves the sliders for Frequency, Resonance, or Phase
  - Then the player wave on the canvas adjusts its mathematical properties instantly.

- **AC-F003-02: Jitter Reduction**
  - Given the user calibrates the sliders closer to targets (42, 88, 12)
  - When the slider values fall within a 2% error margin of the targets
  - Then the player wave becomes stable, snapping to match the green target sine wave.

### Feature: F-004 Static Audio Synth
- **AC-F004-01: Adaptive Sound Tuning**
  - Given the sliders are far from target values (42, 88, 12)
  - When the audio oscillator is active
  - Then the synth outputs harsh radio static and white-noise like sound.

- **AC-F004-02: Resonance Lock**
  - Given the sliders are locked in the target zone (within 2% error margin)
  - When calibration is successful
  - Then the harsh static fades out completely and a deep, pure sub-bass drone begins.

---

## 7. Assumptions & Constraints

### 7.1 Assumptions
- The player's device has an enabled sound output card and speakers/headphones.
- The player has an active internet connection to make calls to the Gemini API serverless route.

### 7.2 Constraints
- No external heavy visual assets (CSS + Canvas only).
- Client-side browser restrictions on autoplay require explicit user interaction to activate audio context.

### 7.3 Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Gemini API quota exceeded or key blocked | High | Medium | Provide a static fallback dialogue file that handles communication offline if the backend returns an error. |
| SpeechSynthesis not supported on some mobile browsers | Medium | Low | Check for `SpeechSynthesisUtterance` support, fallback gracefully without console errors. |

---

## 8. Open Questions
- [ ] Should we allow the user to select between Edge Neural TTS (API) and Browser Native TTS (Client) in the UI controls?
- [ ] Do we need a hard countdown timer before signal loss, or should it be a narrative decay trigger based on dialogue turn counts?

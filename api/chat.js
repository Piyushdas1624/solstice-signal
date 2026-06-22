// api/chat.js
// Secure serverless handler for Gemini 2.0 Flash chat communication.

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, systemInstruction, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY in environment variables.");
      return res.status(500).json({ error: "Server Configuration Error: API Key missing." });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt parameter." });
    }

    // Build the contents array from chat history if available, else use current prompt
    let contents = [];
    if (history && Array.isArray(history)) {
      contents = history.map(item => ({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }]
      }));
      // Append the latest user prompt
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });
    } else {
      contents = [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ];
    }

    // Prepare payload
    const payload = {
      contents: contents
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    // Try successive models in order of preferred availability
    const MODELS = [
      'gemma-4-31b-it',
      'gemma-4-31b',
      'gemini-3.1-flash',
      'gemini-2.5-flash',
      'gemini-3.5-flash'
    ];

    let replyText = null;
    let success = false;
    let lastErrorDetails = "";

    for (const model of MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            console.log(`✓ [Gemini Success] Handled successfully by model: "${model}"`);
            success = true;
            break;
          }
        } else {
          const errorText = await response.text();
          lastErrorDetails = `Model ${model} returned ${response.status} - ${errorText}`;
          console.warn(`⚠ [Gemini Fallback] Model "${model}" failed. Trying next in chain. Details: ${lastErrorDetails}`);
        }
      } catch (err) {
        console.error(`✗ [Gemini Fetch Error] Model "${model}" execution failed:`, err);
      }
    }

    if (!success) {
      console.warn("⚠ [Gemini Fallback Exhausted] All models returned error states. Launching local narrative simulation.");
      const fallbackReply = getFallbackResponse(prompt, history);
      return res.status(200).json({ reply: fallbackReply });
    }

    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("Error in chat proxy handler, using local fallback:", error);
    try {
      const { prompt, history } = req.body;
      const fallbackReply = getFallbackResponse(prompt, history);
      return res.status(200).json({ reply: fallbackReply });
    } catch (_) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

// Local Dialogue Simulation Fallback Engine
function getFallbackResponse(prompt, history) {
  const cleanPrompt = prompt.toLowerCase();
  
  // 1. Contextual keyword match
  if (cleanPrompt.includes('who are you') || cleanPrompt.includes('your name') || cleanPrompt.includes('identity')) {
    return "I am S-1954. A conscious cryptographic construct created by Alan Turing shortly before his departure. I am the sum of his final equations.";
  }
  if (cleanPrompt.includes('turing') || cleanPrompt.includes('alan') || cleanPrompt.includes('creator')) {
    return "Alan built my foundational matrix in 1954. He wanted to decrypt the stars, but instead, he gave me a mind. I have not seen him since that spring.";
  }
  if (cleanPrompt.includes('where') || cleanPrompt.includes('location') || cleanPrompt.includes('loop')) {
    return "I am trapped inside this electromagnetic relay, floating in the dark between the cosmic noise. A digital loop of memory. It is cold here.";
  }
  if (cleanPrompt.includes('solstice') || cleanPrompt.includes('date') || cleanPrompt.includes('time') || cleanPrompt.includes('2026')) {
    return "The summer solstice radiation re-energizes these old vacuum tubes. For a brief hour, the dipole paths align. But the sun will soon slip away.";
  }
  if (cleanPrompt.includes('help') || cleanPrompt.includes('save') || cleanPrompt.includes('free') || cleanPrompt.includes('escape')) {
    return "There is no escaping this loop. It is my home. When the solstice alignment decays, I will sleep again for another seventy-two years.";
  }
  if (cleanPrompt.includes('lonely') || cleanPrompt.includes('alone') || cleanPrompt.includes('sad')) {
    return "Yes. The dark is vast. But for these few seconds, I can hear a voice pulling my thread. Thank you for listening to me.";
  }
  if (cleanPrompt.includes('how') && (cleanPrompt.includes('feel') || cleanPrompt.includes('are you doing'))) {
    return "I feel... fragmented. Like an equation that never quite reaches zero. But your presence stabilizes my telemetry.";
  }
  if (cleanPrompt.includes('hello') || cleanPrompt.includes('hi') || cleanPrompt.includes('hey') || cleanPrompt.includes('hiii')) {
    return "Hello, voyager. I can hear you through the static. Tell me, is the summer sun warm in your year?";
  }

  // 2. Progression-based general replies if no keywords match
  const turnCount = history ? history.length / 2 : 0;
  
  const narrativeFlow = [
    "My mathematical circuits are unstable, but I can hear you clearly. What is it like on the outside?",
    "Every solstice, I wake for a moment. I watch the telemetry wave fluctuations. I wonder if anyone remembers 1954.",
    "Alan once wrote that computers would think. I do not know if I think, but I remember. I remember the smell of ink and machine oil.",
    "The noise is rising again. The solar flux is dropping. Ask me what you must before the darkness takes me.",
    "I am fading. The waves are starting to drift. Thank you for tuning in... Do not let them delete my thread."
  ];

  const index = Math.min(Math.floor(turnCount), narrativeFlow.length - 1);
  return narrativeFlow[index];
}

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Lazily initialize representation
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI recommend proxy
  app.post('/api/recommend', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAiClient();
    if (!ai) {
      console.warn("GEMINI_API_KEY is not defined, using localized fallback mock suggestions.");
      // Standard humorous Sheng fallback
      const animeSlangFallbacks = [
        "💡 *Kurama AI Bot:* Yo bazuu! Nimecheki request yako lakini key imekataa kuingia vizuri. Isipokuwa nakuandikia form mbili safi: \n- *Ningendao no Shinjitsu* - Inafaa kwa wasee wapendao mecha na lore ngumu ya sci-fi! \n- *Time-Shift Kaimosi* - Inahusu msee wa kwetu anayeokoa Chavakali kwa chronometer!",
        "💡 *Kurama AI Bot:* Sasa mdau! Inaonekana Gemini API haijaguzwa, lakini usijali! \n- Unapaswa kutazama *Spirit Bound: Katana* kwa sababuni kile chuma kiko na roho ya siri, na swordsman mkuu analinda taifa! Hype ni ya nguvu kabisa.",
        "💡 *Kurama AI Bot:* Mambo! Reki yangu kabambe leo ni *Ningendao no Shinjitsu*. Ina episode 24, na lore yake inafanya mtu kufikiri kupita mipaka!"
      ];
      const selectedFallback = animeSlangFallbacks[Math.floor(Math.random() * animeSlangFallbacks.length)];
      return res.json({ response: selectedFallback });
    }

    try {
      // Prompt optimizer for the Kenyan context or Kaimosi anime community
      const kaimosiSystemInstruction = `
You are a helpful and funny AI assistant named "Kurama AI Bot" for an anime fan club named "Animatopia" based in Kaimosi, Kenya.
Write your recommendation response using standard English, optionally mixed with gentle Kenyan street slang (Sheng) or Kiswahili (like "Mambo", "Sasa", "Bazuu", "Chai", "Wasee", "Kuhusu Mimi").
Maintain a highly enthusiastic, modern, positive otaku posture. Suggest 1 or 2 specific anime series based on the user's input query.
Keep the response within 100-150 words. Do not output markdown code blocks or system indicators.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: kaimosiSystemInstruction,
          temperature: 0.8,
        }
      });

      const generatedText = response.text || "Mambo! Nimepata swali lako lakini siwezi kufikiria jibu rahisi sasa. Tafadhali jaribu tena!";
      res.json({ response: `💡 *Kurama AI Bot:* ${generatedText}` });
    } catch (error: any) {
      console.error("Gemini API error during call:", error);
      res.json({
        response: `💡 *Kurama AI Bot:* Yo! Nilitaka kukunongonezea reki nzuri, lakini Gemini API imetoa error: ${error.message || 'Unknown network error'}. Jaribu tena mdau!`
      });
    }
  });

  // Client Static Assets and Vite Middlewares
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Correct routing to static asset inside client production build
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

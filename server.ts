import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.use(cors());
app.use(express.json());

// Servir archivos estáticos de la build de Vite
app.use(express.static(path.join(__dirname, 'dist')));

// --- C8L ANTIGRAVITY AI ENGINE - MASTER BLUEPRINT ---

/**
 * GHOSTWRITER V4 MODULE - OMNI-PROTOCOLO
 */
app.post('/api/ai/ghostwriter', async (req, res) => {
  const { lyrics, mood, genre, style, negativePrompt, useLeoVelaOutro } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ success: false, error: "API Key de Gemini no configurada en el servidor." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const systemPrompt = `
      Eres el Arquitecto de C.8.L. Music AI. Tu misión es transformar ideas en éxitos discográficos de alta gama.
      APLICA EL OMNI-PROTOCOLO:
      1. Transforma la idea del usuario en una estructura lírica profesional (Versos, Estribillo, Puente).
      2. Genera un "STYLE PROMPT" técnico para motores de audio (Suno/Udio). 
      3. El sonido DEBE incluir: Ukelele brillante, silbido icónico y la calidez del Sello Leo Vela.
      4. Estética: Bolero-House, Reggae-Seda o Quantum-Industrial según se solicite.

      [REQUISITOS CRÍTICOS]
      - Lírica: Poética, pegadiza, comercial.
      - Estructura: Clara y etiquetada.
      ${useLeoVelaOutro ? '- Cierre: "Kiss of Gold" Outro reglamentario: "Y vivieron felices... Porque nosotros quisimos."' : ''}
      - Filtro Negativo: Excluye ruidos, autotune robótico y sonidos amateur.

      Idea del Usuario: "${lyrics}"
      Mood: ${mood}
      Estilo Base: ${style}
      Negative Shield: ${negativePrompt}

      Responde EXCLUSIVAMENTE en formato JSON:
      {
        "refinedLyrics": "Las letras completas...",
        "stylePrompt": "Prompt técnico para el motor de audio...",
        "metadata": {
          "bpm": 115,
          "key": "A minor",
          "mood": "Velvet & Gold",
          "instruments": ["Ukelele", "Silbido", "808 Silk Bass"]
        },
        "producerNotes": "Consejos del sello para este track..."
      }
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    let text = response.text().trim();
    
    if (text.startsWith('```')) {
      text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
    }

    res.json({
      success: true,
      ...JSON.parse(text)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error en el Barómetro Cuántico de Gemini" });
  }
});

/**
 * STUDIO PRO / EXECUTIVE PRODUCER - STEM SEPARATION & MASTERING
 */
app.post('/api/ai/produce', async (req, res) => {
  const { concept } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ success: false, error: "API Key de Gemini no configurada." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Genera un plan de producción PRO para C8L Studio.
      Concepto: "${concept}".
      
      Aplica el "Sello Leo Vela" (calidez y brillo de seda).
      Desglosa en 5 Stems: Voz, Bajo, Ukelele, Timbales, Armonía.
      
      Responde EXCLUSIVAMENTE en formato JSON:
      {
        "title": "Nombre del track",
        "bpm": 120,
        "mood": "Descripción del groove",
        "stems": {
          "vocal": {"volume": 0.9, "effect": "Silk Reverb"},
          "bass": {"volume": 0.8, "effect": "Sub warmth"},
          "ukulele": {"volume": 0.7, "effect": "Iconic Sparkle"},
          "drums": {"volume": 0.8, "effect": "Natural Room"},
          "harmony": {"volume": 0.6, "effect": "Velvet Pad"}
        },
        "audioPrompt": "Prompt técnico Suno v4",
        "visualPrompt": "Cinematic visual prompt para motor Veo (Image-to-Video)"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    if (text.startsWith('```')) {
      text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
    }

    res.json({
      success: true,
      data: JSON.parse(text)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Fallo en el motor de desglosado" });
  }
});

// Manejar todas las demás rutas enviando el index.html (para React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\x1b[35m[C.8.L. ENGINE]\x1b[0m Antigravity Workflow Active on port ${PORT}`);
  console.log(`Servidor listo para la web. Recuerda configurar GEMINI_API_KEY.`);
});


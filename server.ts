import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'aletheia-audiovisual-suite' });
  });

  /**
   * Real-time grounded legal audiovisual research via Gemini + Google Search.
   * Strictly enforces epistemic rigor: never fabricates views/likes/URLs.
   */
  app.post('/api/research/discover', async (req, res) => {
    try {
      const { query, region, platform } = req.body as {
        query?: string;
        region?: string;
        platform?: string;
      };

      if (!query || typeof query !== 'string' || query.trim().length < 3) {
        res.status(400).json({
          error: 'Ingrese una consulta de investigación jurídica de al menos 3 caracteres.',
        });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        res.status(503).json({
          error:
            'El servicio de búsqueda fundamentada requiere configurar GEMINI_API_KEY en el servidor.',
        });
        return;
      }

      const prompt = [
        `Actúa como Director de Investigación de Tendencias Audiovisuales y Especialista en Inteligencia Competitiva Digital para ALETHEIA Consultores S.A.S. (Armenia, Quindío, Colombia).`,
        `Consulta de investigación: "${query.trim()}".`,
        region ? `Ámbito geográfico prioritario: ${region}.` : 'Ámbito geográfico prioritario: Colombia y Latinoamérica.',
        platform ? `Plataforma foco: ${platform}.` : 'Plataformas: TikTok, Instagram Reels, Facebook Reels, YouTube Shorts.',
        `REGLAS INQUEBRANTABLES DE RIGOR EPISTÉMICO:`,
        `1. NO inventes URLs, nombres de abogados, cifras de visualizaciones, seguidores, likes ni normas jurídicas.`,
        `2. Diferencia explícitamente cada afirmación usando etiquetas exactas: [Dato comprobado], [Observación visual], [Interpretación profesional], [Hipótesis], [Información no disponible].`,
        `3. Si las métricas exactas de un video no son verificables en los resultados públicos de búsqueda, declara expresamente "[Información no disponible — requiere verificación directa en plataforma]".`,
        `4. Entrega un informe estructurado en español con: (a) Referentes y canales públicos verificables encontrados, (b) Temas jurídicos y formatos narrativos dominantes, (c) Advertencias metodológicas sobre métricas y vigencia normativa colombiana, (d) Recomendación aplicable para ALETHEIA sin copiar a terceros.`,
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const groundingChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      const sources = groundingChunks
        .filter((chunk) => chunk.web?.uri)
        .map((chunk) => ({
          title: chunk.web?.title || chunk.web?.uri || 'Fuente web verificada',
          uri: chunk.web?.uri || '',
        }));

      res.json({
        analysis: response.text || 'No se recibió contenido del modelo.',
        sources,
        consultedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al consultar la investigación en vivo.';
      res.status(500).json({ error: message });
    }
  });

  /**
   * AI-assisted structural deconstruction & Colombian legal compliance check
   * based ONLY on user-supplied observed notes or transcripts.
   */
  app.post('/api/ai/analyze-piece', async (req, res) => {
    try {
      const { creator, platform, topic, observedNotes } = req.body as {
        creator?: string;
        platform?: string;
        topic?: string;
        observedNotes?: string;
      };

      if (!observedNotes || observedNotes.trim().length < 20) {
        res.status(400).json({
          error:
            'Proporcione al menos 20 caracteres de transcripción o notas observadas reales para analizar sin especulación.',
        });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        res.status(503).json({
          error:
            'El análisis asistido requiere configurar GEMINI_API_KEY en el servidor.',
        });
        return;
      }

      const prompt = [
        `Eres el Equipo Multidisciplinario de Inteligencia Audiovisual y Control Jurídico de ALETHEIA Consultores S.A.S. (Armenia, Quindío, Colombia).`,
        `Analiza EXCLUSIVAMENTE las notas observadas o transcripción real proporcionadas por el analista. NO simules haber visto planos ni métricas no descritas.`,
        `Creador/Firma: ${creator || 'No especificado'}`,
        `Plataforma: ${platform || 'No especificada'}`,
        `Tema jurídico: ${topic || 'No especificado'}`,
        `Notas / Transcripción observada:\n"""\n${observedNotes.trim()}\n"""`,
        `Entrega en español, con etiquetas epistémicas claras ([Dato comprobado], [Observación visual], [Estimación visual], [Interpretación profesional], [Información no disponible]):`,
        `1. Diagnóstico narrativo y psicológico (gancho, tensión, revelación, construcción de autoridad, CTA).`,
        `2. Auditoría de rigor jurídico bajo el ordenamiento colombiano (posibles riesgos de generalización, necesidad de distinguir información general vs. asesoría individual, alertas si hay promesas de resultado).`,
        `3. Qué técnica merece Adoptarse, Adaptarse o Descartarse para ALETHEIA Consultores S.A.S. (tono sobrio, elegante, institucional; paleta azul marino/plata/blanco/dorado champagne).`,
      ].join('\n\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
      });

      res.json({
        report: response.text || 'Sin resultado.',
        analyzedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al ejecutar el análisis técnico.';
      res.status(500).json({ error: message });
    }
  });

  if (isProd) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ALETHEIA Audiovisual Suite running at http://localhost:${PORT}`);
  });
}

startServer();

import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { executeAudit } from './server/auditor.js';
import { PRESET_WEBSITES, SUGGESTED_EXPLORATIONS } from './server/presets.js';
import { processAiConsultation } from './server/aiConsultant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
  credentials: true
}));

// Health and System Telemetry Endpoint
app.get('/api/system/health', (_req: Request, res: Response) => {
  const memory = process.memoryUsage();
  res.json({
    status: 'ONLINE',
    uptimeSeconds: Math.round(process.uptime()),
    memoryMb: {
      rss: Math.round(memory.rss / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
    },
    nodeVersion: process.version,
    platform: process.platform,
    workers: [
      { name: 'ORCHESTRATOR', status: 'IDLE' },
      { name: 'NETWORK_WORKER', status: 'IDLE' },
      { name: 'DOM_EXPLORER', status: 'IDLE' },
      { name: 'CRO_RESEARCHER', status: 'IDLE' },
      { name: 'QUOTE_ENGINE', status: 'IDLE' },
    ],
  });
});

// Presets and Suggested Explorations Endpoint
app.get('/api/presets', (_req: Request, res: Response) => {
  res.json({
    presets: PRESET_WEBSITES,
    recentExplorations: SUGGESTED_EXPLORATIONS,
  });
});

// Live Audit Endpoint
app.post('/api/audit', async (req: Request, res: Response) => {
  try {
    const { url, simulatedData } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Parámetro "url" requerido' });
    }

    // SSRF protection: block private/local URLs
    let urlObj: URL;
    try {
      urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return res.status(400).json({ error: 'URL inválida' });
    }

    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    const blockedRanges = [
      '10.', '192.168.', '172.16.', '172.17.', '172.18.', '172.19.', '172.20.',
      '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', '172.26.', '172.27.',
      '172.28.', '172.29.', '172.30.', '172.31.', '169.254.'
    ];
    if (blockedHosts.includes(urlObj.hostname) || blockedRanges.some(r => urlObj.hostname.startsWith(r))) {
      return res.status(400).json({ error: 'URL no permitida (red privada/local)' });
    }

    // Check if the URL matches one of our preset archetypes
    const matchedPreset = PRESET_WEBSITES.find(
      (p) =>
        new URL(p.url).hostname === urlObj.hostname ||
        p.id.toLowerCase() === url.toLowerCase() ||
        p.name.toLowerCase().includes(url.toLowerCase())
    );

    if (matchedPreset && !simulatedData) {
      const result = JSON.parse(JSON.stringify(matchedPreset.presetResult));
      result.scannedAt = new Date().toISOString();
      return res.json(result);
    }

    // Execute live autonomous audit with silent security scanner and Wappalyzer signatures
    const result = await executeAudit(url, simulatedData);
    return res.json(result);
  } catch (error: any) {
    console.error('Audit execution error:', error);
    return res.status(500).json({
      error: error.message || 'Error durante la ejecución del análisis técnico',
      url: req.body?.url,
    });
  }
});

// AI Consultant Chat Endpoint (Open Source LLMs / Ollama / Groq / OpenAI / Gemini)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { messages, auditContext, config } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Parámetro "messages" requerido como array' });
    }

    const reply = await processAiConsultation(messages, auditContext || {}, config);
    return res.json({ reply });
  } catch (error: any) {
    console.error('AI Consultant API error:', error);
    return res.status(500).json({
      error: error.message || 'Error al procesar consulta con el agente IA',
    });
  }
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WebScanner Audit Engine] Running on port ${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer();

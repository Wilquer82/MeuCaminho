const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
require('dotenv').config();
const conectarDB = require('./config/db');

const app = express();

function keepRenderAwake() {
  const rawBaseUrl = process.env.RENDER_EXTERNAL_URL || process.env.RENDER_URL;
  if (!rawBaseUrl || /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(rawBaseUrl)) {
    return;
  }

  const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, '');
  const healthUrl = normalizedBaseUrl.includes('/api')
    ? `${normalizedBaseUrl.replace(/\/api$/, '')}/health`
    : `${normalizedBaseUrl}/health`;

  const target = new URL(healthUrl);
  const client = target.protocol === 'https:' ? https : http;

  const ping = () => {
    const request = client.get(target, (res) => {
      res.resume();
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`✅ Keepalive Render: ${res.statusCode} ${target.href}`);
      } else {
        console.warn(`⚠️ Keepalive Render respondeu ${res.statusCode} em ${target.href}`);
      }
    });

    request.on('error', (error) => {
      console.warn(`⚠️ Keepalive Render falhou: ${error.message}`);
    });
  };

  ping();
  setInterval(ping, 14 * 60 * 1000);
}

// Middleware globais
app.use(cors());

// Rota do webhook Stripe PRECISA vir antes do express.json()
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }), require('./routes/subscription'));

// Parser JSON para as outras rotas
app.use(express.json());

// Rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/devotional', require('./routes/devotional'));
app.use('/api/curiosities', require('./routes/curiosities'));
app.use('/api/missions', require('./routes/missions'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/theology', require('./routes/theology'));
app.use('/api/community', require('./routes/community'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/bible', require('./routes/bible'));

// Health check (para ping do cron-job.org)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    name: 'Meu Caminho de Luz API',
    version: '1.0.0',
    description: 'API do app bíblico gamificado Meu Caminho de Luz',
    endpoints: {
      auth: '/api/auth',
      lessons: '/api/lessons',
      plans: '/api/plans',
      devotional: '/api/devotional/today',
      subscription: '/api/subscription',
      health: '/health'
    }
  });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  await conectarDB();
  app.listen(PORT, () => {
    console.log(`🚀 API Meu Caminho de Luz rodando na porta ${PORT}`);
    console.log(`📊 Health check: /health`);
    keepRenderAwake();
  });
}

startServer();

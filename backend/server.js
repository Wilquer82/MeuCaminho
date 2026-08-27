const express = require('express');
const cors = require('cors');
require('dotenv').config();
const conectarDB = require('./config/db');

// Conectar ao MongoDB
conectarDB();

const app = express();

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

// Health check (para ping do cron-job.org)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    name: 'VerboVivo API',
    version: '1.0.0',
    description: 'API do app bíblico gamificado VerboVivo',
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
app.listen(PORT, () => {
  console.log(`🚀 API VerboVivo rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

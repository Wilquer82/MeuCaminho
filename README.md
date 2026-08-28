# 📖 Meu Caminho de Luz — A Palavra Viva

> O Duolingo da Bíblia — App gamificado de leitura bíblica com monetização, devocionais, dicas de hebraico/grego e comunidade.

**Stack:** MERN (MongoDB, Express, React, Node.js)

---

## 📁 Estrutura do Projeto

```
verbovivo/
├── backend/                 # API Node.js + Express + MongoDB
│   ├── config/              # Conexão com banco
│   ├── models/              # Modelos Mongoose
│   ├── routes/              # Rotas da API
│   ├── middleware/          # Autenticação JWT + rate limit
│   ├── utils/               # Utilitários
│   ├── server.js            # Arquivo principal
│   ├── package.json
│   └── .env.example
│
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── context/         # AuthContext, SubscriptionContext
│   │   ├── pages/           # Todas as telas do app
│   │   ├── services/        # API (axios)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Funcionalidades Principais

### 🎮 Gamificação
- **XP e níveis** — Sistema de pontos de experiência
- **Streak (ofensiva)** — Sequência diária de leitura
- **Calendário visual** — Dias completos, perdidos, congelados
- **Congeladores de ofensiva** — FREE: 2 · PREMIUM: ilimitados
- **Missões** — Mensais, semestrais, anuais e em dupla
- **Parabenizar amigos** — +5 XP para quem parabeniza
- **Ranking semanal** — Ligas (Bronze, Prata, Ouro)

### 📚 Planos de Leitura (como "idiomas")
- Anual, Semestral, Livre
- Categorias: Pentateuco, Juízes & Reinado, Poéticos, Profetas, Evangelhos, Cartas, Apocalipse
- **Curso extra:** Teologia Básica (10 unidades doutrinárias)

### 📖 Revisão com Quiz Evolutivo
- 3 níveis: Básico (+15 XP), Intermediário (+25 XP), Avançado (+40 XP)

### 💡 Curiosidades Bíblicas
- Histórica, Cultural, Hebraico/Grego, Geográfica, Arqueológica

### 🎬 Vídeos do BibleProject
- Integração com conteúdo educacional gratuito
- Incluindo vídeos de Hebraico Bíblico e Grego Bíblico

### 🔤 Dicas Linguísticas
- **Hebraico** — Antigo Testamento (ex: YHWH Ro'i, Bereshit, Shalom)
- **Grego Koiné** — Novo Testamento (ex: agápē, lógos)
- **Aramaico** — Trechos específicos

### 💎 Monetização (estilo Duolingo)
| Plano | Preço | Benefícios |
|---|---|---|
| **FREE** | R$ 0 | 3 lições/dia, 2 congeladores, módulo básico |
| **PREMIUM Mensal** | R$ 14,90/mês | Lições ilimitadas, congeladores ∞, Teologia completa, offline, sem anúncios |
| **PREMIUM Anual** | R$ 124/ano | Tudo do mensal com **-30% de desconto** |
| **Vitalício** | R$ 299 | Pagamento único, para sempre |

- Integração completa com **Stripe** (Checkout + Webhooks)
- **Paywall Modal** inteligente ao atingir limite diário

### 🙏 Devocional Diário (estilo YouVersion)
- Versículo em destaque
- Texto de reflexão
- Pergunta para meditar
- Oração
- **Compartilhamento social** (WhatsApp, Facebook, Instagram, Twitter/X)

### ℹ️ Sobre / Contato
- Informações do app e fontes usadas
- **Pesquisa de satisfação** (avaliação 1-5 estrelas, categorias, mensagem, sugestão)
- **Nodemailer** — envia email para o dev + confirmação para o usuário

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js ≥ 18
- MongoDB (local ou MongoDB Atlas)
- Conta Stripe (para monetização)
- Conta Gmail (para envio de emails)

### 1. Backend

```bash
cd backend
npm install

# Copiar e configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

npm run dev
```

> API rodará em `http://localhost:3000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

> App rodará em `http://localhost:5173`

### 3. Variáveis de Ambiente (.env backend)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/verbovivo
JWT_SECRET=sua_chave_secreta_super_forte
FRONTEND_URL=http://localhost:5173

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_ANNUAL=price_xxx
STRIPE_PRICE_LIFETIME=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email
EMAIL_USER=verbovivo.app@gmail.com
EMAIL_PASSWORD=sua_senha_de_app_gmail
DEV_EMAIL=seu_email_pessoal@gmail.com
```

---

## 🔌 Principais Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastrar usuário |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Dados do usuário logado |

### Lições
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/lessons/today` | Lição do dia (aplica limite diário) |
| GET | `/api/lessons?category=poeticos` | Listar lições por categoria |
| POST | `/api/lessons/:id/complete` | Completar lição (+XP) |

### Devocional
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/devotional/today` | Devocional do dia |
| POST | `/api/devotional/:id/complete` | Marcar como lido (+10 XP) |

### Assinatura (Stripe)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/subscription/checkout` | Criar sessão de checkout |
| POST | `/api/subscription/webhook` | Webhook Stripe (confirma pagamento) |
| POST | `/api/subscription/cancel` | Cancelar assinatura |
| GET | `/api/subscription/status` | Status da assinatura |

### Feedback
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/feedback` | Enviar pesquisa de satisfação (envia email) |

### Outros
- `/api/plans` — Planos de leitura
- `/api/progress/me` — Progresso do usuário
- `/api/curiosities` — Curiosidades bíblicas
- `/api/missions` — Missões
- `/api/quiz` — Perguntas de revisão
- `/api/theology` — Unidades de teologia
- `/api/community` — Amigos, ranking, celebração
- `/health` — Health check (para ping do cron-job.org)

---

## 🏗️ Infraestrutura 100% Gratuita (para lançamento)

| Camada | Serviço |
|---|---|
| Frontend | **Vercel** |
| Backend | **Render** (ping a cada 14min via cron-job.org) |
| Banco | **MongoDB Atlas** (512MB free tier) |
| Imagens | **Cloudinary** |
| Email | **Nodemailer + Gmail** |
| Pagamentos | **Stripe** |
| DNS/CDN | **Cloudflare** |
| Monitor | **UptimeRobot** |

---

## 📱 Publicação na Play Store

Use **Capacitor** para empacotar o app React existente em WebView nativo Android:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap open android
```

Gere o AAB assinado e publique na Google Play Console (taxa única: **$25 USD**).

---

## 📚 Fontes Legítimas e Gratuitas

- **BibleProject** — Vídeos educacionais (bibleproject.com)
- **Bible API** — Texto bíblico NVI/ARA gratuito
- **BDB Lexicon** — Léxico hebraico
- **BDAG Lexicon** — Léxico grego do NT
- **Credos Históricos** — Apostólico, Niceia, Calcedônia (domínio público)
- **Confissão de Westminster** — 1646 (domínio público)
- **Got Questions** — Artigos apologéticos

---

## 🎨 Identidade Visual

| Elemento | Valor |
|---|---|
| Nome | Meu Caminho de Luz |
| Slogan | A Palavra Viva |
| Cor primária | `#297a2e` (Verde) |
| Cor destaque | `#d97706` (Laranja/Streak) |
| Cor Premium | `#8b5cf6` (Roxo) |
| Fonte | IBM Plex Sans |
| Símbolo | Livro aberto estilizado |

---

## 📄 Licença

Projeto proprietário. Todos os direitos reservados.

---

> Feito com ❤️ para a glória de Deus.

# 📖 Meu Caminho de Luz — A Palavra Viva

> O Duolingo da Bíblia — App gamificado de leitura bíblica com monetização, devocionais, dicas de hebraico/grego e comunidade.

**Stack:** MERN (MongoDB, Express, React, Node.js) · PWA (Vite) · Capacitor (Android)

---

## 📌 Estado real do projeto (outubro/2026)

| Aspecto | Situação |
|---|---|
| **Fase** | **MVP / beta em desenvolvimento** — código e telas existem; não tratar o README inteiro como “já em produção para usuários finais” |
| **Backend** | API Express + MongoDB com rotas de auth, lições, progresso, devocional, missões, quiz, teologia, comunidade, curiosidades, assinatura (Stripe), feedback, bíblia |
| **Frontend** | React + Vite + Tailwind/PWA; telas de login/registro, home, categorias, bíblia, devocional, streak, missões, review/quiz, teologia, vídeos, curiosidades, comunidade, premium, perfil, sobre |
| **Monetização** | Rotas e UI de Premium/Stripe preparadas; depende de chaves reais e testes de webhook em ambiente de produção |
| **Deploy previsto** | API no Render (`meucaminhoback.onrender.com`); front PWA; empacote Android via Capacitor |
| **CI** | GitHub Actions: build do frontend no push/PR |

**O que já está modelado no código**
- Autenticação JWT, cadastro/login
- Fluxo de lições, progresso, streak e calendário
- Devocional, missões, quiz/revisão, teologia, curiosidades, comunidade
- Paywall / planos premium e integração Stripe (checkout + webhook)
- Feedback por e-mail (Nodemailer)
- Seed e scripts de verificação no backend

**O que ainda é visão / depende de operação**
- Conteúdo bíblico e curadoria completos em escala de produto
- Stripe e e-mail com credenciais de produção validadas
- Publicação na Play Store (AAB assinado)
- Métricas de retenção e ligas com base de usuários reais

> Ao ler as seções abaixo, use esta tabela como filtro: descrevem o **produto alvo** e o que a arquitetura suporta; o estado de prontidão para o usuário final é o desta seção.

---

## 📁 Estrutura do Projeto

```
MeuCaminho/
├── backend/                 # API Node.js + Express + MongoDB
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── tests/
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env.example
│
├── frontend/                # React + Vite + PWA
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── android/                 # Capacitor
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Funcionalidades (visão do produto)

### 🎮 Gamificação
- **XP e níveis** — Sistema de pontos de experiência
- **Streak (ofensiva)** — Sequência diária de leitura
- **Calendário visual** — Dias completos, perdidos, congelados
- **Congeladores de ofensiva** — FREE: 2 · PREMIUM: ilimitados
- **Missões** — Mensais, semestrais, anuais e em dupla
- **Parabenizar amigos** — +5 XP para quem parabeniza
- **Ranking semanal** — Ligas (Bronze, Prata, Ouro)

### 📚 Planos de Leitura
- Anual, Semestral, Livre
- Categorias: Pentateuco, Juízes & Reinado, Poéticos, Profetas, Evangelhos, Cartas, Apocalipse
- **Curso extra:** Teologia Básica

### 📖 Revisão com Quiz
- Níveis básico / intermediário / avançado com XP diferente

### 💡 Curiosidades e vídeos
- Curiosidades bíblicas e integração com conteúdo educacional (ex.: BibleProject)

### 💎 Monetização (alvo)
| Plano | Preço | Benefícios (planejados) |
|---|---|---|
| **FREE** | R$ 0 | Limite diário de lições, congeladores limitados |
| **PREMIUM Mensal** | R$ 14,90/mês | Lições ilimitadas, recursos extras |
| **PREMIUM Anual** | R$ 124/ano | Desconto anual |
| **Vitalício** | R$ 299 | Pagamento único |

- Stripe (Checkout + Webhooks) no backend
- Paywall ao atingir limite diário

### 🙏 Devocional e feedback
- Devocional diário e compartilhamento social
- Pesquisa de satisfação + Nodemailer

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js ≥ 18
- MongoDB (local ou Atlas)
- Stripe e Gmail (opcional para monetização/e-mail)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite .env com suas credenciais
npm run dev
```

> Produção (API): `https://meucaminhoback.onrender.com` (quando o serviço estiver no ar)

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Variáveis de ambiente (backend)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/verbovivo
JWT_SECRET=sua_chave_secreta_super_forte
FRONTEND_URL=http://localhost:5173

# Stripe (opcional no MVP local)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_ANNUAL=price_xxx
STRIPE_PRICE_LIFETIME=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email (opcional no MVP local)
EMAIL_USER=seu_app@gmail.com
EMAIL_PASSWORD=sua_senha_de_app_gmail
DEV_EMAIL=seu_email_pessoal@gmail.com
```

---

## 🔌 Principais endpoints da API

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastrar usuário |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Dados do usuário logado |

### Lições / progresso
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/lessons/today` | Lição do dia |
| POST | `/api/lessons/:id/complete` | Completar lição (+XP) |
| GET | `/api/progress/me` | Progresso do usuário |

### Devocional / assinatura / feedback
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/devotional/today` | Devocional do dia |
| POST | `/api/subscription/checkout` | Checkout Stripe |
| POST | `/api/subscription/webhook` | Webhook Stripe |
| POST | `/api/feedback` | Pesquisa de satisfação |

### Outros
- `/api/plans`, `/api/curiosities`, `/api/missions`, `/api/quiz`, `/api/theology`, `/api/community`, `/api/bible`
- `/health` — health check

---

## 🏗️ Infraestrutura (lançamento)

| Camada | Serviço |
|---|---|
| Frontend | Vercel / estático |
| Backend | Render |
| Banco | MongoDB Atlas |
| Pagamentos | Stripe |
| E-mail | Nodemailer + Gmail |

---

## 📱 Android (Capacitor)

Estrutura `android/` e `capacitor.config.json` já no repositório. Para abrir no Android Studio:

```bash
npx cap open android
```

Publicação na Play Console exige AAB assinado (taxa única da conta de desenvolvedor Google).

---

## 🎨 Identidade visual

| Elemento | Valor |
|---|---|
| Nome | Meu Caminho de Luz |
| Slogan | A Palavra Viva |
| Cor primária | `#297a2e` |
| Cor destaque | `#d97706` |
| Cor Premium | `#8b5cf6` |

---

## 📄 Licença

Projeto proprietário. Todos os direitos reservados.

---

> Feito com ❤️ para a glória de Deus.

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimit');
const Devotional = require('../models/Devotional');
const User = require('../models/User');

const decodeHtml = value => value
  .replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/g, '"')
  .replace(/&lsquo;|&rsquo;|&#8216;|&#8217;/g, "'")
  .replace(/&amp;/g, '&')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

const devotionalPool = [
  {
    title: 'A paz que excede o entendimento',
    bibleReference: 'Filipenses 4:6-7',
    bibleText: 'Não andeis ansiosos por coisa alguma; antes, em tudo, sejam conhecidas diante de Deus as vossas petições; e a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus.',
    reflection: 'A paz de Deus não nasce da ausência de problemas, mas da presença de Cristo no meio deles. Quando entregamos nossas preocupações ao Senhor, Ele nos guarda em um descanso que a mente humana não consegue produzir.',
    meditationQuestion: 'Qual preocupação você precisa entregar hoje ao Senhor?',
    prayer: 'Senhor, eu te entrego minhas angústias e peço a paz que só vem de Ti. Guarda meu coração e me ajuda a confiar em Teu cuidado.',
    category: 'fé',
    author: 'Meu Caminho de Luz',
    source: 'Meu Caminho de Luz'
  },
  {
    title: 'Força para seguir',
    bibleReference: 'Filipenses 4:13',
    bibleText: 'Tudo posso naquele que me fortalece.',
    reflection: 'A fé não elimina as dificuldades, mas nos dá a força para perseverar com dignidade, esperança e coragem. Cada passo de obediência é uma vitória de confiança em Deus.',
    meditationQuestion: 'Em que área da sua vida você precisa confiar no poder de Deus hoje?',
    prayer: 'Senhor, fortalece meu coração e me lembra que, com Ti, eu posso seguir em frente mesmo nas dificuldades.',
    category: 'fé',
    author: 'Meu Caminho de Luz',
    source: 'Meu Caminho de Luz'
  },
  {
    title: 'O Senhor é meu pastor',
    bibleReference: 'Salmo 23:1',
    bibleText: 'O Senhor é o meu pastor; nada me faltará.',
    reflection: 'Quando reconhecemos que Deus cuida de nós, nossa ansiedade diminui e a confiança cresce. Ele não apenas guia, mas sustenta e protege em cada etapa da caminhada.',
    meditationQuestion: 'Onde você precisa reconhecer mais de perto o cuidado de Deus?',
    prayer: 'Senhor, eu descanso no Teu cuidado e confio que Tu me guia, sustenta e protege em cada jornada.',
    category: 'esperança',
    author: 'Meu Caminho de Luz',
    source: 'Meu Caminho de Luz'
  },
  {
    title: 'Confie no Senhor',
    bibleReference: 'Provérbios 3:5-6',
    bibleText: 'Confia no Senhor de todo o teu coração e não te apoies no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e Ele endireitará as tuas veredas.',
    reflection: 'Não é necessário entender tudo para obedecer. Deus chama a confiar, mesmo quando o caminho ainda está envolto em incertezas. Quanto mais entregamos nosso caminho a Ele, mais paz encontramos.',
    meditationQuestion: 'Qual decisão você precisa entregar ao Senhor hoje?',
    prayer: 'Senhor, eu confio em Ti mais do que em minhas próprias forças. Guia meus passos e endireita meus caminhos.',
    category: 'sabedoria',
    author: 'Meu Caminho de Luz',
    source: 'Meu Caminho de Luz'
  },
  {
    title: 'Amor que transforma',
    bibleReference: 'João 3:16',
    bibleText: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
    reflection: 'O amor de Deus não é distante ou frio: ele se revela em ação, graça e entrega. Esse amor nos chama a viver com esperança, misericórdia e profunda gratidão.',
    meditationQuestion: 'Como você pode viver o amor de Deus hoje em sua casa, trabalho e relações?',
    prayer: 'Senhor, ajuda-me a receber e compartilhar o Teu amor, tornando-me mais sensível à graça e à misericórdia que me foste dada.',
    category: 'amor',
    author: 'Meu Caminho de Luz',
    source: 'Meu Caminho de Luz'
  }
];

function getPortugueseDevotionalForDate(date = new Date()) {
  const dayKey = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = Math.abs(Math.floor(dayKey.getTime() / 86400000));
  const devotional = devotionalPool[offset % devotionalPool.length];

  return {
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    title: devotional.title,
    bibleReference: devotional.bibleReference,
    bibleText: devotional.bibleText,
    bibleVersion: 'NVI',
    reflection: devotional.reflection,
    meditationQuestion: devotional.meditationQuestion,
    prayer: devotional.prayer,
    category: devotional.category,
    author: devotional.author,
    source: devotional.source
  };
}

async function createFromPublicVerse() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const devotional = getPortugueseDevotionalForDate(today);
    return await Devotional.create({
      ...devotional,
      date: today
    });
  } catch (err) {
    if (err.code === 11000) return Devotional.findOne({ date: { $gte: today } });
    throw err;
  }
}

// GET /api/devotional/today — Devocional do dia
router.get('/today', auth, async (req, res) => {
  try {
    let devotional = await Devotional.findToday();

    // Completa o conteúdo do dia com o versículo público quando necessário.
    if (!devotional) {
      try {
        devotional = await createFromPublicVerse();
      } catch {
        devotional = await Devotional.findOne().sort({ date: -1 });
      }
    }

    if (!devotional) {
      return res.status(404).json({ message: 'Nenhum devocional disponível' });
    }

    // Incrementar visualizações
    devotional.views++;
    await devotional.save();

    // Verificar se usuário já completou
    const completedByUser = devotional.completedBy.some(
      id => id.toString() === req.user._id.toString()
    );

    res.json({
      ...devotional.toObject(),
      completedByUser
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/devotional/:id/complete — Marcar como lido
router.post('/:id/complete', auth, authRateLimiter, async (req, res) => {
  try {
    const devotional = await Devotional.findById(req.params.id);
    if (!devotional) {
      return res.status(404).json({ message: 'Devocional não encontrado' });
    }

    const userId = req.user._id.toString();
    const alreadyCompleted = devotional.completedBy.some(
      id => id.toString() === userId
    );

    if (alreadyCompleted) {
      return res.json({ success: true, message: 'Já completado', xpEarned: 0 });
    }

    devotional.completedBy.push(req.user._id);
    await devotional.save();

    // Dar XP ao usuário
    const user = await User.findById(req.user._id);
    user.xp += 10;
    user.applyDailyStreak();
    await user.save();

    res.json({
      success: true,
      message: 'Devocional completado!',
      xpEarned: 10,
      newXp: user.xp
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/devotional — Listar todos (paginado)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const devotionals = await Devotional.find()
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(devotionals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

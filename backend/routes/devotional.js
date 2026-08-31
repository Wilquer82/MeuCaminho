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

async function createFromPublicVerse() {
  const endpoint = process.env.DEVOTIONAL_API_URL || 'https://www.biblegateway.com/votd/get/?format=json';
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error('Fonte pública indisponível');

  const payload = await response.json();
  const verse = payload.votd;
  if (!verse?.reference || !verse?.text) throw new Error('Resposta pública inválida');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    return await Devotional.create({
      date: today,
      title: 'Versículo do dia',
      bibleReference: decodeHtml(verse.reference),
      bibleText: decodeHtml(verse.text),
      bibleVersion: verse.version || 'NIV',
      reflection: 'Separe alguns minutos para ler este versículo com calma. Permita que a Palavra ilumine suas decisões e fortaleça sua caminhada hoje.',
      meditationQuestion: 'Como este versículo pode transformar sua atitude hoje?',
      prayer: 'Senhor, ajuda-me a guardar esta Palavra no coração e vivê-la com fé. Amém.',
      category: 'fé',
      author: 'Meu Caminho de Luz',
      source: `BibleGateway VOTD — ${verse.permalink || endpoint}`
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

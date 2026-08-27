const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Devotional = require('../models/Devotional');
const User = require('../models/User');

// GET /api/devotional/today — Devocional do dia
router.get('/today', auth, async (req, res) => {
  try {
    let devotional = await Devotional.findToday();

    // Se não houver devocional para hoje, retorna o mais recente
    if (!devotional) {
      devotional = await Devotional.findOne().sort({ date: -1 });
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
router.post('/:id/complete', auth, async (req, res) => {
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

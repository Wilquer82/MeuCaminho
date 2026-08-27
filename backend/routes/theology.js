const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const TheologyUnit = require('../models/TheologyUnit');
const User = require('../models/User');

// GET /api/theology — Listar unidades de teologia
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const units = await TheologyUnit.find().sort({ order: 1 });

    // Se usuário FREE, só mostra unidades gratuitas
    const filtered = user.isPremium()
      ? units
      : units.filter(u => !u.isPremium);

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/theology/:id — Detalhes de uma unidade
router.get('/:id', auth, async (req, res) => {
  try {
    const unit = await TheologyUnit.findById(req.params.id).populate('lessons');
    if (!unit) return res.status(404).json({ message: 'Unidade não encontrada' });

    const user = await User.findById(req.user._id);
    if (unit.isPremium && !user.isPremium()) {
      return res.status(403).json({
        message: 'Conteúdo exclusivo Premium',
        code: 'PREMIUM_REQUIRED'
      });
    }

    res.json(unit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/theology/:id/complete
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const unit = await TheologyUnit.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!unit.completedBy.includes(req.user._id)) {
      unit.completedBy.push(req.user._id);
      await unit.save();
      user.xp += unit.xpReward;
      await user.save();
    }

    res.json({ success: true, xpEarned: unit.xpReward, newXp: user.xp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

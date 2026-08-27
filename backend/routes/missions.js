const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Mission = require('../models/Mission');
const User = require('../models/User');

// GET /api/missions — Listar missões
router.get('/', auth, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const missions = await Mission.find(filter).sort({ createdAt: -1 });
    res.json(missions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/missions/me — Missões do usuário com progresso
router.get('/me', auth, async (req, res) => {
  try {
    const missions = await Mission.find({
      $or: [
        { type: { $ne: 'dupla' } },
        { duoPartner: req.user._id }
      ]
    });
    res.json(missions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/missions/:id/celebrate — Parabenizar amigo (+5 XP)
router.post('/:id/celebrate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.xp += 5;
    await user.save();
    res.json({ success: true, xpEarned: 5, newXp: user.xp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

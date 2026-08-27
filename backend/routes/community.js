const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/community/friends — Lista de amigos
router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'name xp streak level');
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/community/leaderboard — Ranking semanal
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('name xp streak level')
      .sort({ xp: -1 })
      .limit(20);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/community/friends/:id/add — Adicionar amigo
router.post('/friends/:id/add', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friendId = req.params.id;

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }

    res.json({ success: true, friends: user.friends });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/community/friends/:id/celebrate — Parabenizar amigo (+5 XP)
router.post('/friends/:id/celebrate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.xp += 5;
    await user.save();
    res.json({ success: true, xpEarned: 5, newXp: user.xp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/community/search — Buscar usuários
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      name: { $regex: q, $options: 'i' }
    })
      .select('name xp streak level')
      .limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

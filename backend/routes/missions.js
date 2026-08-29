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

// GET /api/missions/me/today — Retornar progresso de hoje
router.get('/me/today', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const today = new Date().toDateString();
    
    res.json({
      missionPlan: user.selectedMissionPlan || 'free',
      lessonsCompletedToday: user.dailyLessonsCompleted?.count || 0,
      streakToday: user.streak || 0,
      xpToday: 0, // Será calculado conforme completa tarefas
      devotionalCompleted: false // Será atualizado quando completar
    });
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

// POST /api/missions/:id/complete — Completar missão e ganhar XP
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ message: 'Missão não encontrada' });
    }

    const user = await User.findById(req.user._id);
    const xpReward = 50; // XP base para completar missão
    
    user.xp += xpReward;
    user.level = Math.floor(user.xp / 2000) + 1;
    
    // Registrar conclusão
    if (!mission.completedBy) mission.completedBy = [];
    if (!mission.completedBy.includes(req.user._id)) {
      mission.completedBy.push(req.user._id);
    }
    
    await user.save();
    await mission.save();
    
    res.json({
      success: true,
      xpEarned: xpReward,
      newXp: user.xp,
      newLevel: user.level,
      missionCompleted: mission.title
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

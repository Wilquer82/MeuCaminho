const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { checkDailyLimit } = require('../middleware/rateLimit');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

const applyDailyStreak = (user) => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const lastActiveKey = user.lastActive ? new Date(user.lastActive).toISOString().slice(0, 10) : null;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (lastActiveKey === yesterdayKey) {
    user.streak = (user.streak || 0) + 1;
  } else if (lastActiveKey !== todayKey) {
    user.streak = 1;
  }

  user.lastActive = new Date();
};

// GET /api/lessons — Listar lições por categoria
router.get('/', auth, async (req, res) => {
  try {
    const { category, unit } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (unit) filter.unit = unit;

    const lessons = await Lesson.find(filter).sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/lessons/today — Lição do dia (aplica limite diário)
router.get('/today', auth, checkDailyLimit, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const category = user.activeCategory || 'poeticos';
    const lessons = await Lesson.find({
      category,
      isFree: true
    }).sort({ order: 1 });

    if (!lessons.length) {
      return res.status(404).json({ message: 'Nenhuma lição disponível' });
    }

    // Usar data local do servidor (não UTC)
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const todayKey = localDate.toISOString().slice(0, 10);
    const seed = [...todayKey].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const lesson = lessons[Math.abs(seed) % lessons.length];

    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/lessons/:id — Detalhes de uma lição
router.get('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lição não encontrada' });
    }
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/lessons/:id/complete — Completar lição
router.post('/:id/complete', auth, checkDailyLimit, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lição não encontrada' });
    }

    // Verificar se já completou
    const alreadyCompleted = lesson.completedBy.some(
      id => id.toString() === req.user._id.toString()
    );

    if (!alreadyCompleted) {
      lesson.completedBy.push(req.user._id);
      await lesson.save();

      // Incrementar contador diário
      if (req.incrementLesson) {
        await req.incrementLesson();
        await user.save();
      }

      // Dar XP
      user.xp += lesson.xpReward;

      applyDailyStreak(user);
      await user.save();
    }

    res.json({
      success: true,
      xpEarned: alreadyCompleted ? 0 : lesson.xpReward,
      newXp: user.xp,
      newStreak: user.streak,
      dailyLessonsCompleted: user.dailyLessonsCompleted
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Progress = require('../models/Progress');

// GET /api/progress/me — Progresso do usuário
router.get('/me', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id })
      .populate('plan', 'name type category')
      .populate('completedLessons', 'title reference');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/progress/category/:category — Progresso por categoria
router.get('/category/:category', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      category: req.params.category
    }).populate('completedLessons');
    res.json(progress || { completedLessons: [], percentage: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

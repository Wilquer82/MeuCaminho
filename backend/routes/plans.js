const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Plan = require('../models/Plan');
const Progress = require('../models/Progress');

// GET /api/plans — Listar todos os planos
router.get('/', auth, async (req, res) => {
  try {
    const plans = await Plan.find().populate('lessons', 'title reference order');
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/plans/:id — Detalhes de um plano
router.get('/:id', auth, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).populate('lessons');
    if (!plan) return res.status(404).json({ message: 'Plano não encontrado' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/plans/:id/enroll — Inscrever usuário no plano
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const progress = await Progress.create({
      user: req.user._id,
      plan: req.params.id,
      startedAt: new Date()
    });
    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

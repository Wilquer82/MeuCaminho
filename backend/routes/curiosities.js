const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Curiosity = require('../models/Curiosity');

// GET /api/curiosities — Listar curiosidades
router.get('/', auth, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const curiosities = await Curiosity.find(filter).sort({ createdAt: -1 });
    res.json(curiosities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/curiosities/random — Uma curiosidade aleatória
router.get('/random', auth, async (req, res) => {
  try {
    const count = await Curiosity.countDocuments();
    const random = Math.floor(Math.random() * count);
    const curiosity = await Curiosity.findOne().skip(random);
    if (curiosity) {
      curiosity.views++;
      await curiosity.save();
    }
    res.json(curiosity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

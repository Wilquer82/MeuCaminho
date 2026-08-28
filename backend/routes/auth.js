const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const gerarToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      token: gerarToken(user._id)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    user.lastActive = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      dailyLessonsCompleted: user.dailyLessonsCompleted,
      streakFreezes: user.streakFreezes,
      activeCategory: user.activeCategory,
      token: gerarToken(user._id)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

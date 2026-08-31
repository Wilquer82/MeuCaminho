const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { auth } = require('../middleware/auth');
const User = require('../models/User');


const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  plan: user.plan,
  subscriptionId: user.subscriptionId,
  subscriptionExpires: user.subscriptionExpires,
  dailyLessonsCompleted: user.dailyLessonsCompleted,
  streakFreezes: user.streakFreezes,
  xp: user.xp,
  level: user.level,
  streak: user.streak,
  lastActive: user.lastActive,
  activeCategory: user.activeCategory,
  selectedMissionPlan: user.selectedMissionPlan,
  unlockedAchievements: user.unlockedAchievements || [],
  lessonsCompleted: user.lessonsCompleted || [],
  quizScore: user.quizScore || 0,
  firstAccess: user.firstAccess,
  friends: user.friends || [],
  duoPartner: user.duoPartner || null,
  createdAt: user.createdAt
});


const createToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


// POST /api/auth/register - Registrar um novo usuário
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    const normalizedName = String(name || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !String(password || '').trim()) {
      return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: String(password)
    });

    const token = createToken(user);
    res.status(201).json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro ao cadastrar usuário.' });
  }
});


// POST /api/auth/login - Fazer login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !String(password || '').trim()) {
      return res.status(400).json({ message: 'Informe e-mail e senha para continuar.' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    const isMatch = await user.matchPassword(String(password));
    if (!isMatch) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    const token = createToken(user);
    res.json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro ao entrar.' });
  }
});


// GET /api/auth/me - Obter dados do usuário logado
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json({
      user: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro ao carregar usuário.' });
  }
});


// PATCH /api/auth/me - Atualizar dados do usuário
router.patch('/me', auth, async (req, res) => {
  try {
    const allowedUpdates = [
      'plan',
      'subscriptionId',
      'subscriptionExpires',
      'dailyLessonsCompleted',
      'streakFreezes',
      'xp',
      'level',
      'streak',
      'lastActive',
      'activeCategory',
      'selectedMissionPlan',
      'firstAccess',
      'quizScore',
      'friends',
      'duoPartner'
    ];

    const updates = {};
    Object.keys(req.body || {}).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Nenhum campo válido para atualizar.' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json({
      user: sanitizeUser(user),
      message: 'Dados do usuário atualizados.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro ao atualizar usuário.' });
  }
});


module.exports = router;
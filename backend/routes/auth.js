const express = require('express');
const router = express.Router();
// ✅ IMPORTANTE: Mantive a mesma forma de importação do auth que você usa no auth.js
const { auth } = require('../middleware/auth');
const Achievement = require('../models/Achievement');
const User = require('../models/User');


// GET /api/achievements - Lista todas as conquistas
router.get('/', auth, async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ tier: 1, createdAt: -1 });
    const user = await User.findById(req.user._id);
    const userAchievements = user.unlockedAchievements || [];
    
    const enriched = achievements.map(ach => ({
      ...ach.toObject(),
      unlocked: userAchievements.includes(ach._id.toString())
    }));
    
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/achievements/me - Progresso do usuário
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const achievements = await Achievement.find();
    
    const progress = achievements.map(ach => {
      const unlocked = user.unlockedAchievements?.includes(ach._id.toString());
      
      let userValue = 0;
      switch (ach.criterionType) {
        case 'lessons':
          userValue = user.lessonsCompleted?.length || 0;
          break;
        case 'streak':
          userValue = user.streak || 0;
          break;
        case 'level':
          userValue = Math.floor((user.xp || 0) / 2000) + 1;
          break;
        case 'xp_total':
          userValue = user.xp || 0;
          break;
        case 'quiz_score':
          userValue = user.quizScore || 0;
          break;
        default:
          userValue = 0;
      }
      
      return {
        id: ach._id,
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
        category: ach.category,
        tier: ach.tier,
        criterionType: ach.criterionType,
        criterionValue: ach.criterionValue,
        userValue,
        unlocked,
        progress: Math.min(100, Math.round((userValue / ach.criterionValue) * 100))
      };
    });
    
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST /api/achievements/seed - Criar conquistas padrão (admin)
router.post('/seed', auth, async (req, res) => {
  try {
    const existingCount = await Achievement.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({ message: 'Conquistas já existem' });
    }
    
    const defaultAchievements = [
      // Dedicação
      { 
        title: '1ª Semana', 
        description: 'Complete 7 lições',
        icon: '🎯',
        category: 'dedicacao',
        type: 'milestone',
        tier: 'bronze',
        criterionType: 'lessons',
        criterionValue: 7,
        xpReward: 50
      },
      { 
        title: 'Leitor Constante', 
        description: 'Mantenha streak de 14 dias',
        icon: '📖',
        category: 'dedicacao',
        type: 'streak',
        tier: 'prata',
        criterionType: 'streak',
        criterionValue: 14,
        xpReward: 100
      },
      { 
        title: 'Queimando Fogo', 
        description: 'Streak de 30 dias',
        icon: '🔥',
        category: 'dedicacao',
        type: 'streak',
        tier: 'ouro',
        criterionType: 'streak',
        criterionValue: 30,
        xpReward: 200
      },
      // Estudo
      { 
        title: 'Aprendiz', 
        description: 'Atinja nível 3',
        icon: '📚',
        category: 'estudo',
        type: 'milestone',
        tier: 'bronze',
        criterionType: 'level',
        criterionValue: 3,
        xpReward: 75
      },
      { 
        title: 'Teólogo Iniciante', 
        description: 'Atinja nível 5',
        icon: '🎓',
        category: 'estudo',
        type: 'milestone',
        tier: 'prata',
        criterionType: 'level',
        criterionValue: 5,
        xpReward: 150
      },
      // XP
      { 
        title: 'Coletor de Sabedoria', 
        description: 'Acumule 1000 XP',
        icon: '💎',
        category: 'estudo',
        type: 'challenge',
        tier: 'bronze',
        criterionType: 'xp_total',
        criterionValue: 1000,
        xpReward: 100
      },
      { 
        title: 'Mestre das Escrituras', 
        description: 'Acumule 5000 XP',
        icon: '👑',
        category: 'estudo',
        type: 'challenge',
        tier: 'diamante',
        criterionType: 'xp_total',
        criterionValue: 5000,
        xpReward: 500
      }
    ];
    
    await Achievement.insertMany(defaultAchievements);
    res.json({ message: 'Conquistas criadas com sucesso', count: defaultAchievements.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
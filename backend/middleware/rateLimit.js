const User = require('../models/User');

// Middleware: bloqueia lições extras para usuários FREE
const checkDailyLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.isPremium()) {
      return next(); // PREMIUM: sem limites
    }

    if (!user.canStartLesson()) {
      return res.status(402).json({
        success: false,
        message: 'Limite diário atingido!',
        code: 'DAILY_LIMIT_REACHED',
        data: {
          dailyLimit: user.getDailyLimit(),
          completedToday: user.dailyLessonsCompleted.count,
          remaining: 0,
          upgradeUrl: '/api/subscription/checkout'
        }
      });
    }

    req.incrementLesson = () => user.incrementDailyLessons();
    next();

  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

module.exports = { checkDailyLimit };

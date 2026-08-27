// Lógica reutilizável do limite diário
const User = require('../models/User');

const verificarLimiteDiario = async (userId) => {
  const user = await User.findById(userId);
  return {
    canStart: user.canStartLesson(),
    dailyLimit: user.getDailyLimit(),
    completedToday: user.dailyLessonsCompleted.count,
    isPremium: user.isPremium()
  };
};

const incrementarContadorDiario = async (userId) => {
  const user = await User.findById(userId);
  const result = user.incrementDailyLessons();
  await user.save();
  return result;
};

module.exports = { verificarLimiteDiario, incrementarContadorDiario };

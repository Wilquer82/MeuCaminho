const User = require('../models/User');

// Middleware: bloqueia lições extras para usuários FREE
const checkDailyLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.isPremium()) {
      return next(); // PREMIUM: sem limites
    }

    // BETA TESTE: Sem limite de lições diárias, apenas contabilizar.
    req.incrementLesson = () => user.incrementDailyLessons();
    next();

  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

const rateLimitMap = new Map();

// Simple in-memory rate limiter for auth/quiz routes
const authRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 30;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  const record = rateLimitMap.get(ip);
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return next();
  }

  record.count++;
  if (record.count > maxRequests) {
    return res.status(429).json({ message: 'Muitas requisições, tente novamente mais tarde.' });
  }

  next();
};

module.exports = { checkDailyLimit, authRateLimiter };

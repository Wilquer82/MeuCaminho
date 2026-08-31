const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // === MONETIZAÇÃO ===
  plan: {
    type: String,
    enum: ['free', 'premium', 'lifetime'],
    default: 'free'
  },
  subscriptionId: String,
  subscriptionExpires: Date,
  dailyLessonsCompleted: {
    count: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
  },
  streakFreezes: { type: Number, default: 2 },

  // === PROGRESSO ===
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastActive: Date,

  // === CATEGORIAS (como "idiomas") ===
  activeCategory: {
    type: String,
    default: 'poeticos',
    enum: ['pentateuco', 'juizes', 'poeticos', 'profetas',
           'evangelhos', 'cartas', 'apocalipse', 'teologia']
  },

  // === MISSÕES E DESAFIOS ===
  selectedMissionPlan: {
    type: String,
    enum: ['free', 'monthly', 'semiannual', 'annual'],
    default: 'free'
  },
  
  // === CONQUISTAS ===
  unlockedAchievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
  
  // === RASTREAMENTO ===
  lessonsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  quizScore: { type: Number, default: 0 },
  firstAccess: { type: Boolean, default: true },
  
  // Track last read chapter for each book
  bookProgress: [{
    bookSlug: String,
    chapter: Number,
    lastRead: { type: Date, default: Date.now }
  }],

  // === SOCIAL ===
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  duoPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  createdAt: { type: Date, default: Date.now }
});

// Limite diário: FREE = 3 lições/dia, PREMIUM = ilimitado
userSchema.methods.getDailyLimit = function() {
  return this.plan === 'free' ? 3 : Infinity;
};

userSchema.methods.canStartLesson = function() {
  const today = new Date().toDateString();
  const lastDate = new Date(this.dailyLessonsCompleted.date).toDateString();
  if (today !== lastDate) {
    this.dailyLessonsCompleted = { count: 0, date: new Date() };
    return true;
  }
  return this.dailyLessonsCompleted.count < this.getDailyLimit();
};

userSchema.methods.incrementDailyLessons = function() {
  const today = new Date().toDateString();
  const lastDate = new Date(this.dailyLessonsCompleted.date).toDateString();
  if (today !== lastDate) {
    this.dailyLessonsCompleted = { count: 1, date: new Date() };
  } else {
    this.dailyLessonsCompleted.count++;
  }
  return this.dailyLessonsCompleted;
};

userSchema.methods.isPremium = function() {
  return ['premium', 'lifetime'].includes(this.plan);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);

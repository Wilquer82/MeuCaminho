const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String, default: '🏆' },
  category: { type: String, enum: ['leitura', 'estudo', 'social', 'desafio', 'dedicacao'], default: 'estudo' },
  type: { type: String, enum: ['milestone', 'streak', 'completion', 'social', 'challenge'], required: true },
  tier: { type: String, enum: ['bronze', 'prata', 'ouro', 'diamante'], default: 'bronze' },
  
  // Critério de desbloqueio
  criterionType: { 
    type: String, 
    enum: ['lessons', 'streak', 'level', 'friends', 'quiz_score', 'category_complete', 'xp_total'], 
    required: true 
  },
  criterionValue: { type: Number, required: true }, // ex: 10 lições, streak 30, level 5
  
  // Recompensas
  xpReward: { type: Number, default: 50 },
  badgeUnlocked: Boolean,
  
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);

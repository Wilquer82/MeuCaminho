const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['diária', 'semanal', 'mensal', 'semestral', 'anual', 'dupla'],
    required: true
  },
  requirement: {
    type: { type: String, enum: ['lessons', 'streak', 'category', 'friends', 'quiz'], required: true },
    target: { type: Number, required: true },
    category: String
  },
  xpReward: { type: Number, default: 50 },
  medalReward: String,
  titleReward: String,
  startDate: Date,
  endDate: Date,
  duoPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  completedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedAt: Date,
    progress: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mission', missionSchema);

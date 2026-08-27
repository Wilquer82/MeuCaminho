const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  category: String,
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  percentage: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  lastAccessed: Date
});

module.exports = mongoose.model('Progress', progressSchema);

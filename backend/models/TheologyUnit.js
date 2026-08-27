const mongoose = require('mongoose');

const theologyUnitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  description: String,
  topics: [{ type: String }],
  bibleReferences: [String],
  sources: [{ name: String, url: String }],
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  isPremium: { type: Boolean, default: false },
  xpReward: { type: Number, default: 50 },
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TheologyUnit', theologyUnitSchema);

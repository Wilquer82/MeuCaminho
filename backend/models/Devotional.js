const mongoose = require('mongoose');

// Devocional diário - estilo YouVersion
const devotionalSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  title: { type: String, required: true },
  bibleReference: { type: String, required: true },
  bibleText: { type: String, required: true },
  bibleVersion: { type: String, default: 'NVI' },
  reflection: { type: String, required: true },
  meditationQuestion: String,
  prayer: String,
  shareImage: String,
  shareQuote: String,
  category: {
    type: String,
    enum: ['fé', 'esperança', 'amor', 'sabedoria', 'adoração', 'gratidão'],
    default: 'fé'
  },
  author: { type: String, default: 'VerboVivo' },
  source: String,
  views: { type: Number, default: 0 },
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

devotionalSchema.statics.findToday = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return this.findOne({ date: { $gte: today, $lt: tomorrow } });
};

module.exports = mongoose.model('Devotional', devotionalSchema);

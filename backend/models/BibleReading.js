const mongoose = require('mongoose');

const bibleReadingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: String, required: true },
  chapter: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

bibleReadingSchema.index({ user: 1, book: 1, chapter: 1 }, { unique: true });

module.exports = mongoose.model('BibleReading', bibleReadingSchema);
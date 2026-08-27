const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  reference: { type: String, required: true },
  text: { type: String, required: true },
  hebrewTip: {
    word: String,
    transliteration: String,
    pronunciation: String,
    meaning: String,
    root: String,
    grammar: String,
    occurrences: String,
    crossReferences: [String],
    culturalContext: String,
    source: String
  },
  greekTip: {
    word: String,
    transliteration: String,
    pronunciation: String,
    meaning: String,
    root: String,
    grammar: String,
    occurrences: String,
    crossReferences: [String],
    culturalContext: String,
    source: String
  },
  category: {
    type: String,
    enum: ['pentateuco', 'juizes', 'poeticos', 'profetas',
           'evangelhos', 'cartas', 'apocalipse', 'teologia'],
    required: true
  },
  unit: { type: Number, default: 1 },
  order: { type: Number, required: true },
  xpReward: { type: Number, default: 20 },
  isFree: { type: Boolean, default: true },
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', lessonSchema);

const mongoose = require('mongoose');

const curiositySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['histórica', 'cultural', 'hebraico', 'grego', 'geográfica', 'arqueológica'],
    required: true
  },
  bibleReference: String,
  source: { type: String, required: true },
  sourceUrl: String,
  image: String,
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Curiosity', curiositySchema);

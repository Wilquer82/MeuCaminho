const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: String,
  difficulty: {
    type: String,
    enum: ['básico', 'intermediário', 'avançado'],
    default: 'básico'
  },
  xpReward: { type: Number, default: 15 },
  category: {
    type: String,
    enum: ['conhecimento', 'citação', 'contexto', 'hebraico', 'grego', 'história']
  },
  relatedLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);

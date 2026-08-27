const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  category: {
    type: String,
    enum: ['geral', 'bug', 'sugestao', 'conteudo', 'monetizacao', 'elogio'],
    default: 'geral'
  },
  message: { type: String, required: true },
  featureRequest: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);

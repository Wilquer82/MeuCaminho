const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const QuizQuestion = require('../models/QuizQuestion');
const User = require('../models/User');

function normalizeDifficulty(value) {
  const normalized = String(value || '').trim().toLowerCase();
  const map = {
    basico: 'básico',
    basica: 'básico',
    basic: 'básico',
    intermediario: 'intermediário',
    intermedio: 'intermediário',
    intermediate: 'intermediário',
    avancado: 'avançado',
    advanced: 'avançado'
  };

  return map[normalized] || (['básico', 'intermediário', 'avançado'].includes(normalized) ? normalized : null);
}

// GET /api/quiz — Pegar perguntas de revisão
router.get('/', auth, async (req, res) => {
  try {
    const { difficulty, limit = 5 } = req.query;
    const normalizedDifficulty = normalizeDifficulty(difficulty);
    const filter = normalizedDifficulty ? { difficulty: normalizedDifficulty } : {};

    let questions = await QuizQuestion.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(limit, 10) || 5 } }
    ]);

    if (!questions.length && normalizedDifficulty) {
      questions = await QuizQuestion.aggregate([
        { $sample: { size: parseInt(limit, 10) || 5 } }
      ]);
    }

    // Não enviar a resposta correta no retorno
    const sanitized = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      xpReward: q.xpReward,
      category: q.category
    }));

    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/quiz/answer — Verificar resposta
router.post('/answer', auth, async (req, res) => {
  try {
    const { questionId, selectedIndex } = req.body;
    const question = await QuizQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: 'Pergunta não encontrada' });
    }

    const isCorrect = selectedIndex === question.correctIndex;
    let xpEarned = 0;

    if (isCorrect) {
      xpEarned = question.xpReward;
      const user = await User.findById(req.user._id);
      user.xp += xpEarned;
      await user.save();
    }

    res.json({
      isCorrect,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      xpEarned
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

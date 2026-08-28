const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const BibleReading = require('../models/BibleReading');
const User = require('../models/User');

const translations = [
  { id: 'almeida', name: 'Almeida', language: 'pt-BR' }
];

const books = [
  { id: 'genesis', name: 'Gênesis', chapters: 50 },
  { id: 'exodus', name: 'Êxodo', chapters: 40 },
  { id: 'leviticus', name: 'Levítico', chapters: 27 },
  { id: 'numbers', name: 'Números', chapters: 36 },
  { id: 'deuteronomy', name: 'Deuteronômio', chapters: 34 },
  { id: 'joshua', name: 'Josué', chapters: 24 },
  { id: 'judges', name: 'Juízes', chapters: 21 },
  { id: 'ruth', name: 'Rute', chapters: 4 },
  { id: '1samuel', name: '1 Samuel', chapters: 31 },
  { id: '2samuel', name: '2 Samuel', chapters: 24 },
  { id: '1kings', name: '1 Reis', chapters: 22 },
  { id: '2kings', name: '2 Reis', chapters: 25 },
  { id: '1chronicles', name: '1 Crônicas', chapters: 29 },
  { id: '2chronicles', name: '2 Crônicas', chapters: 36 },
  { id: 'ezra', name: 'Esdras', chapters: 10 },
  { id: 'nehemiah', name: 'Neemias', chapters: 13 },
  { id: 'esther', name: 'Ester', chapters: 10 },
  { id: 'job', name: 'Jó', chapters: 42 },
  { id: 'psalms', name: 'Salmos', chapters: 150 },
  { id: 'proverbs', name: 'Provérbios', chapters: 31 },
  { id: 'ecclesiastes', name: 'Eclesiastes', chapters: 12 },
  { id: 'songofsolomon', name: 'Cânticos', chapters: 8 },
  { id: 'isaiah', name: 'Isaías', chapters: 66 },
  { id: 'jeremiah', name: 'Jeremias', chapters: 52 },
  { id: 'lamentations', name: 'Lamentações', chapters: 5 },
  { id: 'ezekiel', name: 'Ezequiel', chapters: 48 },
  { id: 'daniel', name: 'Daniel', chapters: 12 },
  { id: 'hosea', name: 'Oseias', chapters: 14 },
  { id: 'joel', name: 'Joel', chapters: 3 },
  { id: 'amos', name: 'Amós', chapters: 9 },
  { id: 'obadiah', name: 'Obadias', chapters: 1 },
  { id: 'jonah', name: 'Jonas', chapters: 4 },
  { id: 'micah', name: 'Miqueias', chapters: 7 },
  { id: 'nahum', name: 'Naum', chapters: 3 },
  { id: 'habakkuk', name: 'Habacuque', chapters: 3 },
  { id: 'zephaniah', name: 'Sofonias', chapters: 3 },
  { id: 'haggai', name: 'Ageu', chapters: 2 },
  { id: 'zechariah', name: 'Zacarias', chapters: 14 },
  { id: 'malachi', name: 'Malaquias', chapters: 4 },
  { id: 'matthew', name: 'Mateus', chapters: 28 },
  { id: 'mark', name: 'Marcos', chapters: 16 },
  { id: 'luke', name: 'Lucas', chapters: 24 },
  { id: 'john', name: 'João', chapters: 21 },
  { id: 'acts', name: 'Atos', chapters: 28 },
  { id: 'romans', name: 'Romanos', chapters: 16 },
  { id: '1corinthians', name: '1 Coríntios', chapters: 16 },
  { id: '2corinthians', name: '2 Coríntios', chapters: 13 },
  { id: 'galatians', name: 'Gálatas', chapters: 6 },
  { id: 'ephesians', name: 'Efésios', chapters: 6 },
  { id: 'philippians', name: 'Filipenses', chapters: 4 },
  { id: 'colossians', name: 'Colossenses', chapters: 4 },
  { id: '1thessalonians', name: '1 Tessalonicenses', chapters: 5 },
  { id: '2thessalonians', name: '2 Tessalonicenses', chapters: 3 },
  { id: '1timothy', name: '1 Timóteo', chapters: 6 },
  { id: '2timothy', name: '2 Timóteo', chapters: 4 },
  { id: 'titus', name: 'Tito', chapters: 3 },
  { id: 'philemon', name: 'Filemom', chapters: 1 },
  { id: 'hebrews', name: 'Hebreus', chapters: 13 },
  { id: 'james', name: 'Tiago', chapters: 5 },
  { id: '1peter', name: '1 Pedro', chapters: 5 },
  { id: '2peter', name: '2 Pedro', chapters: 3 },
  { id: '1john', name: '1 João', chapters: 5 },
  { id: '2john', name: '2 João', chapters: 1 },
  { id: '3john', name: '3 João', chapters: 1 },
  { id: 'jude', name: 'Judas', chapters: 1 },
  { id: 'revelation', name: 'Apocalipse', chapters: 22 }
];

router.get('/books', auth, async (req, res) => {
  try {
    const completed = await BibleReading.find({ user: req.user._id }).select('book chapter -_id');
    res.json(books.map(book => ({
      ...book,
      completedChapters: completed.filter(item => item.book === book.id).length
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/translations', auth, (req, res) => {
  res.json(translations);
});

router.get('/:book/:chapter', auth, async (req, res) => {
  const book = books.find(item => item.id === req.params.book);
  const chapter = Number(req.params.chapter);

  if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) {
    return res.status(400).json({ message: 'Livro ou capítulo inválido' });
  }

  try {
    const translation = translations.some(item => item.id === req.query.translation)
      ? req.query.translation
      : 'almeida';
    const response = await fetch(`https://bible-api.com/${book.id}%20${chapter}?translation=${translation}`);
    if (!response.ok) throw new Error('Fonte bíblica indisponível');
    const data = await response.json();
    const reading = await BibleReading.exists({ user: req.user._id, book: book.id, chapter });

    res.json({
      book: book.name,
      bookId: book.id,
      chapter,
      reference: data.reference,
      verses: data.verses,
      translation,
      translationName: translations.find(item => item.id === translation).name,
      completed: Boolean(reading),
      xpReward: 10
    });
  } catch (err) {
    res.status(502).json({ message: 'Não foi possível carregar este capítulo agora' });
  }
});

router.post('/:book/:chapter/complete', auth, async (req, res) => {
  const book = books.find(item => item.id === req.params.book);
  const chapter = Number(req.params.chapter);

  if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) {
    return res.status(400).json({ message: 'Livro ou capítulo inválido' });
  }

  try {
    const existing = await BibleReading.findOne({ user: req.user._id, book: book.id, chapter });
    const user = await User.findById(req.user._id);

    if (!existing) {
      await BibleReading.create({ user: user._id, book: book.id, chapter });
      user.xp += 10;

      const today = new Date().toDateString();
      const lastActive = user.lastActive ? new Date(user.lastActive).toDateString() : null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActive === yesterday.toDateString()) user.streak++;
      else if (lastActive !== today) user.streak = 1;
      user.lastActive = new Date();
      await user.save();
    }

    res.json({ success: true, xpEarned: existing ? 0 : 10, newXp: user.xp, newStreak: user.streak });
  } catch (err) {
    if (err.code === 11000) {
      const user = await User.findById(req.user._id);
      return res.json({ success: true, xpEarned: 0, newXp: user.xp, newStreak: user.streak });
    }
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
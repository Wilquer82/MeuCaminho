const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Progress = require('../models/Progress');
const BibleReading = require('../models/BibleReading');

const categoryBooks = {
  pentateuco: ['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy'],
  juizes: ['joshua', 'judges', 'ruth', '1samuel', '2samuel', '1kings', '2kings', '1chronicles', '2chronicles', 'ezra', 'nehemiah', 'esther'],
  poeticos: ['job', 'psalms', 'proverbs', 'ecclesiastes', 'songofsolomon'],
  profetas: ['isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi'],
  evangelhos: ['matthew', 'mark', 'luke', 'john'],
  cartas: ['acts', 'romans', '1corinthians', '2corinthians', 'galatians', 'ephesians', 'philippians', 'colossians', '1thessalonians', '2thessalonians', '1timothy', '2timothy', 'titus', 'philemon', 'hebrews', 'james', '1peter', '2peter', '1john', '2john', '3john', 'jude'],
  apocalipse: ['revelation']
};

const chapterTotals = {
  genesis: 50, exodus: 40, leviticus: 27, numbers: 36, deuteronomy: 34,
  joshua: 24, judges: 21, ruth: 4, '1samuel': 31, '2samuel': 24,
  '1kings': 22, '2kings': 25, '1chronicles': 29, '2chronicles': 36,
  ezra: 10, nehemiah: 13, esther: 10, job: 42, psalms: 150, proverbs: 31,
  ecclesiastes: 12, songofsolomon: 8, isaiah: 66, jeremiah: 52, lamentations: 5,
  ezekiel: 48, daniel: 12, hosea: 14, joel: 3, amos: 9, obadiah: 1, jonah: 4,
  micah: 7, nahum: 3, habakkuk: 3, zephaniah: 3, haggai: 2, zechariah: 14,
  malachi: 4, matthew: 28, mark: 16, luke: 24, john: 21, acts: 28, romans: 16,
  '1corinthians': 16, '2corinthians': 13, galatians: 6, ephesians: 6,
  philippians: 4, colossians: 4, '1thessalonians': 5, '2thessalonians': 3,
  '1timothy': 6, '2timothy': 4, titus: 3, philemon: 1, hebrews: 13, james: 5,
  '1peter': 5, '2peter': 3, '1john': 5, '2john': 1, '3john': 1, jude: 1, revelation: 22
};

// GET /api/progress/me — Progresso do usuário
router.get('/me', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id })
      .populate('plan', 'name type category')
      .populate('completedLessons', 'title reference');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/progress/category/:category — Progresso por categoria
router.get('/category/:category', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      category: req.params.category
    }).populate('completedLessons');
    res.json(progress || { completedLessons: [], percentage: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/summary', auth, async (req, res) => {
  try {
    const readings = await BibleReading.find({ user: req.user._id }).select('book -_id');
    const uniqueBooks = [...new Set(readings.map(reading => reading.book))];
    const categories = Object.fromEntries(Object.entries(categoryBooks).map(([category, bookIds]) => {
      const completed = readings.filter(reading => bookIds.includes(reading.book)).length;
      const total = bookIds.reduce((sum, book) => sum + chapterTotals[book], 0);
      return [category, { completed, total, percentage: total ? Math.round((completed / total) * 100) : 0 }];
    }));

    res.json({
      totalChaptersRead: readings.length,
      uniqueBooksRead: uniqueBooks.length,
      readingXp: readings.length * 10,
      categories
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/activity', auth, async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = Number(req.query.month);
    const start = new Date(year, Number.isInteger(month) ? month : 0, 1);
    const end = new Date(year, Number.isInteger(month) ? month + 1 : 12, 1);
    const readings = await BibleReading.find({
      user: req.user._id,
      completedAt: { $gte: start, $lt: end }
    }).select('completedAt -_id');

    res.json([...new Set(readings.map(reading => new Date(reading.completedAt).getDate()))]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

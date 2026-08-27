const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['anual', 'semestral', 'livre', 'categoria'],
    required: true
  },
  category: {
    type: String,
    enum: ['pentateuco', 'juizes', 'poeticos', 'profetas',
           'evangelhos', 'cartas', 'apocalipse', 'teologia']
  },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  totalDays: Number,
  icon: String,
  color: String,
  unlockRequirement: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', planSchema);

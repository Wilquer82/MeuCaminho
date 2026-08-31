const mongoose = require('mongoose');
require('dotenv').config();
const Devotional = require('../models/Devotional');

const ptBrContent = {
  title: 'A paz que excede o entendimento',
  bibleReference: 'Filipenses 4:6-7',
  bibleText: 'Não andeis ansiosos por coisa alguma; antes, em tudo, sejam conhecidas diante de Deus as vossas petições; e a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus.',
  bibleVersion: 'NVI',
  reflection: 'A paz de Deus não nasce da ausência de problemas, mas da presença de Cristo no meio deles. Quando entregamos nossas preocupações ao Senhor, Ele nos guarda em um descanso que a mente humana não consegue produzir.',
  meditationQuestion: 'Qual preocupação você precisa entregar hoje ao Senhor?',
  prayer: 'Senhor, eu te entrego minhas angústias e peço a paz que só vem de Ti. Guarda meu coração e me ajuda a confiar em Teu cuidado.',
  category: 'fé',
  author: 'Meu Caminho de Luz',
  source: 'Meu Caminho de Luz'
};

(async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/verbovivo';

  try {
    await mongoose.connect(mongoUri);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEntry = await Devotional.findOne({ date: { $gte: today, $lt: tomorrow } });

    if (todayEntry) {
      await Devotional.updateOne({ _id: todayEntry._id }, { $set: { ...ptBrContent, date: today } });
      console.log('DEVOTIONAL_ATUALIZADO_HOJE');
    } else {
      await Devotional.create({ date: today, ...ptBrContent });
      console.log('DEVOTIONAL_CRIADO_HOJE');
    }

    const legacyMatches = await Devotional.find({
      $or: [
        { source: /^BibleGateway/i },
        { title: /Verse of the day|Versículo do dia/i },
        { author: { $ne: 'Meu Caminho de Luz' } }
      ]
    }).select('_id source title author');

    if (legacyMatches.length) {
      for (const item of legacyMatches) {
        await Devotional.updateOne({ _id: item._id }, { $set: { ...ptBrContent } });
      }
      console.log(`REGISTROS_LEGADOS_ATUALIZADOS=${legacyMatches.length}`);
    } else {
      console.log('SEM_REGISTROS_LEGADOS');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('ERR:', error.message);
    process.exit(1);
  }
})();

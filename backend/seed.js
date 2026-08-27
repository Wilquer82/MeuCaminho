const mongoose = require('mongoose');
require('dotenv').config();

const Lesson = require('./models/Lesson');
const Plan = require('./models/Plan');
const Devotional = require('./models/Devotional');
const Curiosity = require('./models/Curiosity');
const Mission = require('./models/Mission');
const QuizQuestion = require('./models/QuizQuestion');
const TheologyUnit = require('./models/TheologyUnit');
const User = require('./models/User');

const lessonData = [
  {
    title: 'A criação e a ordem de Deus',
    reference: 'Gênesis 1:1-2:3',
    text: 'No princípio, Deus criou os céus e a terra. E a terra era sem forma e vazia; e a escuridão cobria a face do abismo. E o Espírito de Deus se movia sobre as águas. Então disse Deus: "Haja luz".',
    hebrewTip: {
      word: 'ברא',
      transliteration: 'bara',
      pronunciation: 'ba-ra',
      meaning: 'criar, produzir algo novo',
      root: 'ברא',
      grammar: 'verbo qal perfeito',
      occurrences: 'Gênesis 1:1',
      crossReferences: ['Isaías 43:7', 'Salmo 33:6'],
      culturalContext: 'A criação é apresentada como ato soberano de Deus, sem necessidade de matéria pré-existente.',
      source: 'BDB'
    },
    greekTip: {
      word: 'κτίσις',
      transliteration: 'ktisis',
      pronunciation: 'kti-sis',
      meaning: 'criação',
      root: 'κτίζω',
      grammar: 'substantivo feminino',
      occurrences: 'Romanos 1:20',
      crossReferences: ['Colossenses 1:16'],
      culturalContext: 'No pensamento grego, havia a ideia de criação contínua, mas o conceito bíblico é de criação ex nihilo.',
      source: 'BDAG'
    },
    category: 'pentateuco',
    unit: 1,
    order: 1,
    xpReward: 20,
    isFree: true
  },
  {
    title: 'A fidelidade de Abraão',
    reference: 'Gênesis 12:1-9',
    text: 'Partiu, pois, Abrão, como o Senhor lhe dissera; e Ló foi com ele. Abrão tinha setenta e cinco anos quando saiu de Harã.',
    hebrewTip: {
      word: 'אמן',
      transliteration: 'aman',
      pronunciation: 'a-man',
      meaning: 'confirmar, sustentar, confiar',
      root: 'אמן',
      grammar: 'verbo raiz',
      occurrences: 'Gênesis 15:6',
      crossReferences: ['Romanos 4:3', 'Hebreus 11:8'],
      culturalContext: 'A fé de Abraão é um modelo de confiança em uma promessa que ainda não se cumpria.',
      source: 'BDB'
    },
    greekTip: {
      word: 'πίστις',
      transliteration: 'pistis',
      pronunciation: 'pis-tis',
      meaning: 'fé, confiança',
      root: 'πιστεύω',
      grammar: 'substantivo feminino',
      occurrences: 'Hebreus 11:1',
      crossReferences: ['Romanos 1:17'],
      culturalContext: 'A fé no NT é uma resposta pessoal à revelação de Deus.',
      source: 'BDAG'
    },
    category: 'pentateuco',
    unit: 1,
    order: 2,
    xpReward: 20,
    isFree: true
  },
  {
    title: 'O coração de Davi',
    reference: 'Salmo 23:1-6',
    text: 'O Senhor é o meu pastor; nada me faltará. Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.',
    hebrewTip: {
      word: 'רחם',
      transliteration: 'racham',
      pronunciation: 'ra-kham',
      meaning: 'compaixão, misericórdia',
      root: 'רחם',
      grammar: 'verbo raiz',
      occurrences: 'Salmo 23:6',
      crossReferences: ['Deuteronômio 4:31', 'Lamentações 3:22'],
      culturalContext: 'O salmo destaca a provisão e cuidado íntimo de Deus.',
      source: 'BDB'
    },
    greekTip: {
      word: 'ἔλεος',
      transliteration: 'eleos',
      pronunciation: 'e-le-os',
      meaning: 'misericórdia, compaixão',
      root: 'ἐλεέω',
      grammar: 'substantivo neutro',
      occurrences: 'Lucas 1:50',
      crossReferences: ['Tiago 2:13'],
      culturalContext: 'No NT, a misericórdia de Deus é manifestada em Cristo.',
      source: 'BDAG'
    },
    category: 'poeticos',
    unit: 1,
    order: 1,
    xpReward: 20,
    isFree: true
  },
  {
    title: 'O chamado de Jesus',
    reference: 'Mateus 4:18-22',
    text: 'Andando ao longo do mar da Galileia, viu dois irmãos, Simão e André, os quais lançavam a rede no mar; eram pescadores.',
    hebrewTip: {
      word: 'שָׁלַח',
      transliteration: 'shalach',
      pronunciation: 'sha-lach',
      meaning: 'enviar, mandar',
      root: 'שלח',
      grammar: 'verbo qal perfeito',
      occurrences: 'Exodo 4:13',
      crossReferences: ['Isaías 6:8'],
      culturalContext: 'O chamado de Jesus é uma missão de discipulado e confiança.',
      source: 'BDB'
    },
    greekTip: {
      word: 'καλέω',
      transliteration: 'kaleo',
      pronunciation: 'ka-le-o',
      meaning: 'chamar',
      root: 'καλέω',
      grammar: 'verbo presente',
      occurrences: 'Mateus 4:21',
      crossReferences: ['João 1:43'],
      culturalContext: 'O chamado no NT envolve convite à comunidade e à missão.',
      source: 'BDAG'
    },
    category: 'evangelhos',
    unit: 1,
    order: 1,
    xpReward: 20,
    isFree: true
  }
];

const devotionalData = {
  date: new Date(),
  title: 'A paz que excede o entendimento',
  bibleReference: 'Filipenses 4:6-7',
  bibleText: 'Não andeis ansiosos por coisa alguma; antes, em tudo, sejam conhecidas diante de Deus as vossas petições; e a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus.',
  bibleVersion: 'NVI',
  reflection: 'A paz de Deus não nasce da ausência de problemas, mas da presença de Cristo no meio deles. Quando entregamos nossas preocupações ao Senhor, Ele nos guarda em um descanso que a mente humana não consegue produzir.',
  meditationQuestion: 'Qual preocupação você precisa entregar hoje ao Senhor?',
  prayer: 'Senhor, eu te entrego minhas angústias e peço a paz que só vem de Ti. Guarda meu coração e me ajuda a confiar em Teu cuidado.',
  category: 'fé',
  author: 'VerboVivo',
  source: 'Filipenses 4:6-7'
};

const planData = [
  {
    name: 'Plano de Gênesis',
    description: 'Estudo inicial do Pentateuco com foco em criação, promessa e fé.',
    type: 'categoria',
    category: 'pentateuco',
    totalDays: 30,
    icon: '📖',
    color: '#2E7D32',
    unlockRequirement: 0
  },
  {
    name: 'Plano de Salmos',
    description: 'Exploração da linguagem emocional e espiritual dos salmos.',
    type: 'categoria',
    category: 'poeticos',
    totalDays: 30,
    icon: '🎵',
    color: '#F9A825',
    unlockRequirement: 0
  },
  {
    name: 'Plano dos Evangelhos',
    description: 'Leitura do ministério e do chamado de Jesus.',
    type: 'categoria',
    category: 'evangelhos',
    totalDays: 30,
    icon: '✨',
    color: '#1976D2',
    unlockRequirement: 0
  }
];

const curiosityData = [
  {
    title: 'A criação no começo da Bíblia',
    content: 'No texto hebraico, o verbo “criou” aparece no início do relato, mostrando que a criação é obra exclusiva de Deus e não resultado de forças naturais ou mitológicas.',
    category: 'histórica',
    bibleReference: 'Gênesis 1:1',
    source: 'Bíblia e contextos antigos',
    sourceUrl: 'https://www.bibliaonline.com.br',
    image: ''
  },
  {
    title: 'Por que o hebraico destaca o coração?',
    content: 'No contexto bíblico, o coração representa a vontade, o juízo e a íntima vida espiritual do ser humano, não somente as emoções.',
    category: 'hebraico',
    bibleReference: 'Provérbios 4:23',
    source: 'Lexicon Hebraico',
    sourceUrl: 'https://example.com',
    image: ''
  }
];

const missionData = [
  {
    title: 'Primeiro passo no caminho',
    description: 'Complete sua primeira lição do dia para iniciar a rotina.',
    type: 'diária',
    requirement: { type: 'lessons', target: 1 },
    xpReward: 50,
    medalReward: '🌱',
    titleReward: 'Iniciante'
  },
  {
    title: 'Consistência semanal',
    description: 'Mantenha uma sequência de estudos durante a semana.',
    type: 'semanal',
    requirement: { type: 'streak', target: 3 },
    xpReward: 80,
    medalReward: '🔥',
    titleReward: 'Constante'
  }
];

const quizData = [
  {
    question: 'Qual versículo mostra a promessa de Deus a Abraão?',
    options: ['Gênesis 12:1', 'Gênesis 1:1', 'Salmo 23:1', 'Mateus 4:19'],
    correctIndex: 0,
    explanation: 'A chamada de Abraão aparece em Gênesis 12:1, quando Deus lhe manda sair e promete fazer dele uma grande nação.',
    difficulty: 'básico',
    xpReward: 15,
    category: 'conhecimento'
  },
  {
    question: 'Qual é a ideia central do Salmo 23?',
    options: ['O Senhor é o meu pastor', 'Os homens devem ser ricos', 'O mundo é caótico', 'Deus está distante'],
    correctIndex: 0,
    explanation: 'O salmo enfatiza cuidado, direção, descanso e proteção do Senhor.',
    difficulty: 'básico',
    xpReward: 15,
    category: 'citação'
  }
];

const theologyData = [
  {
    title: 'A criação e a soberania de Deus',
    order: 1,
    description: 'Entenda como a Bíblia revela a criação como ato soberano do Criador.',
    topics: ['Criação', 'Soberania', 'Providência'],
    bibleReferences: ['Gênesis 1:1', 'Salmo 24:1'],
    sources: [{ name: 'Confissão de Westminster', url: 'https://example.com' }],
    isPremium: false,
    xpReward: 50
  },
  {
    title: 'A fé e a justiça de Deus',
    order: 2,
    description: 'Estudo dos fundamentos da fé e da confiança no Senhor.',
    topics: ['Fé', 'Justiça', 'Promises'],
    bibleReferences: ['Hebreus 11:1', 'Romanos 1:17'],
    sources: [{ name: 'Teologia básica', url: 'https://example.com' }],
    isPremium: false,
    xpReward: 50
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado ao MongoDB para seed');

    await Promise.all([
      User.deleteMany({}),
      Lesson.deleteMany({}),
      Plan.deleteMany({}),
      Devotional.deleteMany({}),
      Curiosity.deleteMany({}),
      Mission.deleteMany({}),
      QuizQuestion.deleteMany({}),
      TheologyUnit.deleteMany({})
    ]);

    const createdLessons = await Lesson.insertMany(lessonData);

    const createdPlans = await Plan.insertMany(
      planData.map((plan, index) => ({
        ...plan,
        lessons: createdLessons.slice(index * 1, (index + 1) * 1).map(l => l._id)
      }))
    );

    await Devotional.create({
      ...devotionalData,
      date: new Date()
    });

    await Curiosity.insertMany(curiosityData);
    await Mission.insertMany(missionData);
    await QuizQuestion.insertMany(quizData);
    await TheologyUnit.insertMany(theologyData);

    const demoPassword = '123456';
    const demoUser = await User.create({
      name: 'Usuário Demo',
      email: 'demo@verbovivo.com',
      password: demoPassword
    });

    console.log('✅ Seed concluído');
    console.log('Login demo:');
    console.log('Email: demo@verbovivo.com');
    console.log('Senha: 123456');
    console.log('Usuário criado:', demoUser.email);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no seed:', error.message);
    process.exit(1);
  }
}

seed();

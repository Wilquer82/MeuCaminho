const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);

    // Remove índice de uma versão antiga do modelo User.
    try {
      await User.collection.dropIndex('username_1');
      console.log('✅ Índice legado username_1 removido');
    } catch (err) {
      if (err.codeName !== 'IndexNotFound') throw err;
    }
  } catch (err) {
    console.error(`❌ Erro na conexão: ${err.message}`);
    process.exit(1);
  }
};

module.exports = conectarDB;

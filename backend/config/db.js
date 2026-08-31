const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);

    const collections = await conn.connection.db.listCollections({ name: 'users' }).toArray();
    const userCollectionExists = collections.length > 0;

    if (userCollectionExists) {
      try {
        await User.collection.dropIndex('username_1');
        console.log('✅ Índice legado username_1 removido');
      } catch (err) {
        const isExpectedMissingIndex =
          err?.codeName === 'IndexNotFound' ||
          /ns not found|index.*not found/i.test(err?.message || '');

        if (!isExpectedMissingIndex) {
          throw err;
        }
      }
    }
  } catch (err) {
    console.error(`❌ Erro na conexão: ${err.message}`);
    process.exit(1);
  }
};

module.exports = conectarDB;

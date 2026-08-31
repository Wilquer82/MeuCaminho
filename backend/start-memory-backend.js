const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');

(async () => {
  const mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  process.env.JWT_SECRET = 'test-secret';
  process.env.PORT = '3000';

  require('./server.js');

  const waitForServer = () => setTimeout(async () => {
    try {
      const existing = await User.findOne({ email: 'jose@gmail.com' });
      if (!existing) {
        await User.create({
          name: 'Jose',
          email: 'jose@gmail.com',
          password: '123456'
        });
        console.log('✅ Usuário de teste criado: jose@gmail.com / 123456');
      } else {
        console.log('✅ Usuário de teste já existe: jose@gmail.com / 123456');
      }
    } catch (error) {
      console.error('❌ Erro ao criar usuário de teste:', error.message);
    }
  }, 2500);

  waitForServer();
})();

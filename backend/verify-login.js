const { MongoMemoryServer } = require('mongodb-memory-server');
const http = require('http');

(async () => {
  const mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  process.env.JWT_SECRET = 'test-secret';
  process.env.PORT = '3456';

  require('./server.js');

  const registerPayload = JSON.stringify({
    name: 'Teste',
    email: 'teste@exemplo.com',
    password: '123456'
  });

  setTimeout(() => {
    const registerReq = http.request({
      host: '127.0.0.1',
      port: 3456,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(registerPayload)
      }
    }, (registerRes) => {
      let registerBody = '';
      registerRes.on('data', (chunk) => {
        registerBody += chunk;
      });
      registerRes.on('end', () => {
        console.log('REGISTER_STATUS', registerRes.statusCode);
        console.log('REGISTER_BODY', registerBody);

        const loginPayload = JSON.stringify({
          email: 'teste@exemplo.com',
          password: '123456'
        });

        const loginReq = http.request({
          host: '127.0.0.1',
          port: 3456,
          path: '/api/auth/login',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(loginPayload)
          }
        }, (loginRes) => {
          let loginBody = '';
          loginRes.on('data', (chunk) => {
            loginBody += chunk;
          });
          loginRes.on('end', () => {
            console.log('LOGIN_STATUS', loginRes.statusCode);
            console.log('LOGIN_BODY', loginBody);
            process.exit(loginRes.statusCode === 200 ? 0 : 1);
          });
        });

        loginReq.on('error', (error) => {
          console.error('LOGIN_ERROR', error.message);
          process.exit(1);
        });

        loginReq.write(loginPayload);
        loginReq.end();
      });
    });

    registerReq.on('error', (error) => {
      console.error('REGISTER_ERROR', error.message);
      process.exit(1);
    });

    registerReq.write(registerPayload);
    registerReq.end();
  }, 3000);
})();

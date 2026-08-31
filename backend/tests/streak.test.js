const test = require('node:test');
const assert = require('node:assert');
const User = require('../models/User');

test('deve incrementar a streak quando o usuário esteve ativo no dia anterior', () => {
  const user = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: '123456',
    streak: 1,
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000)
  });

  user.applyDailyStreak();

  assert.equal(user.streak, 2);
});

test('deve resetar a streak para 1 quando não houver atividade no dia anterior', () => {
  const user = new User({
    name: 'Test User',
    email: 'test2@example.com',
    password: '123456',
    streak: 3,
    lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  });

  user.applyDailyStreak();

  assert.equal(user.streak, 1);
});

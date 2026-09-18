process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-ci';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const { app } = require('../src/app');

let mongo;

beforeAll(async () => {
  
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
  } else {
   
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  }
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  
  if (mongo) {
    await mongo.stop();
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) await collections[key].deleteMany({});
});

const registerUser = async (overrides = {}) => {
  const payload = { name: 'Jane Doe', email: 'jane@test.com', password: 'password123', ...overrides };
  const res = await request(app).post('/api/auth/register').send(payload);
  return res;
};

const loginUser = async (email, password) => {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res;
};

module.exports = { app, request, registerUser, loginUser };
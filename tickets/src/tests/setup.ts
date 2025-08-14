// tests/setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { beforeAll, beforeEach, afterAll } from '@jest/globals';
import app from '../app'; 

let mongo: MongoMemoryServer;

declare global {
  // Add 'signin' to the globalThis type
  var signin: () => Promise<string[]>;
}

beforeAll(async () => {
  process.env.JWT_KEY = 'testsecret'; // Needed if your middleware depends on it

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri, {
    dbName: 'jest',
  });
});

beforeEach(async () => {
  // Clean all collections between tests
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection is not established.');
  }
  const collections = await db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'password123'
    })
    .expect(201);

  const cookies = response.get('Set-Cookie');
  return cookies ? cookies : [];
};


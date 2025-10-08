// tests/setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { beforeAll, beforeEach, afterAll } from '@jest/globals';
import app from '../app'; 

let mongo: MongoMemoryServer;

declare global {
  // Add 'signin' to the globalThis type
  var signin: () => Promise<string[]>;
}

jest.mock('../nats-wrapper');

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
  jest.clearAllMocks();
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

  // We can't signup that causes dependency on auth service instead generate a cookie
/*
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'password123'
    })
    .expect(201);

  const cookies = response.get('Set-Cookie');
  return cookies ? cookies : [];
*/

//cookie is generated base64 out of JSON {"jwt": token}

  //make payload
  const payload = {
    id: 'testid',
    email: 'test@example.com'
  };

  // Generate a JWT token
  const token = jwt.sign(payload, process.env.JWT_KEY! || 'default_jwt_key');

  //generate cookie
  const session = { jwt: token };
  const base64 = Buffer.from(JSON.stringify(session)).toString('base64');
  
  const cookie = `session=${base64}; HttpOnly; Path=/; SameSite=Strict;`;
  return [cookie];
};


// tests/setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { beforeAll, beforeEach, afterAll } from '@jest/globals';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret'; // Needed if your middleware depends on it

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


import mongoose from 'mongoose';
import app from './app';
import { DatabaseConnectionError } from './errors/database-connection-error';

// Connect to Mongo and start server
(async () => {
  //check for env variables
  if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined in environment variables');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    throw new DatabaseConnectionError();
  }


  app.listen(3000, () => {
    console.log('🚀 Listening on port 3000!');
  });
})();
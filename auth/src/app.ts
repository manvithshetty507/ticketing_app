// app.ts
import express from 'express';
import mongoose from 'mongoose';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { signinRouter } from './routes/signin';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { DatabaseConnectionError } from './errors/database-connection-error';

const app = express();

// Middleware
app.set('trust proxy', true); 
// traffic is proxied via ingress -> and express should be aware traffic is proxied even though https

app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: true
}));

// Routes
app.use('/api/users', currentUserRouter);
app.use('/api/users', signupRouter);
app.use('/api/users', signoutRouter);
app.use('/api/users', signinRouter);

// 404 handler
app.all('*', async () => {
  throw new NotFoundError();
});

// Global error handler
app.use(errorHandler);

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

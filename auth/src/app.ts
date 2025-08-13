// app.ts
import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { signinRouter } from './routes/signin';
import { errorHandler, NotFoundError } from '@ms_tickets_app/common';


const app = express();

// Middleware
app.set('trust proxy', true); 
// traffic is proxied via ingress -> and express should be aware traffic is proxied even though https

app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test' ? true : false
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

export default app;

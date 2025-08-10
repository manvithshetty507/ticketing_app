// app.ts
import express from 'express';

import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { signinRouter } from './routes/signin';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
// Middleware
app.set('trust proxy', true);
app.use(express.json());

// Routes
app.use('/api/users', currentUserRouter);
app.use('/api/users', signupRouter);
app.use('/api/users', signoutRouter);
app.use('/api/users', signinRouter);

// 404
app.all('*', async () => {
  throw new NotFoundError();
});

// error-handler
app.use(errorHandler);


// run server
app.listen(3000, () => {
  console.log('Listening on port 3000!');
}); 


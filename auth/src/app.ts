import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import  { currentUserRouter }  from './routes/current-user';

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

//API's
app.use(currentUserRouter);


//routes


//run server
app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

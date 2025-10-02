import mongoose from 'mongoose';
import app from './app';
// import { DatabaseConnectionError } from '@ms_tickets_app/common';
import { natsWrapper } from './nats-wrapper';

// Connect to Mongo and start server
(async () => {
  //check for env variables
  if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined in environment variables');
  }

  try {
    await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets');
    //cluster Id from nats.depl command check c_id
    await natsWrapper.connect('ticketing', 'client_id_random', 'http://nats-srv:4222')

    natsWrapper.client.on('close', () => {
      console.log("Nats is shutting off")
      process.exit();
    })

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    // throw new DatabaseConnectionError();
    console.error('❌ Error connecting to MongoDB:', error);
  }


  app.listen(3000, () => {
    console.log('🚀 Listening on port 3000!');
  });
})();
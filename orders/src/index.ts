import mongoose from 'mongoose';
import app from './app';
// import { DatabaseConnectionError } from '@ms_tickets_app/common';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';

// Connect to Mongo and start server
(async () => {
  //check for env variables
  if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined in environment variables');
  }
  if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('NATS_CLUSTER_ID must be defined in environment variables');
  }
  if (!process.env.NATS_URL) {
      throw new Error('NATS_URL must be defined in environment variables');
  }
  if (!process.env.NATS_CLIENT_ID) {
      throw new Error('NATS_CLIENT_ID must be defined in environment variables');
  }
  if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined in environment variables');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    //cluster Id from nats.depl command check c_id
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)

    natsWrapper.client.on('close', () => {
      console.log("Nats is shutting off")
      process.exit();
    })

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    console.log('[BOOT] Listeners registered ✅');
    
  } catch (error) {
    // throw new DatabaseConnectionError();
    console.error('❌ Error connecting to MongoDB:', error);
  }


  app.listen(3000, () => {
    console.log('🚀 Listening on port 3000!');
  });
})();
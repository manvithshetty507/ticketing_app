// import { DatabaseConnectionError } from '@ms_tickets_app/common';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

// Connect to Mongo and start server
(async () => {
  //check for env variables
  if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('NATS_CLUSTER_ID must be defined in environment variables');
  }
  if (!process.env.NATS_URL) {
      throw new Error('NATS_URL must be defined in environment variables');
  }
  if (!process.env.NATS_CLIENT_ID) {
      throw new Error('NATS_CLIENT_ID must be defined in environment variables');
  }

  try {
    //cluster Id from nats.depl command check c_id
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)

    natsWrapper.client.on('close', () => {
      console.log("Nats is shutting off")
      process.exit();
    })

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    
  } catch (error) {
    // throw new DatabaseConnectionError();
    console.error('❌ Error connecting to MongoDB:', error);
  }
})();
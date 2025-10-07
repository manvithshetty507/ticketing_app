import {Request, Response} from 'express';
import { Ticket } from '../models/ticket-model';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

export const newTicketController = async (req: Request, res: Response) => {
  const { title, price } = req.body;

  // Validate request data
  if (!title || !price) {
    return res.status(400).send({ error: 'Title and price are required' });
  }

  // Create a new ticket
  const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
  await ticket.save();

  // publish event "ticket:created"
  new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    version: ticket.version,
    title: ticket.title, 
    price: ticket.price, 
    userId: ticket.userId
  });
  
  res.status(201).send(ticket);
};

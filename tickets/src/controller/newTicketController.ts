import {Request, Response} from 'express';
import { Ticket } from '../models/ticket-model';

export const newTicketController = async (req: Request, res: Response) => {
  const { title, price } = req.body;

  // Validate request data
  if (!title || !price) {
    return res.status(400).send({ error: 'Title and price are required' });
  }

  // Create a new ticket
  const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
  await ticket.save();

  
  res.status(201).send(ticket);
};

import { Ticket } from "../models/ticket-model";
import {Request, Response} from 'express';

export const showTicket = async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).send();
  }
  res.status(200).send(ticket);
};


export const postTicket = async (req: Request, res: Response) => {
    const { title, price, userId } = req.body;
    const ticket = Ticket.build({ title, price, userId });
    await ticket.save();
    res.status(201).send(ticket);
}
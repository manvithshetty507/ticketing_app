import { BadRequestError, NotAuthorizedError, NotFoundError } from "@ms_tickets_app/common";
import { Ticket } from "../models/ticket-model";
import { Request, Response } from "express";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

export const updateTicketController = async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        console.log("ticket not found")
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }


    if(ticket.orderId) {
      throw new BadRequestError('Ticket is reserved so cant edit this ticket');
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
};
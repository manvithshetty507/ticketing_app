import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket-model';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
     const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        return res.status(404).send();
    }
    res.status(200).send(ticket);
});

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({})

    res.send(tickets);
});

export {router as showTicketRouter};
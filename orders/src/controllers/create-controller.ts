import {Request, Response} from 'express';
import { Ticket } from '../models/ticket';
import { BadRequestError, NotFoundError } from '@ms_tickets_app/common';
import { Order, OrderStatus } from '../models/order';

const EXPIRATION_WINDOW_SECONDS = 10 * 60;

export const createController = async (req: Request, res: Response) => {
    //Find the ticket the user is trying to order
    // if we fail to get the ticket - could be already purchased or hoax aor any other reason
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if(!ticket) {
        throw new NotFoundError();
    }

    //make sure ticket not reserved by someone else and then reserve it for 10 mins
    
    // const existingOrder = await Ticket.findOne({
    //     ticket: ticket,
    //     status: {
    //         $in: [
    //             OrderStatus.Created,
    //             OrderStatus.AwaitingPayment,
    //             OrderStatus.Completed
    //         ]
    //     }
    // })
    //added above logn to ticket model
    const existingOrder = await Ticket.isReserved();

    if(existingOrder) {
        throw new BadRequestError('The requested ticket is not available');
    }
    //calculated expire time
    const expireTime = new Date();
    expireTime.setSeconds(expireTime.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //Build order and save it
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expireTime,
        ticket: ticket,
    })

    await order.save();

    // Publish an event order was created

}
import { currentUserMiddleware, NotAuthorizedError, NotFoundError, requireAuth } from '@ms_tickets_app/common';
import express, {Request, Response} from 'express';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { OrderCancelledEvent } from '@ms_tickets_app/common';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', currentUserMiddleware, requireAuth, async (req: Request, res: Response) => {
    const orderId = req.params.orderId
    const order = await Order.findById(orderId).populate('ticket');

    if(!order) {
        throw new NotFoundError();
    }

    // add check for userId and order.userId doesn't match
    if(order.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError();
    }

    // update status to cancelled
    order.status = OrderStatus.Cancelled;
    await order.save();
    
    // order cancelled event publish
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id
        }
    })
    res.status(204).send(order);
})

export {router as deleteOrderRouter}
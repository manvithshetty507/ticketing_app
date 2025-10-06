import { currentUserMiddleware, NotAuthorizedError, NotFoundError, requireAuth } from '@ms_tickets_app/common';
import express, {Request, Response} from 'express';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:orderId', currentUserMiddleware, requireAuth, async (req: Request, res: Response) => {
    const orderId = req.params.orderId
    const order = await Order.findById(orderId);

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

    res.status(204).send(order);
})

export {router as deleteOrderRouter}
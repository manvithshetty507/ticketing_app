import { currentUserMiddleware, NotAuthorizedError, NotFoundError, requireAuth } from '@ms_tickets_app/common';
import express, {Request, Response} from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId', currentUserMiddleware, requireAuth ,async (req: Request, res: Response) => {
    
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('ticket');

    if(!order) {
        throw new NotFoundError();
    }

    // add check for userId and order.userId doesn't match
    if(order.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError();
    }

    res.status(200).send(order)
})

export {router as getAllOrderRouter}
import { currentUserMiddleware, requireAuth } from '@ms_tickets_app/common';
import express from 'express';
import { showOrdersController } from '../controllers/show-orders-controller';

const router = express.Router();

router.get('/api/orders', 
    currentUserMiddleware, 
    requireAuth, showOrdersController)

export {router as showOrderRouter}
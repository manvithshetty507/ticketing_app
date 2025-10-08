import express from 'express';
import { body } from 'express-validator';
import { currentUserMiddleware, requireAuth, ValidateRequestMiddleware } from '@ms_tickets_app/common';
import { newChargeController } from '../controllers/new-charge-controller';

const router = express.Router();

router
    .post('/api/payments', [
        body('token')
        .not()
        .isEmpty()
        .withMessage('Token is not provided'),
        body('orderId')
        .not()
        .isEmpty()
        .withMessage('orderId must be provided')
    ], 
    currentUserMiddleware, 
    ValidateRequestMiddleware,
    requireAuth, 
    newChargeController)

export { router as newChargeRouter };
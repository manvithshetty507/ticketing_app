import express from 'express';
import mongoose from 'mongoose';
import { createController } from '../controllers/create-controller';
import { requireAuth, ValidateRequestMiddleware } from '@ms_tickets_app/common';
import {body} from 'express-validator';

const router = express.Router();

router.post('/api/orders', requireAuth, [
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('ticket must be provided'),
], ValidateRequestMiddleware, createController);

export {router as createOrderRoute}
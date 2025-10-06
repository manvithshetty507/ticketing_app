import express from 'express';
import mongoose from 'mongoose';
import { createController } from '../controllers/create-controller';
import { currentUserMiddleware, requireAuth, ValidateRequestMiddleware } from '@ms_tickets_app/common';
import {body} from 'express-validator';

const router = express.Router();

router.post('/api/orders',  [
    body('ticketId')
      .notEmpty()
      .withMessage('Ticket ID must be provided')
      .bail()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket ID must be a valid MongoDB ObjectId'),
  ], currentUserMiddleware, requireAuth, ValidateRequestMiddleware, createController);

export {router as createOrderRoute}
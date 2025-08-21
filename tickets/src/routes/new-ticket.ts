import express, { Request, Response } from 'express';
import { newTicketController } from '../controller/newTicketController';
import { currentUserMiddleware, requireAuth, ValidateRequestMiddleware } from '@ms_tickets_app/common';
import { body } from 'express-validator';

const router = express.Router();

router.post('/api/tickets', [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0')
], currentUserMiddleware, requireAuth, ValidateRequestMiddleware, newTicketController);

export {router as newTicketRouter};

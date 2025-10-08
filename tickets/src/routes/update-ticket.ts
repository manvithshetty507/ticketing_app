import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  ValidateRequestMiddleware,
  currentUserMiddleware,
  requireAuth,
} from '@ms_tickets_app/common';
import { updateTicketController } from '../controller/update-ticket-controller';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  currentUserMiddleware,
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  ValidateRequestMiddleware, updateTicketController)

export { router as updateTicketRouter };

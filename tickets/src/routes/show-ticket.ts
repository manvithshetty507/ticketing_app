import express from 'express';
import { showTicket, postTicket } from '../controller/shotTicketController';

const router = express.Router();

router.get('/api/tickets/:id', showTicket);
router.post('/api/tickets', postTicket);

export {router as showTicketRouter};
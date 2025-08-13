import express, { Request, Response } from 'express';
import { userController } from '../controller/userController-current-user';
import { currentUserMiddleware, requireAuth } from '@ms_tickets_app/common';

const router = express.Router();

router
    .get("/currentUser", currentUserMiddleware, requireAuth, userController)

export { router as currentUserRouter };

import express, { Request, Response } from 'express';
import { userController } from '../controller/userController-current-user';
import { currentUserMiddleware } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router
    .get("/currentUser", currentUserMiddleware, requireAuth, userController)

export { router as currentUserRouter };

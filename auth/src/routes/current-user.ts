import express, { Request, Response } from 'express';

const router = express.Router();

router
    .get("/api/users/currentUser", (req : Request, res: Response) => {
        console.log('Current User route hit');
        res.send('Welcome to the Auth Service');
    })

export { router as currentUserRouter };

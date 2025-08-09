import express, { Request, Response } from 'express';

const router = express.Router();

router
    .post("/api/users/signin", (req: Request, res: Response) => {
        console.log('Sign In route hit');
        res.send('Sign In successful');
    })

export { router as signinRouter };
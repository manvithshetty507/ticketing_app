import express, { Request, Response } from 'express';

const router = express.Router();

router
    .post("/api/users/signout", (req: Request, res: Response) => {
        console.log('Sign Out route hit');
        res.send('Sign Out successful');
    })

export { router as signoutRouter };
import express, { Request, Response } from 'express';

const router = express.Router();

router
    .post("/api/users/signup", (req: Request, res: Response) => {
        console.log('Sign Up route hit');   
        // Here you would typically handle user registration logic
        res.send('Sign Up successful');
    })

export { router as signupRouter };
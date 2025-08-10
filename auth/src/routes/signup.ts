import e from 'express';
import express, { Request, Response } from 'express';
import { body, validationResult } from "express-validator";

const router = express.Router();

router
    .post("/signup", [
        body('email')
        .isEmail()
        .withMessage('Invalid email format'),
        body('password')
        .trim()
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be between 6 and 20 characters long')
    ], (req: Request, res: Response) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
       
        const { email, password } = req.body;

        // Handle user signup logic here

        res.status(201).send({
            message: 'User signed up successfully',
            user: {
                email
            }
        });

    })

export { router as signupRouter };
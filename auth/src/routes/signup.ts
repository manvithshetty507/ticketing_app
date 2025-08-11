import e from 'express';
import express, { Request, Response } from 'express';
import { body, validationResult } from "express-validator";
import { userController } from '../controller/userController-signup';
import { ValidateRequestMiddleware } from "../middlewares/validate-request";

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
    ], ValidateRequestMiddleware, userController);

export { router as signupRouter };
import express from 'express';
import { body } from 'express-validator';
import { userController } from '../controller/userController-signin';
import { ValidateRequestMiddleware } from "../middlewares/validate-request";

const router = express.Router();

router
    .post("/signin", [
        body("email")
            .isEmail()
            .withMessage("Email must be valid"),
        body("password")
            .trim()
            .isLength({ min: 6, max: 20 })
            .withMessage("Password must be between 6 and 20 characters")
    ], ValidateRequestMiddleware, userController);

export { router as signinRouter };
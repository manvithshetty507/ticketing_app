import { Request, Response } from 'express';
import { Password } from '../services/password';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user-model';
import { BadRequestError } from '../errors/bad-request-error';
import { JWTUtil } from '../services/Json-web-token';

export const userController = async (req: Request, res: Response) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    // check if the user with email exists
    const user = await User.findOne({ email });

    if (!user) {
        throw new BadRequestError("Invalid credentials");
    }

    //compare passwords
    const isPasswordValid = await Password.compare(user.password, password);
    if (!isPasswordValid) {
        throw new BadRequestError("Invalid credentials");
    }

    // generate JWT
    const token = JWTUtil.generateToken(user.id, user.email);

    // store JWT in session
    req.session = { jwt: token };

    return res.status(200).send(user);

};
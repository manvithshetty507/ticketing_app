import { Request, Response, NextFunction as Next } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

const ValidateRequestMiddleware = (req: Request, res: Response, next: Next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    next();
};

export { ValidateRequestMiddleware };
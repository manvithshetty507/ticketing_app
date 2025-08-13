import { Request, Response, NextFunction as Next } from 'express';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { CustomError } from '../errors/custom-error';

//Response Structure
/*
    {
        errors: {
            message: string;
            field: string; //eg: email, password ...
        }[]
    }
*/

export const errorHandler = (err: Error, req: Request, res: Response, next: Next) => {

    // all error extends CustomError -> so we can use that to catch all error
    if(err instanceof CustomError) {
        return res.status(err.statusCode).json({errors: err.serializeErrors()});
    }
    
    res.status(400).json({
        message: 'Something went wrong',
        error: err.message
    });
}
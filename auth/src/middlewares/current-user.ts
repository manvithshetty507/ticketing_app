import {Request, Response, NextFunction as Next} from 'express';
import jwt from 'jsonwebtoken';

interface userPayload {
    id: string;
    email: string;
}

// to add new property to already existing Request interface
declare global {
    namespace Express {
        interface Request {
            currentUser?: userPayload;
        }
    }
}

export const currentUserMiddleware = (req: Request, res: Response, next: Next) => {
    // if logged in add a current user property 
    if(!req.session?.jwt) {
        return next();
    }

    const token = req.session.jwt;

    try{
        const user = jwt.verify(token, process.env.JWT_KEY!) as userPayload;
        // req.currentUser = user; -> typescript doesn't have currentUser in req object
        // we need to augment ts with new currentUser
        req.currentUser = user;
    } catch (err) {
        console.error('Error verifying token:', err);
    }

    next();
}
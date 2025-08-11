import { Request, Response } from 'express'

export const userController = async (req: Request, res: Response) => {

    // Since req.currentUser property added to req no need for below logic 

/*
    if(!req.session?.jwt) {
        return res.status(401).send({ currentUser: null });
    }

    const token = req.session.jwt;

    // Verify the token and extract user information
    const user = JWTUtil.verifyToken(token);

    if (!user) {
        return res.status(401).send({ currentUser: null });
    }
*/
    return res.status(200).send({ currentUser: req.currentUser || null });
};
import express, { Request, Response } from 'express';

const router = express.Router();

router
    .post("/signout", (req: Request, res: Response) => {
        // Clear the session cookie
        req.session = null;

        // Respond with a success message
        res.status(204).send({});
    })

export { router as signoutRouter };
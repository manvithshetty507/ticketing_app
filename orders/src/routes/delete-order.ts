import express, {Request, Response} from 'express';

const router = express.Router();

router.delete('/api/orders/:id', async (req: Request, res: Response) => {
    return res.status(200).json({msg: "test success"})
})

export {router as deleteOrderRouter}
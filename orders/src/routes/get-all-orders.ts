import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/api/orders', async (req: Request, res: Response) => {
    return res.status(200).json({msg: "test success"})
})

export {router as getAllOrderRouter}
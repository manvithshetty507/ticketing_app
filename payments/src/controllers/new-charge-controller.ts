import { Request, Response } from "express";
import { Order } from "../models/order";
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus } from "@ms_tickets_app/common";

export const newChargeController = async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if(!order) {
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if(order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Cannot initiate payment for expired order');
    }

    res.send({})
}
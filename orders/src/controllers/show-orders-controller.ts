import { Request, Response } from "express";
import { Order } from "../models/order";

export const showOrdersController = async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;

  // Await the query and populate the ticket
  const orders = await Order.find({ userId }).populate('ticket');

  res.status(200).send(orders);
};

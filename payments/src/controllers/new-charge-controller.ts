import { Request, Response } from "express";
import { Order } from "../models/order";
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus } from "@ms_tickets_app/common";
import { stripe } from "../stripe";
import { Payment } from "../models/payments";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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

   // Create a PaymentMethod from the token
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            token: token
        }
    });

    // Create and confirm PaymentIntent with the PaymentMethod
    const charge = await stripe.paymentIntents.create({
        amount: order.price * 100,
        currency: 'inr',
        payment_method: paymentMethod.id,
        confirm: true,
        return_url: 'https://example.com/complete'
    });

    // create a payment record -> not used but good to keep

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    // publish payment created event
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    })

    res.status(201).send({ id: payment.id });
}
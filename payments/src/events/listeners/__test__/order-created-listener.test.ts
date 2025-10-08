import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { OrderCreatedEvent, OrderStatus } from "@ms_tickets_app/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    // need to order for this
    const orderId = new mongoose.Types.ObjectId().toHexString()

    // fake data and msg Obj to mimic NATS
    const data: OrderCreatedEvent['data'] = {
        id: orderId,
        version: 0,
        expiresAt: 'random_date',
        userId: 'random123',
        status: OrderStatus.Created,
        ticket: {
            id: 'randomid123',
            price: 999
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };
}

it('replicated order info', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(msg.ack).toHaveBeenCalled()
})
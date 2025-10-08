import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { Order, OrderStatus } from "../../../models/order";
import { ExpirationCompleteEvent } from "@ms_tickets_app/common";
import { Message } from "node-nats-streaming";
import { setFips } from "crypto";

const setup = async () => {

    const listener = new ExpirationCompleteListener(natsWrapper.client);

    // create ticket and order to expire it and then cancel

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 999
    })

    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'random124',
        expiresAt: new Date(),
        ticket
    })

    await order.save();

    // build data and msg of NATS

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, order, data, msg };
}

it('updates the order status to cancelled', async () => {
    const { listener, ticket, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emits an order cancelled event', async () => {
    const { listener, ticket, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(eventData.id).toEqual(order.id);
})

it('ack message is called', async () => {
    const { listener, ticket, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})
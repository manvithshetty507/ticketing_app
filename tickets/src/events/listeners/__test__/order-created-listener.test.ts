import { OrderCreatedEvent, OrderStatus } from "@ms_tickets_app/common";
import { Ticket } from "../../../models/ticket-model";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose, { set } from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    // create a listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // create and save ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 999,
        userId: 'random123'
    })

    await ticket.save();

    // create a fake data and msg object (NATS)
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(), // orderId
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'random',
        ticket: {
            id: ticket.id, // 👈 must match
            price: ticket.price,
        },
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg };
}

it('it sets the userId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();

    //listener
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    //updated ticket test
    expect(updatedTicket?.orderId).toEqual(data.id);

})

it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();

    //listener
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('publishes a ticket:updated event', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(data.id).toEqual(ticketUpdatedData.orderId);
})
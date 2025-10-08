import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { Ticket } from "../../../models/ticket-model";
import { OrderCancelledEvent } from "@ms_tickets_app/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    // create listener, data and msg

    const listener = new OrderCancelledListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'concert',
        price: 999,
        userId:' random123',
    })
    const orderId =  new mongoose.Types.ObjectId().toHexString();
    ticket.set({ orderId });
    await ticket.save();

    // cancelled data and msg (NATS mock)
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, msg, listener, ticket, orderId };
}

it('updates the ticket, publish event and also acks it', async () => {

    const { data, msg, listener, ticket, orderId } = await setup();

    // this should update the ticket
    await listener.onMessage(data, msg);

    // updated ticket
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
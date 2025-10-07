import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedEvent } from "@ms_tickets_app/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // create a instance of listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // make a fake event data
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'concert',
        price: 1000,
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    // make a fake Message object (NATS)
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };
}

it('creates and save the ticket', async () => {
    const { listener, data, msg } = await setup();

    // make a call onMessage in listener with above event -> fabricated onMessage
    await listener.onMessage(data, msg);

    // write assertions for ticket created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    // make a call onMessage in listener with above event -> fabricated onMessage
    await listener.onMessage(data, msg);

    // write assertions for ticket created
    expect(msg.ack).toHaveBeenCalled();
})
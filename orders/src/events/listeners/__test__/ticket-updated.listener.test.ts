import { TicketUpdatedEvent } from "@ms_tickets_app/common"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"

const setup = async () => {
    //create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    // create and save ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 1000,
    });
    await ticket.save();
    //create data and msg object 
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: 'testUserId'
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    // return all above
    return { ticket, data, msg, listener };
}

it('find, saves and updates the ticket', async () => {

    const { ticket, data, msg, listener } = await setup();

    // fake an event
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
})

it('acks the update event', async () => {
    const { ticket, data, msg, listener } = await setup();

    // fake an event
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('acks not to be called in case of mismatched version', async () => {
    const { ticket, data, msg, listener } = await setup();

    // fake an event
    try {
        await listener.onMessage({...data, version: 10}, msg);
    }catch(err) {
        
    }

    expect(msg.ack).not.toHaveBeenCalled()
})
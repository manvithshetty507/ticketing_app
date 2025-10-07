import { doesNotMatch } from "assert";
import { Ticket } from "../ticket-model";

it('implements the optimistic con-currency control', async () => {
    // create a ticket and save it
    const ticket = Ticket.build({
        title: 'concert',
        price: 2000,
        userId: 'random1234'
    })

    await ticket.save();
    // fetch the ticket twice
    const ticketOne = await Ticket.findById(ticket.id);
    const ticketTwo = await Ticket.findById(ticket.id);

    // make 2 separate changes to the above ticket via update
    ticketOne!.set({ price: 1000 })
    ticketTwo!.set({ price: 1500 })

    // save the first ticket -> we expect it to work
    await ticketOne?.save();
    // second save must fail -> because of version number
    try {
        await ticketTwo?.save();
    }catch(err) {
        return;
    }

    throw new Error('Test should have returned since an error expected for second save')
})

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 1000,
        userId: 'randomId123'
    })

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})
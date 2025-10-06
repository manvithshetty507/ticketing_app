import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent, TicketUpdatedEvent, NotFoundError } from "@ms_tickets_app/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        const ticket = await Ticket.findById(data.id);

        if(!ticket) {
            throw new Error('Ticket not found');
        }

        const { title, price } = data;
        ticket.set({ title, price });

        ticket.save();

        // acknowledge the message for nats
        msg.ack();
    }

}
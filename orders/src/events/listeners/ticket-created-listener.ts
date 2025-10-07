import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@ms_tickets_app/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = queueGroupName;
    
    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        try {
            const { id, title, price } = data;
            const ticket = Ticket.build({ id, title, price });
            await ticket.save();

            msg.ack();
        } catch (error) {
            console.error('Error processing TicketCreated event', error);
            // Do NOT ack the message, so NATS will retry it later
        }
    }
}
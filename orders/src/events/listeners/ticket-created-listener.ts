import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@ms_tickets_app/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = queueGroupName;
    
    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        
        // we will persist some data from ticket, so that we decouple from the ticket service
        console.log('[orders] TicketCreatedListener received data:', data);
        const { id, title, price } = data;
        const ticket = Ticket.build({ id, title, price });
        await ticket.save();

        // acknowledge the message 
        msg.ack();
    }
}
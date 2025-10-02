import { Message } from "node-nats-streaming";
import { Listener } from "@ms_tickets_app/common";
import { TicketCreatedEvent } from "@ms_tickets_app/common";
import { Subjects } from "@ms_tickets_app/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject:Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payment-service';

    onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
        console.log("Event data :", data)

        msg.ack();
    }
    
}
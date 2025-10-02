import { Publisher, Subjects, TicketCreatedEvent } from "@ms_tickets_app/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    
}
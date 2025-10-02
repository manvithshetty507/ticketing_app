import { Publisher, Subjects, TicketUpdatedEvent } from "@ms_tickets_app/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
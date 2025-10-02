import { Publisher } from "@ms_tickets_app/common";
import { TicketCreatedEvent } from "@ms_tickets_app/common";
import { Subjects } from "@ms_tickets_app/common";

export  class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    
}
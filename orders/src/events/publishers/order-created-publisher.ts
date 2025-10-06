import { Publisher, OrderCreatedEvent, Subjects } from "@ms_tickets_app/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

}


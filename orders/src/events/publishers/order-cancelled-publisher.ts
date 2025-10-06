import { Publisher, OrderCreatedEvent, Subjects, OrderCancelledEvent } from "@ms_tickets_app/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
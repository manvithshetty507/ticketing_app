import { PaymentCreatedEvent, Publisher, Subjects } from "@ms_tickets_app/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
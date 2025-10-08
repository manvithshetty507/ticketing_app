import { ExpirationCompleteEvent, Publisher, Subjects } from "@ms_tickets_app/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
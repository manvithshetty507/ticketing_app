import { Listener, OrderCreatedEvent, Subjects } from "@ms_tickets_app/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        // below is the delay in milliseconds 
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        // implementation on receiving a msg
        // expiration via bull library of 10 mins -> enqueue the jon for bull
        await expirationQueue.add({
            orderId: data.id,
        }, {
            delay,
        })

        msg.ack();
    }

}
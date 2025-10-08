import { Listener, OrderCreatedEvent, Subjects } from "@ms_tickets_app/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName; 
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        
        // on order creation we need to store the order for awaiting payment and then process the payment
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            version: data.version,
            userId: data.userId
        })

        await order.save();

        msg.ack();
    }

}
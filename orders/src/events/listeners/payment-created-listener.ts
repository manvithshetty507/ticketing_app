import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@ms_tickets_app/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
        // upon payment created need to update order status

        const order = await Order.findById(data.orderId);

        if(!order) {
            throw new Error("Didn't find the order to updated payment status")
        }
        order.set({ status: OrderStatus.Completed })

        await order.save();

        msg.ack();
    }

}
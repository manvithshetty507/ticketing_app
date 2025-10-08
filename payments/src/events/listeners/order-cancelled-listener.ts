import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@ms_tickets_app/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
        // just need to update order status to cancelled
        const order = await Order.findByEvent(data);

        if(!order) {
            throw new Error('Order not found')
        }
        order?.set({ status: OrderStatus.Cancelled });

        await order?.save();

        msg.ack();
    }

}
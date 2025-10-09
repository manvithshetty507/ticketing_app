import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@ms_tickets_app/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName: string = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
        // order must be cancelled and ticket must become available again (ticket service handles this)
        const order = await Order.findById(data.orderId).populate('ticket');

        if(!order) {
            throw new Error('Order Not Found')
        }
        // if orders is already paid for no need to cancel
        if(order.status === OrderStatus.Completed) {
            return msg.ack();
        }

        order.set({
            status: OrderStatus.Cancelled
        })

        await order.save();

        // publish the order cancelled
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }

}
import { Listener, OrderCancelledEvent, Subjects } from "@ms_tickets_app/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket-model";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
       
        const ticket = await Ticket.findById(data.ticket.id);
        
        if(!ticket) {
            throw new Error('Ticket Not Found');
        }

        // ticket not reserved anymore
        ticket.set({ orderId: undefined})
        await ticket.save();

        // publish the cancel event so other services catchup
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            userId: ticket.userId,
            title: ticket.title,
            price: ticket.price,
            version: ticket.version
        })

        msg.ack()
    }

}
import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@ms_tickets_app/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket-model";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated =Subjects.OrderCreated ;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        
        // order created processing -> we need to lock that ticket so no one else orders it
        //1. find the ticket that order is reserving, if no ticket throw an error
        //2. if theres a ticket add the orderId property

        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket) {
            throw new Error('Ticket Not Found');
        }

        //add orderId to ticket to make it reserved
        ticket.set({ orderId: data.id });
        await ticket.save();
        
        //we are updating ticket and this can cause version no to be out of sync with ticket service (which is the original copy)
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            version: ticket.version,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId
        });

        //acknowledge the message
        msg.ack();
    }

}
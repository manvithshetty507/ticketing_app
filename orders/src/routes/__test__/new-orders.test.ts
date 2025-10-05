import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

it("return an error if the user tries to order ticket that doesn't exists", async () => {
    const ticketId = new mongoose.Types.ObjectId();
    const cookies = await global.signin();
    
    await request(app)
        .post('/api/orders')
        .set('Cookie', cookies[0])
        .send({ ticketId })
        .expect(404);
})

it('It fails when the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    })

    await ticket.save();

    const order = Order.build({
        ticket,
        userId: '',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })

    await order.save();

    await request(app)
        .post('/api/orders')
        .send({
            ticketId: ticket.id
        })
        .expect(400)
})
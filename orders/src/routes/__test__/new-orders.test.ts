import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it("return an error if the user tries to order ticket that doesn't exists", async () => {
    const ticketId = new mongoose.Types.ObjectId();
    const cookies = await global.signin('test123');
    
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
        userId: 'randomuserId',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })

    await order.save();
    const cookies = await global.signin('test123');
    // Basic existence check
    expect(cookies).toBeDefined();
    expect(Array.isArray(cookies)).toBe(true);
    expect(cookies.length).toBeGreaterThan(0);

    await request(app)
        .post('/api/orders')
        .set('Cookie', cookies[0])
        .send({ ticketId: ticket.id })
        .expect(400)
    
})

it("create a success ticket", async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    })

    await ticket.save();

    const cookies = await global.signin('test123');

    // Basic existence check
    expect(cookies).toBeDefined();
    expect(Array.isArray(cookies)).toBe(true);
    expect(cookies.length).toBeGreaterThan(0);

    await request(app)
        .post('/api/orders')
        .set('Cookie', cookies[0])
        .send({ ticketId: ticket.id })
        .expect(201)
})

it('emit order created event', async () => {
     const ticket = Ticket.build({
        title: 'concert',
        price: 20
    })

    await ticket.save();

    const cookies = await global.signin('test123');

    // Basic existence check
    expect(cookies).toBeDefined();
    expect(Array.isArray(cookies)).toBe(true);
    expect(cookies.length).toBeGreaterThan(0);

    await request(app)
        .post('/api/orders')
        .set('Cookie', cookies[0])
        .send({ ticketId: ticket.id })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
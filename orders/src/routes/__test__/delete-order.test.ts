import request from 'supertest'
import app from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import mongoose from 'mongoose'

it('cancels the order when done by appropriate user', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20000,
        id: new mongoose.Types.ObjectId().toHexString(),
    })

    await ticket.save();

    const [ user ] = await global.signin('randomuserId');

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    // cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    const { body:updatedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)

    
    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);

})

it('cancel fails if done by wrong user', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20000,
        id: new mongoose.Types.ObjectId().toHexString(),
    })

    await ticket.save();

    const [ user ] = await global.signin('randomuserId');
    const [ nonAuthorizeduser ] = await global.signin('nonAuthorizeduser');

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    // cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', nonAuthorizeduser)
        .send()
        .expect(401)
})

it.todo('emit event after update order status')
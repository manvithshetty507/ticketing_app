import request from 'supertest'
import app from '../../app'
import { Ticket } from '../../models/ticket'
import { Order } from '../../models/order'

it('fetches the order', async () => {

    const ticket = Ticket.build({
        title: 'concert',
        price: 20000
    })

    await ticket.save();

    const [ user ] = await global.signin('randomuserId');

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)


    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)

    expect(order.id).toEqual(fetchedOrder.id)
})

it('return a error when a user featching a order that belongs to someone else', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20000
    })

    await ticket.save();

    const [ user ] = await global.signin('randomuserId');
    const [ nonAuthorizeduser ] = await global.signin('nonauthorizeduserId')

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)


    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', nonAuthorizeduser)
        .send()
        .expect(401)
})
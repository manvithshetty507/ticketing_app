import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async (title: string, price: number) => {
    const ticket = Ticket.build({ title, price });
    await ticket.save()
    return ticket;
}

it('fetches orders for a particular user', async () => {
    // create 3 tickets
    const ticketOne = await buildTicket('f1', 20000);
    const ticketTwo = await buildTicket('concert', 15000);
    const ticketThree = await buildTicket('football', 2000);

    // add tickets to 2 different users
    const [ userOne ] = await global.signin('test1');
    const [ usersTwo ] = await global.signin('test2');

    // write test for 2 users
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201)

    const {body: orderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie', usersTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201)

    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', usersTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201)

    //test for userTwo

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', usersTwo)
        .expect(200)
    
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);

    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);
})
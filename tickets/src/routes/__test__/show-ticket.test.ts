import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';

it('show 404 if the ticket is not found', async () => {
  const response = await request(app)
  .get(`/api/tickets/${new mongoose.Types.ObjectId()}`)
  ;
  console.log(response.body);
  expect(response.status).toBe(404);
});

it('show the ticket if it is found', async () => {
  const cookie = await global.signin();
  const { body:createTicketResponse } = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie[0])
    .send({
      title: 'test ticket',
      price: 20
    });

    const response = await request(app)
      .get(`/api/tickets/${createTicketResponse.id}`)
      .set('Cookie', cookie)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', createTicketResponse.title);
    expect(response.body).toHaveProperty('price', createTicketResponse.price);
});
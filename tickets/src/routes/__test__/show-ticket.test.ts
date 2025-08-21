import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';

it('show 404 if the ticket is not found', async () => {
  const response = await request(app).get(`/api/tickets/${new mongoose.Types.ObjectId()}`);
  console.log(response.body);
  expect(response.status).toBe(404);
});

it('show the ticket if it is found', async () => {
    const title = "Test Ticket";
    const price = 100;
    const userId = "testUserId";
    const cookie = await global.signin();

    const createTicketResponse = await request(app)
    .post('api/tickets')
    .set('Cookie', cookie)
    .send({ title, price, userId })
    .expect(201);

    const response = await request(app).get(`api/tickets/${createTicketResponse.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', title);
    expect(response.body).toHaveProperty('price', price);
});
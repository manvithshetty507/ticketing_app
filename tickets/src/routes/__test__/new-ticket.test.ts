import request from "supertest";
import app from '../../app'
import { natsWrapper } from "../../nats-wrapper";

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({
    title:'test ticket',
    price: 20
  });

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({
    title: 'test ticket',
    price: 20
  }).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie[0])
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
   const cookie = await global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie[0])
    .send({
      price: 20
    });

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid price is provided', async () => {
   const cookie = await global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie[0])
    .send({
      title: 'test ticket',
    });

  expect(response.status).not.toEqual(401);
});

it('creates a ticket with valid inputs', async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie[0])
    .send({
      title: 'test ticket',
      price: 20
    });

  expect(response.status).toBe(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
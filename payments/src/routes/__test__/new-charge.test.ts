import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@ms_tickets_app/common';

it("return a 404 when purchasing order that doesn't exists", async () => {
    const [ cookie ] = await global.signin();

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({ token : 'random1243', orderId: new mongoose.Types.ObjectId().toHexString() })
        .expect(404)
})

it("return 401 when purchase tried by invalid user", async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: orderId,
        userId: 'random1243',
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });
    await order.save();

    const [ cookie ] = await global.signin();

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({ token : 'random1243', orderId })
        .expect(401)
})

it("return 400 when purchasing a cancelled order", async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const [ cookie ] = await global.signin('random1243');

    const order = Order.build({
        id: orderId,
        userId: 'random1243',
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({ token : 'random1243', orderId })
        .expect(400)
})
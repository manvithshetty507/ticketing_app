import request from  'supertest'
import app from '../../app';

it('returns a 201 on successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: 'password123'
        });
    expect(response.status).toBe(201);
})

it('returns a 400 with an invalid email', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'invalid-email',
            password: 'password123'
        });
    expect(response.status).toBe(400);
})

it('returns a 400 with an invalid password', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: 'short'
        });
    expect(response.status).toBe(400);
})

it('returns a 400 with missing email & password', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({});
    expect(response.status).toBe(400);
})

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: 'password123'
        })
        .expect(201);
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: 'password123'
        })
        .expect(400);
});

// test for header set-cookie
it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: 'password123'
        }).expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});

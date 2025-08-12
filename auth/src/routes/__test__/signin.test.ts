import request from 'supertest';
import app from '../../app';

it('fails when email that does not exist is supplied', async () => {
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'nonexistent@example.com',
            password: 'password123'
        });
    expect(response.status).toBe(400);
});

it('fails when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: 'password123'
        }).expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@example.com',
            password: 'wrongpassword'
        }).expect(400);
})

it('this test pass with correct credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: 'password123'
        }).expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@example.com',
            password: 'password123'
        }).expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
    const cookie = response.get("Set-Cookie");
    if (!cookie) {
        throw new Error("Expected cookie but got undefined.");
    }
    
    expect(cookie[0]).toMatch(
        /^session=.*; path=\/; httponly/
    );
})

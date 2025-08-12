import request from 'supertest';
import app from '../../app';

it('it clears out cookie after signout', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: 'password123'
        }).expect(201);
    
    const response = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(204);
    
    const cookies = response.get('Set-Cookie');
    expect(cookies && cookies[0]).toEqual(
        'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );

})
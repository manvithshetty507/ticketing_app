import request from 'supertest';
import app from '../../app';

it('it returns the current user', async () => {

    const cookies = await global.signin()
    
    await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookies[0])
        .expect(200)
        .then(response => {
            expect(response.body.currentUser.email).toEqual('test@example.com');
        });
})

it('it returns with null if not authenticated', async () => {
    await request(app)
        .get('/api/users/currentuser')
        .expect(401)
})
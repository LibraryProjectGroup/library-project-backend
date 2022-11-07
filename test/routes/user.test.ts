import { test, describe, jest, afterAll } from '@jest/globals';
import request from 'supertest';
import { app, pool } from '../../src';

jest.mock('../../src/queries/session');
jest.mock('../../src/queries/user');

describe('GET /user', () => {
    test('get /user/all', async () => {
        return request(app)
            .get('/user/all')
            .set('Authorization', `Bearer 123`)
            .expect('Content-Type', /json/)
            .expect(200);
    });

    test('get /user', async () => {
        return request(app)
            .get('/user?id=1')
            .set('Authorization', `Bearer 123`)
            .expect('Content-Type', /json/)
            .expect(200);
    });

    test('get /username', async () => {
        return request(app)
            .get('/user/username?username=t1')
            .set('Authorization', `Bearer 123`)
            .expect('Content-Type', /json/)
            .expect(200);
    });

    test('get /user/session', async () => {
        return request(app)
            .get('/user/session')
            .set('Authorization', `Bearer 123`)
            .expect('Content-Type', /json/)
            .expect(200);
    });

    test('delete /user', async () => {
        return request(app)
            .delete('/user?id=1')
            .set('Authorization', `Bearer 123`)
            .expect('Content-Type', /json/)
            .expect(200);
    });

    test('post /user (for authorized user to use)', async () => {
        return (
            request(app)
                .post(
                    '/user?username=testy&password=encrypted gibberish&administrator=0'
                )
                /* 
                //replace above .post with this commented code to switch to using body
                .post('/user')
                .send({
                    username: 'testy',
                    password: 'encrypted gibberish',
                    administrator: 0,
                })
        */
                .set('Authorization', `Bearer 123`)
                .expect(200)
                .expect({
                    ok: {
                        id: 3,
                        username: 'testy',
                        passw: 'encrypted gibberish',
                        administrator: 0,
                    },
                })
        );
    });

    test('put /user', async () => {
        return (
            request(app)
                .put(
                    '/user?id=1&username=testy&password=encrypted gibberish&administrator=0'
                )
                /* 
                //replace above .put with this commented code to switch to using body
                .put('/user')
                .send({
                    id: 1,
                    username: 'testy',
                    password: 'encrypted gibberish',
                    administrator: 0,
                })
                */
                .set('Authorization', `Bearer 123`)
                .expect(200)
                .expect({ ok: true })
        );
    });
});

afterAll((done) => {
    pool.end();
    done();
});

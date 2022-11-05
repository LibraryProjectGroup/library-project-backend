import { test, describe, jest, afterAll } from '@jest/globals';
import request from 'supertest';
import { app, pool } from '../../src';

jest.mock('../../src/queries/session');

describe('GET /example', () => {
    test('get call should return 200 and content-type json', async () => {
        return request(app)
            .get('/example')
            .set('Authorization', `Bearer 123`)
            .expect('Content-Type', /json/)
            .expect(200);
    });
});

afterAll((done) => {
    pool.end();
    done();
});

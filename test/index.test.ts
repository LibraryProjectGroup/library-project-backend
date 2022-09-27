import { test, describe } from '@jest/globals';
import request from 'supertest';
import app from '../src/index';
 
describe('testing app get example', () => {
  test('get call should return 200', async () => {
    request(app)
    .get("/example")
    .expect("Content-Type", /json/)
    .expect(200)
  });
});
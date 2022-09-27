import { test, describe } from '@jest/globals';
import request from 'supertest';
import app from '../src/index';
 
describe('testing index file', () => {
  test('empty string should result in zero', async () => {
    request(app)
    .get("/example")
    .expect("Content-Type", /json/)
    .expect(200)
  });
});
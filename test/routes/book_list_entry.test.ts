import { test, describe, jest, afterAll } from '@jest/globals'
import request from 'supertest'
import { app, pool } from '../../src'

jest.mock('../../src/queries/session')
jest.mock('../../src/queries/book_list_entry')
jest.mock('../../src/queries/user')

describe('basic endpoint testing for /booklistentry', () => {
  test('get /booklistentry/all', async () => {
    return request(app)
      .get('/booklistentry/all')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get /booklistentry/list', async () => {
    return request(app)
      .get('/booklistentry/list?id=1')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get /booklistentry', async () => {
    return request(app)
      .get('/booklistentry?id=1')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('post /booklistentry', async () => {
    return request(app)
      .post('/booklistentry')
      .send({
        list: 1,
        book: 3,
      })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })

  test('delete /booklistentry', async () => {
    return request(app)
      .delete('/booklistentry')
      .send({
        id: 1,
      })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })
})

afterAll((done) => {
  pool.end()
  done()
})

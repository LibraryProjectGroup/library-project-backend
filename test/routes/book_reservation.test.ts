import { test, describe, jest, afterAll } from '@jest/globals'
import request from 'supertest'
import { app, pool } from '../../src'

jest.mock('../../src/queries/session')
jest.mock('../../src/queries/book_reservation')
jest.mock('../../src/queries/user')

describe('basic endpoint testing for /bookreservation', () => {
  test('get /bookreservation/all', async () => {
    return request(app)
      .get('/bookreservation/all')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get /bookreservation/all/current', async () => {
    return request(app)
      .get('/bookreservation/all/current')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get /bookreservation/all/extended', async () => {
    return request(app)
      .get('/bookreservation/all/extended')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get /bookreservation/user/current', async () => {
    return request(app)
      .post('/bookreservation/user/current')
      .send({ userId: 3 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get /bookreservation/book', async () => {
    return request(app)
      .get('/bookreservation/book')
      .send({ bookId: 1 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('add new reservation /bookreservation/', async () => {
    return request(app)
      .post('/bookreservation/')
      .send({ userId: 4, bookId: 5 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })

  test('cancel reservation /bookreservation/cancel', async () => {
    return request(app)
      .post('/bookreservation/cancel')
      .send({ bookId: 1 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })

  test('loan reservation /bookreservation/loan', async () => {
    return request(app)
      .post('/bookreservation/loan')
      .send({ bookId: 3 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })
})

afterAll((done) => {
  pool.end()
  done()
})

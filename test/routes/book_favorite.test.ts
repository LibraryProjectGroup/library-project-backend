import { test, describe, jest, afterAll } from '@jest/globals'
import request from 'supertest'
import { app, pool } from '../../src'

jest.mock('../../src/queries/session')
jest.mock('../../src/queries/book_favorite')
jest.mock('../../src/queries/user')

describe('basic endpoint testing for /favorite', () => {
  test('get /favorite/check', async () => {
    return request(app)
      .get('/favorite/check')
      .query({ bookId: 1 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ isFavorited: true })
  })

  test('get /favorite/count', async () => {
    return request(app)
      .get('/favorite/count')
      .query({ bookId: 1 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ count: 2 })
  })

  test('add favorite book to user /favorite', async () => {
    return request(app)
      .post('/favorite/')
      .send({ bookId: 3 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })

  test('delete favorite book from user /favorite', async () => {
    return request(app)
      .delete('/favorite/')
      .send({ bookId: 2 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })
})

afterAll((done) => {
  pool.end()
  done()
})

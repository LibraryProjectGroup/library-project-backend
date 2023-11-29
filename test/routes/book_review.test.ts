import { test, describe, jest, afterAll } from '@jest/globals'
import request from 'supertest'
import { app, pool } from '../../src'

jest.mock('../../src/queries/session')
jest.mock('../../src/queries/book_review')
jest.mock('../../src/queries/user')

describe('basic endpoint testing for /review', () => {
  test('get all bookreviews /review/all', async () => {
    return request(app)
      .get('/review/all')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get review by bookId /review/book', async () => {
    return request(app)
      .get('/review/book')
      .query({ bookId: 1 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get review average for book /review/average', async () => {
    return request(app)
      .get('/review/average')
      .query({ bookId: 1 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ averageRating: 4 })
  })

  test('delete review /review', async () => {
    return request(app)
      .delete('/review/')
      .send({ reviewId: 1 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })

  test('delete non-existing review /review', async () => {
    return request(app)
      .delete('/review/')
      .send({ reviewId: 16 })
      .set('Authorization', `Bearer 123`)
      .expect(404)
      .expect({ ok: false, error: 'Review not found.' })
  })

  test('add review /review', async () => {
    return request(app)
      .post('/review/')
      .send({ bookId: 1, comment: 'Nice book for testing', rating: 5 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })

  test('update review /review', async () => {
    return request(app)
      .put('/review/')
      .send({ rewiewId: 5, comment: 'Nevermind', rating: 1 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })
})

afterAll((done) => {
  pool.end()
  done()
})

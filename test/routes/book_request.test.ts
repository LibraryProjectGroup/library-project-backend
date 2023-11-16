import { test, describe, jest, afterAll } from '@jest/globals'
import request from 'supertest'
import { app, pool } from '../../src'

jest.mock('../../src/queries/session')
jest.mock('../../src/queries/book_request')
jest.mock('../../src/queries/user')

describe('basic endpoint testing for /bookrequest', () => {
  test('get all requests /bookrequest/all', async () => {
    return request(app)
      .get('/bookrequest/all')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('add new request for book /bookrequest', async () => {
    return request(app)
      .post('/bookrequest/')
      .send({
        isbn: '9789206334843',
        title: 'Cars',
        reason: 'It helps me focus',
      })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })

  test('update request status /bookrequest/updatestatus', async () => {
    return request(app)
      .put('/bookrequest/updatestatus')
      .send({ id: 2, status: 2 })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })
})

afterAll((done) => {
  pool.end()
  done()
})

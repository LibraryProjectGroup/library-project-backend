import { test, describe, jest, afterAll } from '@jest/globals'
import request from 'supertest'
import { app, pool } from '../../src'

jest.mock('../../src/queries/session')
jest.mock('../../src/queries/book_list')
jest.mock('../../src/queries/user')

describe('basic endpoint testing for /booklist', () => {
  test('get /booklist/all', async () => {
    return request(app)
      .get('/booklist/all')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get /booklist/user', async () => {
    return request(app)
      .get('/booklist/user')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get /booklist', async () => {
    return request(app)
      .get('/booklist')
      .send({
        id: 1,
      })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('put /booklist', async () => {
    return request(app)
      .put('/booklist')
      .send({
        id: 1,
        name: 'editedname',
      })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })

  test('post /booklist', async () => {
    return request(app)
      .post('/booklist')
      .send({
        name: 'name',
      })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })

  test('delete /booklist', async () => {
    return request(app)
      .delete('/booklist')
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

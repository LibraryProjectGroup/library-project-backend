import { test, describe, jest, afterAll } from '@jest/globals'
import request from 'supertest'
import { app, pool } from '../../src'

jest.mock('../../src/queries/session')
jest.mock('../../src/queries/user')

describe('tests for route /user', () => {
  test('get /user/all', async () => {
    return request(app)
      .get('/user/all')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get /user', async () => {
    return request(app)
      .get('/user?id=1')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get /user/session', async () => {
    return request(app)
      .get('/user/session')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  /**test('delete /user', async () => {
    return request(app)
      .delete('/user?id=1')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })
  */

  test('post /user //not admin', async () => {
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
            administrator: false,
          },
        })
    )
  })

  test('post /user //admin', async () => {
    return (
      request(app)
        .post(
          '/user?username=testy&password=encrypted gibberish&administrator=1'
        )
        /* 
                //replace above .post with this commented code to switch to using body
                .post('/user')
                .send({
                    username: 'testy',
                    password: 'encrypted gibberish',
                    administrator: 1,
                })
        */
        .set('Authorization', `Bearer 123`)
        .expect(200)
        .expect({
          ok: {
            id: 3,
            username: 'testy',
            passw: 'encrypted gibberish',
            administrator: true,
          },
        })
    )
  })

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
    )
  })
})

afterAll((done) => {
  pool.end()
  done()
})

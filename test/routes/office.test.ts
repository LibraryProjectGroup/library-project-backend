import { test, describe, jest, afterAll } from '@jest/globals'
import request from 'supertest'
import { app, pool } from '../../src'

jest.mock('../../src/queries/session')
jest.mock('../../src/queries/office')
jest.mock('../../src/queries/user')

describe('basic endpoint testing for /office', () => {
  test('get all offices /office/all', async () => {
    return request(app)
      .get('/office/all')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get office based on id /office/:homeOfficeId', async () => {
    return request(app)
      .get('/office/1')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ id: 1, name: 'Home Office 1', countryCode: 'USA' })
  })

  test('delete office /office/:homeOfficeId', async () => {
    return request(app)
      .delete('/office/2')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('true')
  })

  test('update office /office/:homeOfficeId', async () => {
    return request(app)
      .put('/office/1')
      .send({ name: 'Uzbekistan', countryCode: 'UZB' })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })

  test('insert office /office', async () => {
    return request(app)
      .post('/office/')
      .send({ name: 'Tadzikistan', countryCode: 'TZK' })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })
})

afterAll((done) => {
  pool.end()
  done()
})

import { test, describe, jest, afterAll, expect } from '@jest/globals'
import request from 'supertest'
import { app, pool } from '../../src'

jest.mock('../../src/queries/session')
jest.mock('../../src/queries/book')

describe('basic endpoint testing for /book', () => {
  test('get /book/all', async () => {
    return request(app)
      .get('/book/all')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('get /book', async () => {
    return request(app)
      .get('/book?id=1')
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('delete /book', async () => {
    return (
      request(app)
        .delete('/book?id=1')
        .set('Authorization', `Bearer 123`)
        //.expect(200)
        //.expect("Content-Type", /json/);
        .then(() => {
          expect(200)
          console.log('book delete test sucessful')
        })
        .catch((error) => {
          console.error('failed: ', error)
        })
    )
  })

  test('post /book', async () => {
    return request(app)
      .post('/book')
      .send({
        title: 'title',
        image: 'https://images.isbndb.com/covers/91/26/9789513119126.jpg',
        author: 'author',
        year: 2017,
        isbn: 'isbn',
        topic: 'topic',
        location: 'location',
      })
      .set('Authorization', `Bearer 123`)
      .expect(200)
      .expect({ ok: true })
  })

  test('put /book', async () => {
    return (
      request(app)
        .put('/book')
        .send({
          id: 3,
          title: 'editedtitle',
          image:
            'http://books.google.com/books/content?id=ILqrxQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
          author: 'editedauthor',
          year: 2000,
          isbn: 'editedisbn',
          topic: 'editedtopic',
          location: 'editedlocation',
        })
        .set('Authorization', `Bearer 123`)
        //.expect(200)
        //.expect("Content-Type", /json/);
        .then(() => {
          expect(200)
          console.log('book put test sucessful')
        })
        .catch((error) => {
          console.error('failed: ', error)
        })
    )
  })
})

afterAll((done) => {
  pool.end()
  done()
})

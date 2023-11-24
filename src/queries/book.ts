import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../index'
import Book from '../interfaces/book.interface'

export const getBookById = async (bookId: number): Promise<Book | null> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT book.*, ho.home_office_id AS homeOfficeId, ho.name AS homeOfficeName, ho.country_code AS homeOfficeCountry FROM book JOIN home_office ho USING (home_office_id) WHERE book.id = ?',
    [bookId]
  )
  return rows.length > 0 ? (rows[0] as Book) : null
}

export const getAllExistingBooks = async (): Promise<Book[]> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query(
    'SELECT book.*, ho.home_office_id AS homeOfficeId, ho.name AS homeOfficeName, ho.country_code AS homeOfficeCountry FROM book JOIN home_office ho USING (home_office_id) WHERE deleted != 1;'
  )
  return rows as Book[]
}

export const getAllBooksPaged = async (
  page: number,
  pageSize: number | null
): Promise<Book[]> => {
  let size = pageSize ? pageSize : 20
  let start = (page - 1) * size
  const promisePool = pool.promise()
  const [rows] = await promisePool.query(
    'SELECT book.*, ho.home_office_id AS homeOfficeId, ho.name AS homeOfficeName, ho.country_code AS homeOfficeCountry FROM book JOIN home_office ho USING (home_office_id) WHERE deleted != 1 limit ? offset ?',
    [size, start]
  )
  return rows as Book[]
}

export const getCountOfAllBooks = async (): Promise<Number | null> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as bookCount FROM book WHERE deleted != 1'
  )
  return rows.length > 0 ? (rows[0].bookCount as Number) : null
}

export const getAllBooks = async (): Promise<Book[]> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query('SELECT * FROM book')
  return rows as Book[]
}

export const deleteBook = async (bookId: number): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'DELETE FROM book WHERE id=?',
    [bookId]
  )
  return rows.affectedRows != 0
}

export const markBookAsDeleted = async (bookId: number): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'UPDATE book SET deleted=1 WHERE id=(?)',
    [bookId]
  )
  return rows.changedRows != 0
}

export const insertNewBook = async (
  userId: number,
  title: string,
  image: string,
  author: string,
  year: number,
  isbn: string,
  topic: string,
  description: string,
  language: string,
  homeOfficeId: string
): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'INSERT INTO book (library_user, title, image, author, year, topic, isbn, description, language, home_office_id) VALUES (?)',
    [
      [
        userId,
        title,
        image,
        author,
        year,
        topic,
        isbn,
        description,
        language,
        homeOfficeId,
      ],
    ]
  )
  return rows.affectedRows != 0
}

export const updateBook = async (book: Book): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'UPDATE book SET title=(?), image=(?), author=(?), year=(?), topic=(?), isbn=(?), description=(?), language=(?), home_office_id=(?) WHERE id=(?)',
    [
      book.title,
      book.image,
      book.author,
      book.year,
      book.topic,
      book.isbn,
      book.description,
      book.language,
      book.homeOfficeId,
      book.id,
    ]
  )
  return rows.changedRows != 0
}

export const getAllReservedBooks = async (): Promise<Book[]> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query(
    'select book.id, book.library_user, book.title, book.image, book.author, book.year, book.isbn, book.topic, book.description, book.language, book.deleted, ho.home_office_id AS homeOfficeId, ho.name AS homeOfficeName, ho.country_code AS homeOfficeCountry from book JOIN book_reservation AS reservation ON reservation.bookId = book.id JOIN home_office ho USING (home_office_id) WHERE reservation.canceled = 0 AND reservation.loaned = 0 AND book.deleted != 1;'
  )
  return rows as Book[]
}

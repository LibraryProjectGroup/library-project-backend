import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../index'
import Borrow from '../interfaces/borrow.interface'
import DetailedExpiredBorrow from '../interfaces/detailedExpiredBorrows.interface'

export const getAllBorrows = async (): Promise<Borrow[]> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query('SELECT * FROM borrowing')
  return rows as Borrow[]
}

export const getAllCurrentBorrows = async (): Promise<Borrow[]> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT * FROM borrowing WHERE returned = 0'
  )
  return rows as Borrow[]
}

export const getAllCurrentDetailedBorrows = async (): Promise<Borrow[]> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT library_user.username, book.title, borrowing.borrowDate, borrowing.dueDate, book.id FROM borrowing join book ON book.id = borrowing.book JOIN library_user ON library_user.id = borrowing.library_user WHERE borrowing.returned != 1'
  )
  return rows as Borrow[]
}

export const getBorrowById = async (
  borrowingId: number
): Promise<Borrow | null> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT * FROM borrowing WHERE id = ?',
    [borrowingId]
  )
  return rows.length > 0 ? (rows[0] as Borrow) : null
}

export const getCurrentBorrowByBookId = async (
  bookId: number
): Promise<Borrow | null> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT * FROM borrowing WHERE book = ? AND returned = 0',
    [bookId]
  )
  return rows.length > 0 ? (rows[0] as Borrow) : null
}

export const deleteBorrow = async (borrowingId: number): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'DELETE FROM borrowing WHERE id=?',
    [borrowingId]
  )
  return rows.affectedRows != 0
}

export const insertBorrow = async (
  userId: number,
  bookId: number,
  dueDate: Date,
  borrowDate: Date
): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'INSERT INTO borrowing (library_user, book, borrowDate, dueDate, returned) VALUES (?)',
    [[userId, bookId, dueDate, borrowDate, false]]
  )
  return rows.affectedRows != 0
}

export const updateBorrow = async (borrow: Borrow): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'UPDATE borrowing SET library_user=(?), book=(?), borrowDate=(?), dueDate=(?), returned=(?), returnDate=(?) WHERE id=(?)',
    [
      borrow.library_user,
      borrow.book,
      borrow.borrowDate,
      borrow.dueDate,
      borrow.returned,
      borrow.returnDate,
      borrow.id,
    ]
  )
  return rows.affectedRows != 0
}

export const isBookAvailable = async (bookId: number): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT * FROM borrowing WHERE book=(?) AND returned = 0',
    [bookId]
  )
  return rows.length == 0 ? true : false
}

export const getBorrowsByUserId = async (userId: number): Promise<Borrow[]> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT * FROM borrowing WHERE library_user = ? AND returned = 0',
    [userId]
  )
  return rows as Borrow[]
}

export const getExpiredBorrows = async (): Promise<Borrow[]> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT * FROM borrowing WHERE borrowing.dueDate < now() AND borrowing.returned = 0'
  )
  return rows as Borrow[]
}

export const getDetailedExpiredBorrows = async (): Promise<
  DetailedExpiredBorrow[]
> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT borrowing.id AS borrowId, borrowing.dueDate, book.title, book.id AS bookId, library_user.username, library_user.id AS userId FROM borrowing JOIN library_user ON library_user.id = borrowing.library_user JOIN book ON book.id= borrowing.book WHERE borrowing.dueDate < now() AND borrowing.returned = 0;'
  )
  return rows as DetailedExpiredBorrow[]
}

export const userHasBooksInLoan = async (userId: number): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS bookCount FROM borrowing WHERE library_user = ? AND returned = 0',
    [userId]
  )

  const bookCount = rows[0]?.bookCount || 0
  return bookCount > 0
}

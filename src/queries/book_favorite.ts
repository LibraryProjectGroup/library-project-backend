import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../index'
import Book_favorite from '../interfaces/book_favorite.interface'

// Add a favorite book for a user
export const addFavoriteBook = async (
  userId: number,
  bookId: number
): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'INSERT INTO favorite_books (user_id, book_id) VALUES (?, ?)',
    [userId, bookId]
  )
  return rows.affectedRows !== 0
}

// Remove a favorite book for a user
export const deleteFavoriteBook = async (
  userId: number,
  bookId: number
): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'DELETE FROM favorite_books WHERE user_id = ? AND book_id = ?',
    [userId, bookId]
  )
  return rows.affectedRows !== 0
}

// Check if a book is favorited by a user
export const isBookFavoritedByUser = async (
  userId: number,
  bookId: number
): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as favoriteCount FROM favorite_books WHERE user_id = ? AND book_id = ?',
    [userId, bookId]
  )
  const favoriteCount = rows[0].favoriteCount
  return favoriteCount > 0
}

// Get the count of favorites for a book
export const getFavoriteCountForBook = async (
  bookId: number
): Promise<number> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as favoriteCount FROM favorite_books WHERE book_id = ?',
    [bookId]
  )
  return rows[0].favoriteCount
}

export const getAllFavoriteCounts = async (): Promise<
  { bookId: number; favoriteCount: number }[]
> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT book_id, COUNT(*) as favoriteCount FROM favorite_books GROUP BY book_id'
  )

  const allFavoriteCounts = rows.map((row) => ({
    bookId: row.book_id,
    favoriteCount: row.favoriteCount,
  }))

  return allFavoriteCounts
}

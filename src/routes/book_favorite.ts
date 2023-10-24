import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { Response, Request, Router, NextFunction } from 'express'
import {
  addFavoriteBook,
  deleteFavoriteBook,
  isBookFavoritedByUser,
  getFavoriteCountForBook,
} from '../queries/book_favorite'
import Book_favorite from '../interfaces/book_favorite.interface'

const router = Router()

// Add a favorite book for a user
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.body
    const added = await addFavoriteBook(req.session.userId, bookId)
    if (added) {
      res.json({ ok: true })
    } else {
      res
        .status(400)
        .json({ ok: false, message: 'Failed to add favorite book' })
    }
  } catch (err) {
    next(err)
  }
})

// Remove a favorite book for a user
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.body
    const deleted = await deleteFavoriteBook(req.session.userId, bookId)
    if (deleted) {
      res.json({ ok: true })
    } else {
      res
        .status(400)
        .json({ ok: false, message: 'Failed to delete favorite book' })
    }
  } catch (err) {
    next(err)
  }
})

// Check if a book is favorited by a user
router.get(
  '/check',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.body
      const isFavorited = await isBookFavoritedByUser(
        Number(req.session.userId),
        Number(bookId)
      )

      if (isFavorited) {
        res.json({ isFavorited: true })
      } else {
        res.json({ isFavorited: false })
      }
    } catch (err) {
      next(err)
    }
  }
)

// Get the count of favorites for a book
router.get(
  '/count',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.body
      const count = await getFavoriteCountForBook(Number(bookId))

      if (count !== undefined) {
        res.json({ count })
      } else {
        res.status(404).json({ error: 'Book not found' })
      }
    } catch (err) {
      next(err)
    }
  }
)

export default router

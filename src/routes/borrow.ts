import { Response, Request, Router, NextFunction } from 'express'
import {
  insertBorrow,
  getAllBorrows,
  getBorrowById,
  deleteBorrow,
  updateBorrow,
  getAllCurrentBorrows,
  getAllCurrentDetailedBorrows,
  isBookAvailable,
  getBorrowsByUserId,
  getExpiredBorrows,
  getDetailedExpiredBorrows,
} from '../queries/borrow'
import Borrow from '../interfaces/borrow.interface'
import { getCurrentReservationForBook } from '../queries/book_reservation'

const BORROW_LENGTH = 10

const router = Router()

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getAllBorrows())
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getBorrowById(Number(req.query.id)))
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const borrow = await getBorrowById(req.body.borrowId)
    if (borrow && req.sessionUser.administrator) {
      res.json({
        ok: await deleteBorrow(req.body.borrowId),
      })
    } else {
      res.status(403).json({ ok: false })
    }
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let bookAvailable = await isBookAvailable(req.body.bookId)
    let bookReservationStatus = await getCurrentReservationForBook(req.body.bookId)
    if (bookAvailable && bookReservationStatus == null) {
      let dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + BORROW_LENGTH)
      res.json({
        ok: await insertBorrow(
          req.sessionUser.id,
          req.body.bookId,
          new Date(),
          dueDate
        ),
      })
    } else {
      return res.status(403).json({
        ok: false,
        message: 'Book not available for borrowing',
      })
    }
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedBorrow: Borrow = req.body
    updatedBorrow.library_user = req.sessionUser.id
    const borrow = await getBorrowById(updatedBorrow.id)
    if (
      borrow &&
      (borrow.library_user == req.sessionUser.id ||
        req.sessionUser.administrator)
    ) {
      res.json({ ok: await updateBorrow(borrow) })
    } else {
      res.status(403).json({ ok: false })
    }
  } catch (err) {
    next(err)
  }
})

router.get(
  '/current',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await getAllCurrentBorrows())
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  '/expired/admin',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await getDetailedExpiredBorrows())
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  '/current/admin',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await getAllCurrentDetailedBorrows())
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  '/expired',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await getExpiredBorrows())
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  '/session',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await getBorrowsByUserId(req.sessionUser.id))
    } catch (err) {
      next(err)
    }
  }
)

router.put(
  '/return',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const borrow = await getBorrowById(req.body.borrowId)
      if (
        borrow &&
        (borrow.library_user == req.sessionUser.id ||
          req.sessionUser.administrator)
      ) {
        borrow.returned = true
        borrow.returnDate = new Date()
        res.json({ ok: await updateBorrow(borrow) })
      } else {
        res.status(403).json({ ok: false })
      }
    } catch (err) {
      next(err)
    }
  }
)

export default router

import { Response, Request, Router, NextFunction } from 'express'
import {
  queryInsertBorrow,
  querySelectAllBorrows,
  querySelectBorrow,
  queryDeleteBorrow,
  queryUpdateBorrow,
  querySelectAllCurrentBorrows,
  querySelectAllCurrentBorrows2,
  queryBookIsAvailable,
  queryBorrowsByUserId,
  queryExpiredBorrows,
  queryDetailedExpiredBorrows,
} from '../queries/borrow'
import Borrow from '../interfaces/borrow.interface'

const BORROW_LENGTH = 10

const router = Router()

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await querySelectAllBorrows())
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await querySelectBorrow(Number(req.query.id)))
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const borrow = await querySelectBorrow(req.body.borrowId)
    if (borrow && req.sessionUser.administrator) {
      res.json({
        ok: await queryDeleteBorrow(req.body.borrowId),
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
    let bookAvailable = await queryBookIsAvailable(req.body.bookId)
    if (bookAvailable) {
      let dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + BORROW_LENGTH)
      res.json({
        ok: await queryInsertBorrow(
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
    const borrow = await querySelectBorrow(updatedBorrow.id)
    if (
      borrow &&
      (borrow.library_user == req.sessionUser.id ||
        req.sessionUser.administrator)
    ) {
      res.json({ ok: await queryUpdateBorrow(borrow) })
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
      res.json(await querySelectAllCurrentBorrows())
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  '/expired/admin',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await queryDetailedExpiredBorrows())
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  '/current/admin',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await querySelectAllCurrentBorrows2())
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  '/expired',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await queryExpiredBorrows())
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  '/session',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await queryBorrowsByUserId(req.sessionUser.id))
    } catch (err) {
      next(err)
    }
  }
)

router.put(
  '/return',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const borrow = await querySelectBorrow(req.body.borrowId)
      if (
        borrow &&
        (borrow.library_user == req.sessionUser.id ||
          req.sessionUser.administrator)
      ) {
        borrow.returned = true
        borrow.returnDate = new Date()
        res.json({ ok: await queryUpdateBorrow(borrow) })
      } else {
        res.status(403).json({ ok: false })
      }
    } catch (err) {
      next(err)
    }
  }
)

export default router

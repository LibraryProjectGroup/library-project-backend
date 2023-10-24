import { Response, Request, Router, NextFunction } from 'express'
import {
  getAllReservations,
  // getReservationById, // Currently unused
  insertReservation,
  // updateReservation, // Currently unused
  cancelReservation,
  loanReservation,
  getCurrentReservations,
  getAllExtendedReservations,
  getUserCurrentExtendedReservations,
  getCurrentReservationForBook,
} from '../queries/book_reservation'

const router = Router()

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getAllReservations())
  } catch (err) {
    next(err)
  }
})

router.get(
  '/all/current',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await getCurrentReservations())
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  '/all/extended',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await getAllExtendedReservations())
    } catch (err) {
      next(err)
    }
  }
)

router.get('/book', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getCurrentReservationForBook(req.body.bookId))
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      ok: await insertReservation(req.sessionUser.id, req.body.bookId),
    })
  } catch (err) {
    next(err)
  }
})

router.post(
  '/cancel',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        ok: await cancelReservation(req.body.bookId),
      })
    } catch (err) {
      next(err)
    }
  }
)

router.post(
  '/loan',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        ok: await loanReservation(req.body.bookId),
      })
    } catch (err) {
      next(err)
    }
  }
)

router.post(
  '/user/current',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await getUserCurrentExtendedReservations(req.body.userId))
    } catch (err) {
      next(err)
    }
  }
)

export default router

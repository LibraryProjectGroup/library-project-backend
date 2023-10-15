import { Response, Request, Router, NextFunction } from 'express'
import {
  querySelectAllReservations,
  //querySelectReservation, //currently unused
  queryInsertReservation,
  //queryUpdateReservation, //currently unused
  queryCancelReservation,
  queryLoanReservation,
  querySelectCurrentReservations,
  querySelectAllExtendedReservations,
  querySelectUserCurrentExtendedReservations,
  querySelectCurrentReservationForBook,
} from '../queries/book_reservation'

const router = Router()

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await querySelectAllReservations())
  } catch (err) {
    next(err)
  }
})

// Filtered
router.get(
  '/all/current',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await querySelectCurrentReservations())
    } catch (err) {
      next(err)
    }
  }
)

// Filtered
router.get(
  '/all/extended',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await querySelectAllExtendedReservations())
    } catch (err) {
      next(err)
    }
  }
)

// Filtered
router.get('/book', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await querySelectCurrentReservationForBook(req.body.bookId))
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      ok: await queryInsertReservation(req.sessionUser.id, req.body.bookId),
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
        ok: await queryCancelReservation(req.body.bookId),
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
        ok: await queryLoanReservation(req.body.bookId),
      })
    } catch (err) {
      next(err)
    }
  }
)

// Filtered
router.post(
  '/user/current',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await querySelectUserCurrentExtendedReservations(req.body.userId)
      )
    } catch (err) {
      next(err)
    }
  }
)

export default router

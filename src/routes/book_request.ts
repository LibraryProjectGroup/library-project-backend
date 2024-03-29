import { Response, Request, Router, NextFunction } from 'express'
import {
  getAllRequests,
  insertRequest,
  updateRequestStatus,
  getRequestById,
} from '../queries/book_request'

const router = Router()

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getAllRequests())
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      ok: await insertRequest(
        req.sessionUser.id,
        req.body.isbn,
        req.body.title,
        req.body.reason
      ),
    })
  } catch (err) {
    next(err)
  }
})

router.put(
  '/updatestatus',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.sessionUser.administrator) {
        res.json({
          ok: await updateRequestStatus(req.body.id, req.body.status),
        })
      } else {
        return res.status(403).json({ ok: false })
      }
    } catch (err) {
      next(err)
    }
  }
)

export default router

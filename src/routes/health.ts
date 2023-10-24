import { Request, Response, Router, NextFunction } from 'express'
import { getAllExistingBooks } from '../queries/book'

const router = Router()

router.get('', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getAllExistingBooks()
    res.json({ ok: true })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.toString() })
  }
})

export default router

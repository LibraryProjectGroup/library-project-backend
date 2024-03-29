import { Response, Request, Router, NextFunction } from 'express'
import {
  deleteHomeOffice,
  getAllHomeOffices,
  getHomeOfficeById,
  updateHomeOffice,
  insertHomeOffice,
} from '../queries/office'
import { HomeOffice } from '../interfaces/HomeOffice'

const router = Router()

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getAllHomeOffices())
  } catch (err) {
    next(err)
  }
})

router.get(
  '/:homeOfficeId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const homeOfficeId = Number(req.params.homeOfficeId)
      res.json(await getHomeOfficeById(homeOfficeId))
    } catch (err) {
      next(err)
    }
  }
)

router.delete(
  '/:homeOfficeId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const homeOfficeId = Number(req.params.homeOfficeId)
      res.json(await deleteHomeOffice(homeOfficeId))
    } catch (err) {
      next(err)
    }
  }
)

router.put(
  '/:homeOfficeId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const homeOfficeId = Number(req.params.homeOfficeId)
      const updatedOffice: HomeOffice = {
        ...req.body,
        id: homeOfficeId,
      }
      const officeExists = !!(await getHomeOfficeById(homeOfficeId))
      if (officeExists && req.sessionUser.administrator) {
        const ok = await updateHomeOffice(updatedOffice)
        res.json({ ok: ok })
      } else {
        res.status(403).json({ ok: false })
      }
    } catch (err) {
      next(err)
    }
  }
)

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.sessionUser.administrator) {
      res.json({
        ok: await insertHomeOffice(req.body.name, req.body.countryCode),
      })
    } else {
      res.status(403).json({ ok: false })
    }
  } catch (err) {
    next(err)
  }
})

export default router

import { Response, Request, Router, NextFunction } from 'express'
import { querySelectUser, queryUpdateUser } from '../queries/user'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

const RESET_TIMEOUT = 1000 * 60 * 60 * 24
const minPasswordLength = 3
const maxPasswordLength = 150

const router = Router()
const publicRouter = Router()

const activeResets: {
  [secret: string]: {
    userId: number
    timeCreated: Date
  }
} = {}

router.get(
  '/secret',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await querySelectUser(Number(req.query.id))
      if (user && req.sessionUser.administrator) {
        let secret
        do {
          secret = crypto.randomBytes(32).toString('hex')
        } while (Object.keys(activeResets).includes(secret))

        activeResets[secret] = {
          userId: user.id,
          timeCreated: new Date(),
        }
        res.json({ ok: true, secret })
      } else {
        res.status(404).json({ ok: false })
      }
    } catch (err) {
      next(err)
    }
  }
)

publicRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const secret = req.body.secret
      if (
        !Object.keys(activeResets).includes(secret) ||
        activeResets[secret].timeCreated.getTime() + RESET_TIMEOUT <
          new Date().getTime()
      ) {
        res.status(404).json({ ok: false })
        return
      }
      if (req.body.password) {
        const userId = activeResets[secret].userId
        let user = await querySelectUser(userId)
        if (!user) {
          res.status(404).json({ ok: false })
          return
        }
        if (
          req.body.password.length < minPasswordLength ||
          req.body.password.length > maxPasswordLength
        )
          return res.status(400).json({
            ok: false,
            message: 'Password has to be between 3 and 50 characters',
          })
        let hashedPassword = await bcrypt.hash(req.body.password, 8)
        user.passw = hashedPassword
        delete activeResets[secret]
        res.json({ ok: queryUpdateUser(user) })
      } else {
        res.json({ ok: true })
      }
    } catch (err) {
      next(err)
    }
  }
)

export default router
export { publicRouter }

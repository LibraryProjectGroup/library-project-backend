import 'dotenv/config'
import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import mysql from 'mysql2'
import expressBearerToken from 'express-bearer-token'
import healthRouter from './routes/health'
import authRouter from './routes/auth'
import reviewRouter from './routes/book_review'
import bookRouter from './routes/book'
import userRouter from './routes/user'
import officeRouter from './routes/office'
import borrowRouter from './routes/borrow'
import book_listRouter from './routes/book_list'
import book_list_entryRouter from './routes/book_list_entry'
import book_requestRouter from './routes/book_request'
import book_reservationRouter from './routes/book_reservation'
import callbackRoute from './routes/auth/oidc/callback'
import bookfavorite from './routes/book_favorite'
import Session from './interfaces/session.interface'
import passwordreset, {
  publicRouter as publicPasswordReset,
} from './routes/password_reset'
import { querySelectSessionBySecret } from './queries/session'
import User from './interfaces/user.interface'
import { querySelectUserBySessionId } from './queries/user'
import cookieParser from 'cookie-parser'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_SERVER: string
      DATABASE_NAME: string
      DATABASE_USER: string
      DATABASE_PASSWORD: string
      PORT: string
    }
  }

  namespace Express {
    interface Request {
      session: Session
      sessionUser: User
    }
  }
}

// This is not really considered good practice, but it is an easy fix
// https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
process.on('uncaughtException', (err, origin) => {
  console.log(
    `[UNCAUGHT EXCEPTION] at ${new Date().toISOString()}:\n`,
    err,
    '\nUncaught exception origin:\n',
    origin
  )
})

const app: Express = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ credentials: true, origin: true }))
app.use(cors({ credentials: true, origin: '*' }))
app.use(expressBearerToken())

app.use('/health', healthRouter)

app.use('/auth/oidc', callbackRoute)
app.use('/auth', authRouter)
app.use('/passwordreset', publicPasswordReset)
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.token) return res.sendStatus(401)
  try {
    let session = await querySelectSessionBySecret(req.token)
    if (session == null) return res.sendStatus(401)
    req.session = session
    let user = await querySelectUserBySessionId(session.id)
    if (user == null) return res.sendStatus(401)
    req.sessionUser = user

    next()
    return
  } catch (err) {
    console.error(err)
  }
  res.sendStatus(500)
})
app.use('/book', bookRouter)
app.use('/office', officeRouter)
app.use('/user', userRouter)
app.use('/borrow', borrowRouter)
app.use('/booklist', book_listRouter)
app.use('/booklistentry', book_list_entryRouter)
app.use('/bookrequest', book_requestRouter)
app.use('/bookreservation', book_reservationRouter)
app.use('/passwordreset', passwordreset)
app.use('/review', reviewRouter)
app.use('/favorite', bookfavorite)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).send({
    ok: false,
  })
})

const pool = mysql.createPool({
  host: process.env.DATABASE_SERVER,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
})

export { app, pool }

import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import bookRouter from './routes/book';
import userRouter from './routes/user';
import borrowRouter from './routes/borrow';
import exampleRouter from './routes/example';
import Session from './interfaces/session.interface';
import { querySelectSessionBySecret } from './queries/session';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_SERVER: string;
            DATABASE_NAME: string;
            DATABASE_USER: string;
            DATABASE_PASSWORD: string;
            PORT: string;
        }
    }

    namespace Express {
        interface Request {
            session: Session;
        }
    }
}

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies || !req.cookies.librarySession) return res.sendStatus(401);
    try {
        let session = await querySelectSessionBySecret(
            req.cookies.librarySession
        );
        if (session == null) return res.sendStatus(401);
        req.session = session;
        next();
        return;
    } catch (err) {
        console.error(err);
    }
    res.sendStatus(500);
});

app.use('/book', bookRouter);
app.use('/user', userRouter);
app.use('/borrow', borrowRouter);
app.use('/example', exampleRouter);

const pool = mysql.createPool({
    host: process.env.DATABASE_SERVER,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

export { app, pool };

import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import mysql from "mysql2";
import expressBearerToken from "express-bearer-token";
import authRouter from "./routes/auth";
import bookRouter from "./routes/book";
import userRouter from "./routes/user";
import borrowRouter from "./routes/borrow";
import book_listRouter from './routes/book_list';
import book_list_entryRouter from './routes/book_list_entry';
import Session from "./interfaces/session.interface";
import { querySelectSessionBySecret } from "./queries/session";
import User from "./interfaces/user.interface";
import { querySelectUserBySessionId } from "./queries/user";

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
            sessionUser: User;
        }
    }
}

const app: Express = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(expressBearerToken());

app.use("/auth", authRouter);
app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.token) return res.sendStatus(401);
    try {
        let session = await querySelectSessionBySecret(req.token);
        if (session == null) return res.sendStatus(401);
        req.session = session;
        let user = await querySelectUserBySessionId(session.id);
        if (user == null) return res.sendStatus(401);
        req.sessionUser = user;

        next();
        return;
    } catch (err) {
        console.error(err);
    }
    res.sendStatus(500);
});
app.use("/book", bookRouter);
app.use("/user", userRouter);
app.use("/borrow", borrowRouter);
app.use('/booklist', book_listRouter);
app.use('/booklistentry', book_list_entryRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send({
        ok: false,
    });
});

const pool = mysql.createPool({
    host: process.env.DATABASE_SERVER,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

export { app, pool };
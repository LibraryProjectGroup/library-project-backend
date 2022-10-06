import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bookRouter from './routes/book';
import userRouter from './routes/user';
import exampleRouter from './routes/example';

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
}

const app: Express = express();
app.use(cors());

app.use('/book', bookRouter);
app.use('/user', userRouter);
app.use('/example', exampleRouter);

const pool = mysql.createPool({
    host: process.env.DATABASE_SERVER,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

export { app, pool };

import "dotenv/config";
import express, { Express, Request, response, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import Book from './interfaces/book.interface';
import routeBook from './routes/book';
import routeUser from './routes/user';
import routeExample from './routes/example';

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
}

const app: Express = express();
app.use(cors());

const pool = mysql.createPool({
    host: process.env.DATABASE_SERVER,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

routeBook(app, pool);
routeUser(app, pool);
routeExample(app);

export default app;

import express, { Express, Request, response, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import Book from './interfaces/book.interface';
import {
    DATABASE_SERVER,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD,
} from './secrets';
import routeBook from './routes/book';
import routeUser from './routes/user';
import routeExample from './routes/example';
import { routeBorrow } from './routes/borrow';

const app: Express = express();
app.use(cors());

const pool = mysql.createPool({
    host: DATABASE_SERVER,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
});

routeBook(app, pool);
routeUser(app, pool);
routeBorrow(app, pool);
routeExample(app);

export default app;

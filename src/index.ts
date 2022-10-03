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

const EXAMPLE_BOOK: Book = {
    id: 1,
    library_user: 'John Doe',
    title: 'Python Machine Learning: Machine Learning and Deep Learning with Python, scikit-learn, and TensorFlow 2, 3rd Edition',
    author: 'Klabnik, Steve',
    topic: 'Machine Learning',
    isbn: '9781492032649',
    location: 'Helsinki',
};
const EXAMPLE_BOOK_2: Book = { ...EXAMPLE_BOOK, id: 2, title: 'Book 2' };
const EXAMPLE_BOOK_3: Book = { ...EXAMPLE_BOOK, id: 3, title: 'Book 3' };
const EXAMPLE_BOOKS: Array<Book> = [
    EXAMPLE_BOOK,
    EXAMPLE_BOOK_2,
    EXAMPLE_BOOK_3,
];

const app: Express = express();
app.use(cors());

const pool = mysql.createPool({
    host: DATABASE_SERVER,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
});

routeBook(app, pool);

export default app;

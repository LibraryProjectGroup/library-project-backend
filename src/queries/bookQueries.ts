import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2';
import Book from '../interfaces/book.interface';
import { pool } from '../index';

const querySelectBook = async (bookId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM book WHERE book.id = ?',
        [bookId]
    );
    return rows[0] as Book;
};

const querySelectAllBooks = async () => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('SELECT * FROM book');
    return rows as Array<Book>;
};

const queryDeleteBook = async (bookId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'DELETE FROM book WHERE id=?',
        [bookId]
    );
    return rows.affectedRows != 0;
};

const queryInsertBook = async (book: Book) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'INSERT INTO book (library_user, title, author, topic, isbn, location) VALUES (?)',
        [[1, book.title, book.author, book.topic, book.isbn, book.location]]
    );
    return rows.affectedRows != 0;
};

const queryUpdateBook = async (book: Book) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'UPDATE book SET title=(?), author=(?), topic=(?), isbn=(?), location=(?) WHERE id=(?)',
        [book.title, book.author, book.topic, book.isbn, book.location, book.id]
    );
    return rows.affectedRows != 0;
};

export {
    querySelectBook,
    querySelectAllBooks,
    queryDeleteBook,
    queryInsertBook,
    queryUpdateBook,
};

import { ResultSetHeader, RowDataPacket } from 'mysql2';
import Borrow from '../interfaces/borrow.interface';
import Book from '../interfaces/book.interface';
import { pool } from '../index';

const querySelectAllBorrows = async () => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('SELECT * FROM borrowing');
    return rows as Array<Borrow>;
};

const querySelectAllCurrentlyBorrowed = async () => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
        'SELECT book.id, book.library_user, book.title, book.author, book.isbn, book.topic, book.location FROM book INNER JOIN borrowing ON borrowing.book = book.id WHERE borrowing.returned = 0'
    );
    return rows as Array<Book>;
};

const querySelectBorrow = async (borrowingId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM borrowing WHERE id = ?',
        [borrowingId]
    );
    return rows.length > 0 ? (rows[0] as Borrow) : null;
};

const queryDeleteBorrow = async (borrowingId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'DELETE FROM borrowing WHERE id=?',
        [borrowingId]
    );
    return rows.affectedRows != 0;
};

const queryInsertBorrow = async (borrow: Borrow) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'INSERT INTO borrowing (library_user, book, borrowDate, dueDate, returned) VALUES (?) ',
        [
            [
                borrow.user,
                borrow.book,
                borrow.borrowDate,
                borrow.dueDate,
                borrow.returned,
            ],
        ]
    );
    return rows.affectedRows != 0;
};

const queryUpdateBorrow = async (borrow: Borrow) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'UPDATE borrowing SET library_user=(?), book=(?), borrowDate=(?), dueDate=(?), returned=(?) WHERE id=(?)',
        [
            borrow.user,
            borrow.book,
            borrow.borrowDate,
            borrow.dueDate,
            borrow.returned,
            borrow.id,
        ]
    );
    return rows.affectedRows != 0;
};

export {
    queryInsertBorrow,
    querySelectAllBorrows,
    querySelectBorrow,
    queryDeleteBorrow,
    queryUpdateBorrow,
    querySelectAllCurrentlyBorrowed,
};

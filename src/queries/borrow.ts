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

const queryBookIsAvailable = async (bookId: number) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM borrowing WHERE book=(?) AND returned=0',
        [bookId]
    );
    return rows.length == 0 ? true : false;
};

const queryBorrowsByUsername = async (username: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        'SELECT borrowing.id, borrowing.library_user, borrowing.dueDate, borrowing.borrowDate, borrowing.returned FROM borrowing INNER JOIN library_user ON borrowing.library_user=library_user.id WHERE library_user.username=(?) AND returned=0',
        [username]
    );
    return rows.length == 0 ? true : false;
};

const queryReturnBorrow = async (borrowId: number) => {
    const promisePool = pool.promise();
    try {
        const [rows] = await promisePool.query<ResultSetHeader>(
            'UPDATE borrowing SET returned=1 WHERE id=(?)',
            [borrowId]
        );
        return rows.affectedRows != 0;
    } catch {
        return false;
    }
};

export {
    queryInsertBorrow,
    querySelectAllBorrows,
    querySelectBorrow,
    queryDeleteBorrow,
    queryUpdateBorrow,
    querySelectAllCurrentlyBorrowed,
    queryBookIsAvailable,
    queryReturnBorrow,
    queryBorrowsByUsername,
};

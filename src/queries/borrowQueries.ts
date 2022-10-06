import { Pool } from 'mysql2';
import Borrow from '../interfaces/borrow.interface';
import Book from '../interfaces/book.interface';

const querySelectAllBorrows = async (pool: Pool) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('SELECT * FROM borrowing');
    const resultBooks: Array<Borrow> = rows as Array<Borrow>;
    return resultBooks;
};

const querySelectAllCurrentlyBorrowed = async (pool: Pool) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
        'SELECT book.id, book.library_user, book.title, book.author, book.isbn, book.topic, book.location FROM book INNER JOIN borrowing ON borrowing.book = book.id WHERE borrowing.returned = 0'
    );
    const resultBooks: Array<Book> = rows as Array<Book>;
    return resultBooks;
};

const querySelectBorrow = async (pool: Pool, borrowingId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
        'SELECT * FROM borrowing WHERE id = ?',
        [borrowingId]
    );
    const resultBorrow: Borrow = JSON.parse(JSON.stringify(rows))[0] as Borrow;
    return resultBorrow;
};

const queryDeleteBorrow = async (pool: Pool, borrowingId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('DELETE FROM borrowing WHERE id=?', [
        borrowingId,
    ]);
    const rowsObject = JSON.parse(JSON.stringify(rows));
    if (rowsObject.affectedRows != 0) {
        return true;
    } else {
        return false;
    }
};

const queryInsertBorrow = async (pool: Pool, borrow: Borrow) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
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
    const rowsObject = JSON.parse(JSON.stringify(rows));
    if (rowsObject.affectedRows != 0) {
        return true;
    } else {
        return false;
    }
};

const queryUpdateBorrow = async (pool: Pool, borrow: Borrow) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
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
    const rowsObject = JSON.parse(JSON.stringify(rows));
    if (rowsObject.affectedRows != 0) {
        return true;
    } else {
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
};

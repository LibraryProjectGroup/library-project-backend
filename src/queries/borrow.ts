import { Pool } from 'mysql2';
import Borrow from '../interfaces/borrow.interface';
import { pool } from '../index';

const querySelectAllBorrows = async () => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('SELECT * FROM borrowing');
    const resultBooks: Array<Borrow> = rows as Array<Borrow>;
    return resultBooks;
};

const querySelectBorrow = async (borrowingId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
        'SELECT * FROM borrowing WHERE id = ?',
        [borrowingId]
    );
    const resultBorrow: Borrow = JSON.parse(JSON.stringify(rows))[0] as Borrow;
    return resultBorrow;
};

const queryDeleteBorrow = async (borrowingId: string) => {
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

const queryInsertBorrow = async (borrow: Borrow) => {
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

const queryUpdateBorrow = async (borrow: Borrow) => {
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
};

import { Pool } from 'mysql2';
import Borrow from '../interfaces/borrow.interface';

const querySelectAllBorrows = async (pool: Pool) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('SELECT * FROM borrowing');
    const resultBooks: Array<Borrow> = rows as Array<Borrow>;
    return resultBooks;
};

const querySelectBorrow = async (pool: Pool, borrowingId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
        'SELECT * FROM borrowing WHERE id = ?',
        [borrowingId]
    );
    console.log(rows);
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

export {
    queryInsertBorrow,
    querySelectAllBorrows,
    querySelectBorrow,
    queryDeleteBorrow,
};

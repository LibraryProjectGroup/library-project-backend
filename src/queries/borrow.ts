import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../index";
import Borrow from "../interfaces/borrow.interface";

export const querySelectAllBorrows = async (): Promise<Borrow[]> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query("SELECT * FROM borrowing");
    return rows as Borrow[];
};

export const querySelectAllCurrentBorrows = async (): Promise<Borrow[]> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM borrowing WHERE returned = 0"
    );
    return rows as Borrow[];
};

export const querySelectBorrow = async (
    borrowingId: number
): Promise<Borrow | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM borrowing WHERE id = ?",
        [borrowingId]
    );
    return rows.length > 0 ? (rows[0] as Borrow) : null;
};

export const queryDeleteBorrow = async (
    borrowingId: number
): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "DELETE FROM borrowing WHERE id=?",
        [borrowingId]
    );
    return rows.affectedRows != 0;
};

export const queryInsertBorrow = async (
    userId: number,
    bookId: number,
    dueDate: Date,
    borrowDate: Date
): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "INSERT INTO borrowing (library_user, book, borrowDate, dueDate, returned) VALUES (?) ",
        [[userId, bookId, dueDate, borrowDate, false]]
    );
    return rows.affectedRows != 0;
};

export const queryUpdateBorrow = async (borrow: Borrow): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE borrowing SET library_user=(?), book=(?), borrowDate=(?), dueDate=(?), returned=(?) WHERE id=(?)",
        [
            borrow.library_user,
            borrow.book,
            borrow.borrowDate,
            borrow.dueDate,
            borrow.returned,
            borrow.id,
        ]
    );
    return rows.affectedRows != 0;
};

export const queryBookIsAvailable = async (
    bookId: number
): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM borrowing WHERE book=(?) AND returned = 0",
        [bookId]
    );
    return rows.length == 0 ? true : false;
};

export const queryBorrowsByUserId = async (
    userId: number
): Promise<Borrow[]> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM borrowing WHERE library_user = ? AND returned = 0",
        [userId]
    );
    return rows as Borrow[];
};

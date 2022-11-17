import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../index";
import Book_reservation from "../interfaces/book_reservation.interface";

export const querySelectReservations = async (): Promise<
    Book_reservation[]
> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query("SELECT * FROM book_reservation");
    return rows as Book_reservation[];
};

export const querySelectReservation = async (
    id: number
): Promise<Book_reservation | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM book_reservation WHERE id = ?",
        [id]
    );
    return rows.length > 0 ? (rows[0] as Book_reservation) : null;
};

export const queryInsertReservation = async (
    userId: number,
    bookId: number
): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "INSERT INTO book_reservation VALUES (NULL, ?, NOW(), false, false)",
        [[userId, bookId]]
    );
    return rows.affectedRows != 0;
};

export const queryUpdateReservation = async (
    id: number,
    userId: number,
    bookId: number,
    reservationDatetime: Date,
    loaned: boolean,
    canceled: boolean
): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE book_reservation SET userId = ?, bookId = ?, reservationDatetime = ?, loaned = ?, canceled = ? WHERE id = ?",
        [userId, bookId, reservationDatetime, loaned, canceled, id]
    );
    return rows.affectedRows != 0;
};

export const queryCancelReservation = async (id: number): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE book_reservation SET canceled=true WHERE id = ?",
        [id]
    );
    return rows.affectedRows != 0;
};

export const queryLoanReservation = async (id: number): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE book_reservation SET loaned=true WHERE id = ?",
        [id]
    );
    return rows.affectedRows != 0;
};

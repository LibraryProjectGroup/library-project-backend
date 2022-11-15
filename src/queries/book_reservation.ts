import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../index";
import Book_reservation from "../interfaces/book_reservation.interface";

export const querySelectReservations = async (): Promise<
    Book_reservation[]
> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query("SELECT * FROM book_reservations");
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
        "INSERT INTO book_reservation (userId, bookId) VALUES (?, NOW())",
        [[userId, bookId]]
    );
    return rows.affectedRows != 0;
};

export const queryUpdateReservation = async (
    id: number,
    userId: number,
    bookId: number,
    reservationDatetime: Date
): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE book_reservation SET userId = ?, bookId = ?, reservationDatetime = ? WHERE id = ?",
        [userId, bookId, reservationDatetime, id]
    );
    return rows.affectedRows != 0;
};

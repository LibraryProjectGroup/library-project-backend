import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../index";
import Book_reservation from "../interfaces/book_reservation.interface";
import ExtendedReservation from "../interfaces/extendedReservation.interface";
import { querySelectCurrentBorrowByBook } from "./borrow";
import { RESERVATION_DAYS, MS_IN_DAY } from "../constants";

// Used between query and response to filter out reservations that are based on borrows that have been returned RESERVATION_DAYS before.
const filterValidReservations = (reservations: any) => {
  return JSON.parse(JSON.stringify(reservations)).filter(
    (reservation: ExtendedReservation) =>
      reservation.returnDate === null ||
      new Date(
        new Date(reservation.returnDate).getTime() +
          RESERVATION_DAYS * MS_IN_DAY
      ).getTime() > new Date().getTime()
  );
};

export const querySelectAllReservations = async (): Promise<
  Book_reservation[]
> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query("SELECT * FROM book_reservation");
  return rows as Book_reservation[];
};

export const querySelectCurrentReservations = async (): Promise<
  ExtendedReservation[]
> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query(
    "SELECT reservation.id, reservation.userId, reservation.bookId, reservation.borrowId, reservation.reservationDatetime, reservation.loaned, reservation.canceled, borrowing.returnDate FROM book_reservation AS reservation JOIN borrowing ON borrowing.id = reservation.borrowId WHERE reservation.canceled != 1 AND reservation.loaned != 1"
  );
  return filterValidReservations(rows) as ExtendedReservation[];
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

export const querySelectCurrentReservationForBook = async (
  bookId: number
): Promise<ExtendedReservation | null> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<RowDataPacket[]>(
    "SELECT reservation.id, reservation.userId, reservation.bookId, reservation.borrowId, reservation.reservationDateTime, reservation.loaned, reservation.canceled, borrowing.returnDate FROM book_reservation AS reservation JOIN borrowing ON reservation.borrowId = borrowing.id WHERE bookId = ? AND reservation.canceled != 1 AND reservation.loaned != 1",
    [bookId]
  );
  const validReservations = filterValidReservations(rows);
  return validReservations.length > 0
    ? (validReservations[0] as ExtendedReservation)
    : null;
};

export const queryInsertReservation = async (
  userId: number,
  bookId: number
): Promise<boolean> => {
  // check that reservation does not already exist
  if (await querySelectCurrentReservationForBook(bookId)) {
    return false;
  }
  const borrow = await querySelectCurrentBorrowByBook(bookId);
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<ResultSetHeader>(
    "INSERT INTO book_reservation VALUES (NULL, ?, NOW(), false, false)",
    [[userId, bookId, borrow?.id]]
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

// Extended reservations

export const querySelectAllExtendedReservations = async (): Promise<
  ExtendedReservation[]
> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query(
    "SELECT reservation.id, user.username, book.title, book.id AS bookId, reservation.reservationDatetime, reservation.loaned, reservation.canceled, borrowing.returnDate FROM book_reservation AS reservation JOIN library_user AS user ON reservation.userId = user.id JOIN book ON book.id = reservation.bookId JOIN borrowing ON borrowing.id = reservation.borrowId ORDER BY reservation.reservationDatetime DESC"
  );
  return filterValidReservations(rows) as ExtendedReservation[];
};

export const querySelectUserCurrentExtendedReservations = async (
  userId: number
): Promise<ExtendedReservation[] | null> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<RowDataPacket[]>(
    "SELECT reservation.id, user.username, book.title, book.id AS bookId, reservation.reservationDatetime, reservation.loaned, reservation.canceled, borrowing.returnDate FROM book_reservation AS reservation JOIN library_user AS user ON reservation.userId = user.id JOIN book ON book.id = reservation.bookId JOIN borrowing ON borrowing.id = reservation.borrowId WHERE reservation.userId = ? AND loaned = 0 AND canceled = 0",
    [userId]
  );
  const validReservations = filterValidReservations(rows);
  return validReservations.length > 0
    ? (validReservations as ExtendedReservation[])
    : null;
};

import { ResultSetHeader, RowDataPacket } from "mysql2";
import Book_review from "../interfaces/book_review.interface";
import { pool } from "../index";

export const getAllReviews = async (): Promise<Book_review[]> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
        "SELECT * FROM book_reviews"
    );
    return rows as Book_review[];
};

export const getReviewByBookId = async (bookId: number): Promise<Book_review[] | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM book_reviews WHERE book_id = ?", [bookId]
    );
    return rows.length > 0 ? (rows as Book_review[]) : null;
};

export const deleteReview = async (id: number): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "DELETE FROM book_reviews WHERE id=?", [id]
    );
    return rows.affectedRows != 0
};

export const updateReview = async (
    reviewId: number,
    comment: string,
    rating: number
): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE book_reviews SET comment=(?), rating=(?) WHERE id=(?)",
        [
            comment,
            rating,
            reviewId
        ]
    );
    return rows.changedRows != 0;
};

export const insertReview = async (
    userId: number,
    bookId: number,
    comment: string,
    rating: number,
): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "INSERT INTO book_reviews (user_id, book_id, comment, rating) VALUES (?)",
        [[userId, bookId, comment, rating]]
    );
    return rows.affectedRows != 0;
};

export const getAverageRatingForBook = async (
    bookId: number
): Promise<number | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT AVG(rating) as avgRating FROM book_reviews WHERE book_id = ?",
        [bookId]
    );

    const avgRating = rows[0].avgRating;
    return avgRating !== null ? avgRating : null;
};

export const getReviewById = async (reviewId: number): Promise<Book_review | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM book_reviews WHERE id = ?",
        [reviewId]
    );

    return rows.length > 0 ? (rows[0] as Book_review) : null;
};
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../index";
import Book_request, {
    Book_request_status,
} from "../interfaces/book_request.interface";

const querySelectRequests = async (): Promise<Book_request[]> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query("SELECT * FROM book_requests");
    return rows as Book_request[];
};

const querySelectRequest = async (id: number): Promise<Book_request | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM book_requests WHERE id = ?",
        [id]
    );
    return rows.length > 0 ? (rows[0] as Book_request) : null;
};

const queryInsertRequest = async (
    userId: number,
    isbn: string,
    title: string,
    reason: string
): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "INSERT INTO book_requests (userId, isbn, title, reason) VALUES (?)",
        [[userId, isbn, title, reason]]
    );
    return rows.affectedRows != 0;
};

const queryUpdateRequest = async (
    id: number,
    status: Book_request_status
): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE book_requests SET status = ? WHERE id = ?",
        [id, status]
    );
    return rows.affectedRows != 0;
};

export {
    querySelectRequests,
    querySelectRequest,
    queryInsertRequest,
    queryUpdateRequest,
};

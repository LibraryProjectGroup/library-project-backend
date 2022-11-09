import { ResultSetHeader, RowDataPacket } from "mysql2";
import Book_list from "../interfaces/book_list.interface";
import { pool } from "../index";

export const querySelectAllLists = async () => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query("SELECT * FROM book_list");
    return rows as Array<Book_list>;
};

export const querySelectListByUser = async (userId: number) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM book_list WHERE library_user = ?",
        [userId]
    );
    return rows as Array<Book_list>;
};

export const querySelectList = async (listId: number) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM book_list WHERE id = ?",
        [listId]
    );
    return rows.length > 0 ? (rows[0] as Book_list) : null;
};

export const queryInsertNewList = async (userId:number, listName:string): Promise<Boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "INSERT INTO book_list (library_user, name) VALUES (?)",
        [[userId, listName]]
    );
    return rows.affectedRows != 0;
};

export const queryDeleteList = async (listId: number) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "DELETE FROM book_list WHERE id = ?",
        [listId]
    );
    return rows.affectedRows != 0;
};

export const queryUpdateList = async (book_list: Book_list) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE book_list SET name=(?) WHERE id=(?)",
        [book_list.name, book_list.id]
    );
    return rows.changedRows != 0;
};

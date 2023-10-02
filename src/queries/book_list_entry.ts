import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../index";
import Book_list_entry from "../interfaces/book_list_entry.interface";

export const getAllEntries = async () => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query("SELECT * FROM book_list_entry");
  return rows as Array<Book_list_entry>;
};

export const getEntriesByList = async (listId: number) => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query(
    "SELECT * FROM book_list_entry WHERE list = ?",
    [listId]
  );
  return rows as Array<Book_list_entry>;
};

export const getEntryById = async (entryId: number) => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<RowDataPacket[]>(
    "SELECT * FROM book_list_entry WHERE id = ?",
    [entryId]
  );
  return rows.length > 0 ? (rows[0] as Book_list_entry) : null;
};

export const insertNewEntry = async (book_list_entry: Book_list_entry) => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<ResultSetHeader>(
    "INSERT INTO book_list_entry (list, book) VALUES (?)",
    [[book_list_entry.list, book_list_entry.book]]
  );
  return rows.affectedRows != 0;
};

export const removeEntryById = async (entryId: number) => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<ResultSetHeader>(
    "DELETE FROM book_list_entry WHERE id = ?",
    [entryId]
  );
  return rows.affectedRows != 0;
};

export const deleteListBook = async (
  listId: number,
  bookId: number
): Promise<boolean> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<ResultSetHeader>(
    "DELETE FROM book_list_entry WHERE book = ? AND list = ?",
    [bookId, listId]
  );
  return rows.affectedRows != 0;
};
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../index';
import Book_list_entry from '../interfaces/book_list_entry.interface';


const querySelectAllEntries = async () => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('SELECT * FROM book_list_entry');
    return rows as Array<Book_list_entry>;
}; 

const querySelectEntry = async (entryId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM book_list_entry WHERE id = ?',
        [entryId]
    );
    return rows.length > 0 ? (rows[0] as Book_list_entry) : null;
};

const queryInsertEntry = async (book_list_entry: Book_list_entry) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'INSERT INTO book_list_entry (list, book) VALUES (?)',
        [
            [
            book_list_entry.list,
            book_list_entry.book,
            ]
        ]
    );
    return rows.affectedRows != 0;
};

const queryRemoveFromList = async(entryId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'DELETE FROM book_list_entry WHERE id = ?',
        [entryId]

    );
    return rows.affectedRows != 0;
};

export {
    queryInsertEntry,
    queryRemoveFromList,
    querySelectAllEntries,
    querySelectEntry,
};
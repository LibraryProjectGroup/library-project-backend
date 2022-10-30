import { ResultSetHeader, RowDataPacket } from 'mysql2';
import Book_list from '../interfaces/book_list.interface';
import { pool } from '../index';


const querySelectAllLists = async () => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('SELECT * FROM book_list');
    return rows as Array<Book_list>;
};

// is inner join correct here?
const querySelectListByUser = async (username: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        'SELECT book_list.name, book.id, book.library_user, book.title, book.author, book.isbn, book.topic, book.location FROM book INNER JOIN book_list_entry ON book.id = book_list_entry.book INNER JOIN book_list ON book_list_entry.list = book_list.id INNER JOIN library_user ON book_list.user = library_user.id WHERE library.user.username = (?)',
        [username]
    );
    return rows as Array<Book_list>;
};

const querySelectList= async(listId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM book_list WHERE ID = ?',
        [listId]
    );
    return rows.length > 0 ? (rows[0] as Book_list) : null;
};

const queryInsertNewList = async (book_list: Book_list) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'INSERT INTO book_list (library_user, name) VALUES (?)',
        [
            [
            book_list.user,
            book_list.name,
            ]
        ]
    );
    return rows.affectedRows != 0;
};

const queryDeleteList = async(listId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'DELETE FROM book_list WHERE id = ?',
        [listId]
    );
    return rows.affectedRows != 0;
};

const queryUpdateList = async (book_list: Book_list) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'UPDATE book_list SET name=(?) WHERE id=(?)',
        [book_list.name]
    );
    return rows.changedRows != 0;
};

export {
    queryDeleteList,
    queryInsertNewList,
    querySelectAllLists,
    querySelectListByUser,
    querySelectList,
    queryUpdateList,
};
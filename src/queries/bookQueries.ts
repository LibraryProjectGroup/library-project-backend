import { Pool } from "mysql2";
import Book from "../interfaces/book.interface";

// A hacky way to get an array of objects from a RowDataPacket. More appropriate way could be a todo.
function rowDataPacketToObject(rowDataPacket: any): Array<object> {
  return JSON.parse(JSON.stringify(rowDataPacket));
}

const querySelectBook = async (pool: Pool, bookId: string) => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query(
    "SELECT * FROM book WHERE book.id = ?",
    [bookId]
  );
  // Needs maybe another function to more reliably and ORMishly make rowDataPacket a Book?
  const resultBook: Book = rowDataPacketToObject(rows)[0] as Book;
  return resultBook;
};

const querySelectAllBooks = async (pool: Pool) => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query("SELECT * FROM book");
  const resultBooks: Array<Book> = rows as Array<Book>;
  return resultBooks;
};

const queryDeleteBook = async (pool: Pool, bookId: string) => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query("DELETE FROM book WHERE id=?", [
    bookId,
  ]);
  // rows type is ResultSetHeader. (╯°□°)╯︵ ┻━┻
  const rowsObject = JSON.parse(JSON.stringify(rows));
  if (rowsObject.affectedRows != 0) {
    return true;
  } else {
    return false;
  }
};

const queryInsertBook = async (pool: Pool, book: Book) => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query(
    "INSERT INTO book (library_user, title, author, topic, isbn, location) VALUES (?)",
    [[1, book.title, book.author, book.topic, book.isbn, book.location]]
  );
  // ditto
  const rowsObject = JSON.parse(JSON.stringify(rows));
  if (rowsObject.affectedRows != 0) {
    return true;
  } else {
    return false;
  }
};

export {
  querySelectBook,
  querySelectAllBooks,
  queryDeleteBook,
  queryInsertBook,
};

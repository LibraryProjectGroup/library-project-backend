"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryUpdateBook = exports.queryInsertBook = exports.queryDeleteBook = exports.querySelectAllBooks = exports.querySelectBook = void 0;
const index_1 = require("../index");
const querySelectBook = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const promisePool = index_1.pool.promise();
    const [rows] = yield promisePool.query('SELECT * FROM book WHERE book.id = ?', [bookId]);
    return rows[0];
});
exports.querySelectBook = querySelectBook;
const querySelectAllBooks = () => __awaiter(void 0, void 0, void 0, function* () {
    const promisePool = index_1.pool.promise();
    const [rows] = yield promisePool.query('SELECT * FROM book');
    return rows;
});
exports.querySelectAllBooks = querySelectAllBooks;
const queryDeleteBook = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const promisePool = index_1.pool.promise();
    const [rows] = yield promisePool.query('DELETE FROM book WHERE id=?', [bookId]);
    return rows.affectedRows != 0;
});
exports.queryDeleteBook = queryDeleteBook;
const queryInsertBook = (book) => __awaiter(void 0, void 0, void 0, function* () {
    const promisePool = index_1.pool.promise();
    const [rows] = yield promisePool.query('INSERT INTO book (library_user, title, author, topic, isbn, location) VALUES (?)', [[1, book.title, book.author, book.topic, book.isbn, book.location]]);
    return rows.affectedRows != 0;
});
exports.queryInsertBook = queryInsertBook;
const queryUpdateBook = (book) => __awaiter(void 0, void 0, void 0, function* () {
    const promisePool = index_1.pool.promise();
    const [rows] = yield promisePool.query('UPDATE book SET title=(?), author=(?), topic=(?), isbn=(?), location=(?) WHERE id=(?)', [book.title, book.author, book.topic, book.isbn, book.location, book.id]);
    return rows.affectedRows != 0;
});
exports.queryUpdateBook = queryUpdateBook;

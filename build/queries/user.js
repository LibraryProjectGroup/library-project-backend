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
exports.queryUpdateUser = exports.queryInsertUser = exports.queryDeleteUser = exports.querySelectUserByName = exports.querySelectUser = exports.querySelectAllUsers = void 0;
const index_1 = require("../index");
const querySelectAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const promisePool = index_1.pool.promise();
    const [rows] = yield promisePool.query('SELECT * FROM library_user');
    return rows;
});
exports.querySelectAllUsers = querySelectAllUsers;
const querySelectUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const promisePool = index_1.pool.promise();
    const [rows] = yield promisePool.query('SELECT * FROM library_user WHERE id = ?', [userId]);
    return rows.length > 0 ? rows[0] : null;
});
exports.querySelectUser = querySelectUser;
const querySelectUserByName = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const promisePool = index_1.pool.promise();
    const [rows] = yield promisePool.query('SELECT * FROM library_user WHERE username = ?', [username]);
    return rows.length > 0 ? rows[0] : null;
});
exports.querySelectUserByName = querySelectUserByName;
const queryDeleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const promisePool = index_1.pool.promise();
    const [rows] = yield promisePool.query('DELETE FROM library_user WHERE id = ?', [userId]);
    return rows.affectedRows != 0;
});
exports.queryDeleteUser = queryDeleteUser;
const queryInsertUser = (username, password, isAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    const promisePool = index_1.pool.promise();
    const [rows] = yield promisePool.query('INSERT INTO library_user (username, passw, administrator) VALUES (?)', [[username, password, isAdmin]]);
    if (rows.affectedRows == 0)
        return null;
    return {
        id: rows.insertId,
        username,
        passw: password,
        administrator: isAdmin,
    };
});
exports.queryInsertUser = queryInsertUser;
const queryUpdateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const promisePool = index_1.pool.promise();
    const [rows] = yield promisePool.query('UPDATE library_user SET username=(?), passw=(?), administrator=(?) WHERE id=(?)', [user.username, user.passw, user.administrator, user.id]);
    return rows.affectedRows != 0;
});
exports.queryUpdateUser = queryUpdateUser;

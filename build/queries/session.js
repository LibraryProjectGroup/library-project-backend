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
exports.queryInvalidateSession = exports.querySelectSessionBySecret = exports.queryInsertSession = void 0;
const index_1 = require("../index");
function queryInsertSession(userId, secret, length) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = index_1.pool.promise();
        const expires = new Date().getTime() / 1000 + length;
        const [res] = yield promisePool.query('INSERT INTO sessions (userId, secret, expires) VALUES (?)', [[userId, secret, expires]]);
        if (res.affectedRows == 0)
            return null;
        return {
            id: res.insertId,
            userId,
            secret,
            expires,
            invalidated: false,
        };
    });
}
exports.queryInsertSession = queryInsertSession;
function querySelectSessionBySecret(secret) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = index_1.pool.promise();
        const currentTime = new Date().getTime() / 1000;
        const [rows] = yield promisePool.query('SELECT * FROM sessions WHERE secret = ? AND expires > ? AND invalidated = 0 LIMIT 1', [secret, currentTime]);
        return rows.length > 0 ? rows[0] : null;
    });
}
exports.querySelectSessionBySecret = querySelectSessionBySecret;
function queryInvalidateSession(secret) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = index_1.pool.promise();
        const [res] = yield promisePool.query('UPDATE sessions SET invalidated = 1 WHERE secret = ?', [secret]);
        return res.affectedRows != 0;
    });
}
exports.queryInvalidateSession = queryInvalidateSession;

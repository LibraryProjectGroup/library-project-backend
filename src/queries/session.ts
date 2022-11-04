import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../index";
import Session from "../interfaces/session.interface";

async function queryInsertSession(
    userId: number,
    secret: string,
    length: number
): Promise<Session | null> {
    const promisePool = pool.promise();
    const expires = new Date().getTime() / 1000 + length;
    const [res] = await promisePool.query<ResultSetHeader>(
        "INSERT INTO sessions (userId, secret, expires) VALUES (?)",
        [[userId, secret, expires]]
    );
    if (res.affectedRows == 0) return null;
    return {
        id: res.insertId,
        userId,
        secret,
        expires,
        invalidated: false,
    };
}

async function querySelectSessionBySecret(
    secret: string
): Promise<Session | null> {
    const promisePool = pool.promise();
    const currentTime = new Date().getTime() / 1000;
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM sessions WHERE secret = ? AND expires > ? AND invalidated = 0 LIMIT 1",
        [secret, currentTime]
    );
    return rows.length > 0 ? (rows[0] as Session) : null;
}

async function queryInvalidateSession(secret: string): Promise<boolean> {
    const promisePool = pool.promise();
    const [res] = await promisePool.query<ResultSetHeader>(
        "UPDATE sessions SET invalidated = 1 WHERE secret = ?",
        [secret]
    );
    return res.affectedRows != 0;
}

export {
    queryInsertSession,
    querySelectSessionBySecret,
    queryInvalidateSession,
};

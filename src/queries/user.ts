import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2';
import User from '../interfaces/user.interface';
import { pool } from '../index';

const querySelectAllUsers = async () => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('SELECT * FROM library_user');
    return rows as Array<User>;
};

const querySelectUser = async (userId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM library_user WHERE id = ?',
        [userId]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
};

const querySelectUserByName = async (username: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM library_user WHERE username = ?',
        [username]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
};

const querySelectUserBySessionId = async (id: number) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        'SELECT * FROM library_user WHERE id = (SELECT userId FROM sessions WHERE id = ?)',
        [id]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
};

const queryDeleteUser = async (userId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'DELETE FROM library_user WHERE id = ?',
        [userId]
    );
    return rows.affectedRows != 0;
};

const queryInsertUser = async (
    username: string,
    password: string,
    isAdmin: boolean | number
) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'INSERT INTO library_user (username, passw, administrator) VALUES (?)',
        [[username, password, isAdmin]]
    );
    if (rows.affectedRows == 0) return null;
    return {
        id: rows.insertId,
        username,
        passw: password,
        administrator: isAdmin,
    } as User;
};

const queryUpdateUser = async (user: User) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'UPDATE library_user SET username=(?), passw=(?), administrator=(?) WHERE id=(?)',
        [user.username, user.passw, user.administrator, user.id]
    );
    return rows.affectedRows != 0;
};

export {
    querySelectAllUsers,
    querySelectUser,
    querySelectUserByName,
    querySelectUserBySessionId,
    queryDeleteUser,
    queryInsertUser,
    queryUpdateUser,

};

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
    return rows[0] as User;
};

const queryDeleteUser = async (userId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'DELETE FROM library_user WHERE id=?',
        [userId]
    );
    return rows.affectedRows != 0;
};

const queryInsertUser = async (user: User) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'INSERT INTO library_user (username, passw, administrator) VALUES (?)',
        [[user.username, user.password, user.administrator]]
    );
    return rows.affectedRows != 0;
};

const queryUpdateUser = async (user: User) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        'UPDATE library_user SET username=(?), passw=(?), administrator=(?) WHERE id=(?)',
        [user.username, user.password, user.administrator, user.id]
    );
    return rows.affectedRows != 0;
};

export {
    querySelectAllUsers,
    querySelectUser,
    queryDeleteUser,
    queryInsertUser,
    queryUpdateUser,
};

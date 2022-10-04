import { Pool } from 'mysql2';
import User from '../interfaces/user.interface';

// A hacky way to get an array of objects from a RowDataPacket. More appropriate way could be a todo.
function rowDataPacketToObject(rowDataPacket: any): Array<object> {
    return JSON.parse(JSON.stringify(rowDataPacket));
}

const querySelectAllUsers = async (pool: Pool) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('SELECT * FROM library_user');
    const resultBooks: Array<User> = rows as Array<User>;
    return resultBooks;
};

const querySelectUser = async (pool: Pool, userId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
        'SELECT * FROM library_user WHERE id = ?',
        [userId]
    );
    // Needs maybe another function to more reliably and ORMishly make rowDataPacket a Book?
    const resultUser: User = rowDataPacketToObject(rows)[0] as User;
    return resultUser;
};

const queryDeleteUser = async (pool: Pool, userId: string) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
        'DELETE FROM library_user WHERE id=?',
        [userId]
    ); // rows type is ResultSetHeader. (╯°□°)╯︵ ┻━┻
    const rowsObject = JSON.parse(JSON.stringify(rows));
    if (rowsObject.affectedRows != 0) {
        return true;
    } else {
        return false;
    }
};

const queryInsertUser = async (pool: Pool, user: User) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
        'INSERT INTO library_user (username, passw, administrator) VALUES (?)',
        [[user.username, user.password, user.administrator]]
    );
    // ditto
    const rowsObject = JSON.parse(JSON.stringify(rows));
    if (rowsObject.affectedRows != 0) {
        return true;
    } else {
        return false;
    }
};

const queryUpdateUser = async (pool: Pool, user: User) => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
        'UPDATE library_user SET username=(?), passw=(?), administrator=(?) WHERE id=(?)',
        [user.username, user.password, user.administrator, user.id]
    );
    const rowsObject = JSON.parse(JSON.stringify(rows));
    if (rowsObject.affectedRows != 0) {
        return true;
    } else {
        return false;
    }
};

export {
    querySelectAllUsers,
    querySelectUser,
    queryDeleteUser,
    queryInsertUser,
    queryUpdateUser,
};

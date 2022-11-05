import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../index";
import User from "../interfaces/user.interface";

const querySelectAllUsers = async (): Promise<User[]> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query("SELECT * FROM library_user");
    return rows as User[];
};

const querySelectUser = async (userId: number): Promise<User | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM library_user WHERE id = ?",
        [userId]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
};

const querySelectUserBySessionId = async (
    sessionId: number
): Promise<User | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM library_user WHERE id = (SELECT userId FROM sessions WHERE id = ?)",
        [sessionId]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
};

const querySelectUserByUsername = async (
    username: string
): Promise<User | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM library_user WHERE username = ?",
        [username]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
};

const queryHardDeleteUser = async (userId: number): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "DELETE FROM library_user WHERE id = ?",
        [userId]
    );
    return rows.affectedRows != 0;
};

const querySoftDeleteUser = async (userId: number): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE library_user SET deleted=1 WHERE id=(?)",
        [userId]
    );
    return rows.affectedRows != 0;
};

const queryInsertUser = async (
    username: string,
    password: string,
    isAdmin: boolean
): Promise<User | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "INSERT INTO library_user (username, passw, administrator) VALUES (?)",
        [[username, password, isAdmin]]
    );
    if (rows.affectedRows == 0) return null;
    return {
        id: rows.insertId,
        username,
        passw: password,
        administrator: isAdmin,
    };
};

const queryUpdateUser = async (user: User): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE library_user SET username=(?), passw=(?), administrator=(?) WHERE id=(?)",
        [user.username, user.passw, user.administrator, user.id]
    );
    return rows.affectedRows != 0;
};

export {
    querySelectAllUsers,
    querySelectUser,
    querySelectUserBySessionId,
    querySelectUserByUsername,
    querySoftDeleteUser,
    queryHardDeleteUser,
    queryInsertUser,
    queryUpdateUser,
};

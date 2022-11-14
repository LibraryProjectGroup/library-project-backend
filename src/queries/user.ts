import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../index";
import User from "../interfaces/user.interface";

export const querySelectAllExistingUsers = async (): Promise<User[]> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query("SELECT * FROM library_user");
    return rows as User[];
};

export const querySelectAllUsers = async (): Promise<User[]> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
        "SELECT * FROM library_user WHERE deleted != 1"
    );
    return rows as User[];
};

export const querySelectUser = async (userId: number): Promise<User | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM library_user WHERE id = ?",
        [userId]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
};

export const querySelectUserBySessionId = async (
    sessionId: number
): Promise<User | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM library_user WHERE id = (SELECT userId FROM sessions WHERE id = ?)",
        [sessionId]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
};

export const querySelectUserByUsername = async (
    username: string
): Promise<User | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<RowDataPacket[]>(
        "SELECT * FROM library_user WHERE username = ?",
        [username]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
};

export const queryHardDeleteUser = async (userId: number): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "DELETE FROM library_user WHERE id = ?",
        [userId]
    );
    return rows.affectedRows != 0;
};

export const querySoftDeleteUser = async (userId: number): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE library_user SET deleted=1 WHERE id=(?)",
        [userId]
    );
    return rows.affectedRows != 0;
};

export const queryInsertUser = async (
    username: string,
    password: string,
    isAdmin: boolean,
    deleted: boolean
): Promise<User | null> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "INSERT INTO library_user (username, passw, administrator, deleted) VALUES (?)",
        [[username, password, isAdmin, deleted]]
    );
    if (rows.affectedRows == 0) return null;
    return {
        id: rows.insertId,
        username,
        passw: password,
        administrator: isAdmin,
        deleted: false,
    };
};

export const queryUpdateUser = async (user: User): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE library_user SET username=(?), passw=(?), administrator=(?) WHERE id=(?)",
        [user.username, user.passw, user.administrator, user.id]
    );
    return rows.affectedRows != 0;
};

export const queryAdminUpdateUser = async (user: User): Promise<boolean> => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query<ResultSetHeader>(
        "UPDATE library_user SET username=(?), administrator=(?) WHERE id=(?)",
        [user.username, user.administrator, user.id]
    );
    return rows.affectedRows != 0;
};

import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../index";
import User from "../interfaces/user.interface";

export const querySelectAllExistingUsers = async (): Promise<User[]> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query(
    "SELECT *, home_office_id AS homeOfficeId FROM library_user"
  );
  return rows as User[];
};

export const querySelectAllUsers = async (): Promise<User[]> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query(
    "SELECT *, home_office_id AS homeOfficeId FROM library_user WHERE deleted != 1"
  );
  return rows as User[];
};

export const querySelectUser = async (userId: number): Promise<User | null> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<RowDataPacket[]>(
    "SELECT *, home_office_id AS homeOfficeId FROM library_user WHERE id = ?",
    [userId]
  );
  return rows.length > 0 ? (rows[0] as User) : null;
};

export const querySelectUserBySessionId = async (
  sessionId: number
): Promise<User | null> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<RowDataPacket[]>(
    "SELECT *, home_office_id AS homeOfficeId FROM library_user WHERE id = (SELECT userId FROM sessions WHERE id = ?)",
    [sessionId]
  );
  return rows.length > 0 ? (rows[0] as User) : null;
};

export const querySelectUserByUsername = async (
  username: string
): Promise<User | null> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<RowDataPacket[]>(
    "SELECT *, home_office_id AS homeOfficeId FROM library_user WHERE username = ?",
    [username]
  );
  return rows.length > 0 ? (rows[0] as User) : null;
};

export const querySelectUserByEmail = async (
  email: string
): Promise<User | null> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<RowDataPacket[]>(
    "SELECT *, home_office_id AS homeOfficeId FROM library_user WHERE email = ?",
    [email]
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
  email: string,
  password: string,
  isAdmin: boolean,
  deleted: boolean,
  homeOfficeId?: number
): Promise<User | null> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<ResultSetHeader>(
    "INSERT INTO library_user (username, email, passw, administrator, deleted, home_office_id) VALUES (?)",
    [[username, email, password, isAdmin, deleted, homeOfficeId]]
  );
  if (rows.affectedRows == 0) return null;
  return {
    id: rows.insertId,
    username,
    email,
    passw: password,
    administrator: isAdmin,
    deleted: false,
    homeOfficeId,
  };
};

export const queryUpdateUser = async (user: User): Promise<boolean> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<ResultSetHeader>(
    "UPDATE library_user SET username=(?), email=(?), passw=(?), administrator=(?), home_office_id=(?) WHERE id=(?)",
    [
      user.username,
      user.email,
      user.passw,
      user.administrator,
      user.homeOfficeId,
      user.id,
    ]
  );
  return rows.affectedRows != 0;
};

export const queryAdminUpdateUser = async (user: User): Promise<boolean> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<ResultSetHeader>(
    "UPDATE library_user SET username=(?), email=(?), administrator=(?), home_office_id=(?) WHERE id=(?)",
    [user.username, user.email, user.administrator, user.homeOfficeId, user.id]
  );
  return rows.affectedRows != 0;
};

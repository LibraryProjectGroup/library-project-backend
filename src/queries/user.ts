import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../index";
import User from "../interfaces/user.interface";
import user from "../routes/user";

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

export const querySelectUserByEmail = async (
  email: string
): Promise<User | null> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<RowDataPacket[]>(
    "SELECT * FROM library_user WHERE email = ?",
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
  password: string | null,
  isAdmin: boolean,
  deleted: boolean
): Promise<User | null> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<ResultSetHeader>(
    "INSERT INTO library_user (username, email, passw, administrator, deleted) VALUES (?)",
    [[username, email, password, isAdmin, deleted]]
  );
  if (rows.affectedRows == 0) return null;
  return {
    id: rows.insertId,
    username,
    email,
    passw: password,
    administrator: isAdmin,
    deleted: false,
  };
};

export const queryUpdateUser = async (user: User): Promise<boolean> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<ResultSetHeader>(
    "UPDATE library_user SET username=(?), email=(?), passw=(?), administrator=(?) WHERE id=(?)",
    [user.username, user.email, user.passw, user.administrator, user.id]
  );
  return rows.affectedRows != 0;
};

export const queryAdminUpdateUser = async (user: User): Promise<boolean> => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<ResultSetHeader>(
    "UPDATE library_user SET username=(?), email=(?), administrator=(?) WHERE id=(?)",
    [user.username, user.email, user.administrator, user.id]
  );
  return rows.affectedRows != 0;
};

export const queryOrRegisterOidcUser = async (
  issuer: "google",
  subject: string,
  name: string,
  email: string
): Promise<User | null> => {
  const conn = await pool.promise().getConnection();
  try {
    await conn.beginTransaction();
    const [linkedConnectionRows] = await conn.query<RowDataPacket[]>(
      "SELECT library_user_id FROM oidc_connection WHERE oidc_issuer = ? AND oidc_subject = ?;",
      [issuer, subject]
    );

    let userId;
    if (linkedConnectionRows.length >= 1) {
      // Update user details
      // TODO: Also update e-mail address?
      const currentLinkedUserId = linkedConnectionRows[0].library_user_id;
      await conn.query("UPDATE library_user SET username = ? WHERE id = ?;", [
        name,
        currentLinkedUserId,
      ]);
      userId = currentLinkedUserId;
    } else {
      const [data] = await conn.query<ResultSetHeader>(
        "INSERT INTO library_user (username, email, passw, administrator) VALUES (?, ?, NULL, FALSE);",
        [name, email]
      );
      const insertedId = data.insertId;
      // Create OIDC user
      const [oidcUserData] = await conn.query<RowDataPacket[]>(
        "INSERT INTO oidc_connection (oidc_issuer, oidc_subject, library_user_id) VALUES (?, ?, ?);",
        [issuer, subject, insertedId]
      );
      userId = insertedId;
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      "SELECT * FROM library_user WHERE id = ?;",
      [userId]
    );

    await conn.commit();

    return rows.length > 0 ? (rows[0] as User) : null;
  } catch (error) {
    if (conn) {
      await conn.rollback();
    }
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

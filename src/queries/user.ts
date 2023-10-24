import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../index'
import User from '../interfaces/user.interface'
import { OidcIssuerId } from '../interfaces/OidcIssuer'

export const getAllUsers = async (): Promise<User[]> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query(
    'SELECT *, home_office_id AS homeOfficeId FROM library_user'
  )
  return rows as User[]
}

export const getAllActiveUsers = async (): Promise<User[]> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query(
    'SELECT *, home_office_id AS homeOfficeId FROM library_user WHERE deleted != 1'
  )
  return rows as User[]
}

export const getUserById = async (userId: number): Promise<User | null> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT *, home_office_id AS homeOfficeId FROM library_user WHERE id = ?',
    [userId]
  )
  return rows.length > 0 ? (rows[0] as User) : null
}

export const getUserBySessionId = async (
  sessionId: number
): Promise<User | null> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT *, home_office_id AS homeOfficeId FROM library_user WHERE id = (SELECT userId FROM sessions WHERE id = ?)',
    [sessionId]
  )
  return rows.length > 0 ? (rows[0] as User) : null
}

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT *, home_office_id AS homeOfficeId FROM library_user WHERE username = ?',
    [username]
  )
  return rows.length > 0 ? (rows[0] as User) : null
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<RowDataPacket[]>(
    'SELECT *, home_office_id AS homeOfficeId FROM library_user WHERE email = ?',
    [email]
  )
  return rows.length > 0 ? (rows[0] as User) : null
}

export const deleteUserHard = async (userId: number): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'DELETE FROM library_user WHERE id = ?',
    [userId]
  )
  return rows.affectedRows != 0
}

export const deleteUserSoft = async (userId: number): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'UPDATE library_user SET deleted=1 WHERE id=(?)',
    [userId]
  )
  return rows.affectedRows != 0
}

export const insertUser = async (
  username: string,
  email: string,
  password: string | null,
  isAdmin: boolean,
  deleted: boolean,
  homeOfficeId?: number
): Promise<User | null> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'INSERT INTO library_user (username, email, passw, administrator, deleted, home_office_id) VALUES (?)',
    [[username, email, password, isAdmin, deleted, homeOfficeId]]
  )
  if (rows.affectedRows == 0) return null
  return {
    id: rows.insertId,
    username,
    email,
    passw: password,
    administrator: isAdmin,
    deleted: false,
    homeOfficeId,
  }
}

export const updateUser = async (user: User): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'UPDATE library_user SET username=(?), email=(?), passw=(?), administrator=(?), home_office_id=(?) WHERE id=(?)',
    [
      user.username,
      user.email,
      user.passw,
      user.administrator,
      user.homeOfficeId,
      user.id,
    ]
  )
  return rows.affectedRows != 0
}

export const updateUserByAdmin = async (user: User): Promise<boolean> => {
  const promisePool = pool.promise()
  const [rows] = await promisePool.query<ResultSetHeader>(
    'UPDATE library_user SET username=(?), email=(?), administrator=(?), home_office_id=(?) WHERE id=(?)',
    [user.username, user.email, user.administrator, user.homeOfficeId, user.id]
  )
  return rows.affectedRows != 0
}

export const registerOrGetOidcUser = async (
  issuerId: OidcIssuerId,
  subject: string,
  name: string,
  email: string
): Promise<User | null> => {
  const conn = await pool.promise().getConnection()
  try {
    await conn.beginTransaction()
    const [linkedConnectionRows] = await conn.query<RowDataPacket[]>(
      'SELECT library_user_id FROM oidc_connection WHERE oidc_issuer_id = ? AND oidc_subject = ?;',
      [issuerId, subject]
    )

    let userId
    if (linkedConnectionRows.length >= 1) {
      // Update user details
      // TODO: Also update e-mail address?
      const currentLinkedUserId = linkedConnectionRows[0].library_user_id
      await conn.query('UPDATE library_user SET username = ? WHERE id = ?;', [
        name,
        currentLinkedUserId,
      ])
      userId = currentLinkedUserId
    } else {
      const [data] = await conn.query<ResultSetHeader>(
        'INSERT INTO library_user (username, email, passw, administrator) VALUES (?, ?, NULL, FALSE);',
        [name, email]
      )
      const insertedId = data.insertId
      // Create OIDC user
      const [oidcUserData] = await conn.query<RowDataPacket[]>(
        'INSERT INTO oidc_connection (oidc_issuer_id, oidc_subject, library_user_id) VALUES (?, ?, ?);',
        [issuerId, subject, insertedId]
      )
      userId = insertedId
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM library_user WHERE id = ?;',
      [userId]
    )

    await conn.commit()

    return rows.length > 0 ? (rows[0] as User) : null
  } catch (error) {
    if (conn) {
      await conn.rollback()
    }
    throw error
  } finally {
    if (conn) {
      await conn.release()
    }
  }
}

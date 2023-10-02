import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../index";
import Session from "../interfaces/session.interface";
import { OidcIssuer, OidcIssuerId } from "../interfaces/OidcIssuer";

export async function insertSession(
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

export async function getSessionBySecret(
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

export async function invalidateSession(secret: string): Promise<boolean> {
  const promisePool = pool.promise();
  const [res] = await promisePool.query<ResultSetHeader>(
    "UPDATE sessions SET invalidated = 1 WHERE secret = ?",
    [secret]
  );
  return res.affectedRows != 0;
}

export async function insertOidcChallenge(
  code: string,
  challenge: string,
  issuerId: OidcIssuerId
) {
  const [res] = await pool
    .promise()
    .execute<ResultSetHeader>(
      "INSERT INTO oauth_challenge_storage (code_parameter, code_verifier, created_at, oidc_issuer_id) VALUES (?, ?, FROM_UNIXTIME(UNIX_TIMESTAMP()), ?);",
      [code, challenge, issuerId]
    );
  if (res.affectedRows == 0) {
    return null;
  }
  return {
    id: res.insertId,
  };
}

type OidcChallengePacket = {
  storageId: number;
  verificationCode: string;
  createdAtUtc: string;
  oidcIssuerId: OidcIssuerId;
};

export async function getChallengeVerificationCodeByCodeParameter(
  code: string
): Promise<OidcChallengePacket | null> {
  const [res] = await pool
    .promise()
    .query<RowDataPacket[]>(
      "SELECT oauth_challenge_storage_id, code_verifier, created_at, oidc_issuer_id FROM oauth_challenge_storage WHERE code_parameter = ? LIMIT 1;",
      [code]
    );
  if (res.length < 1) {
    return null;
  }
  const data = res[0];
  return {
    storageId: data.oauth_challenge_storage_id,
    verificationCode: data.code_verifier,
    createdAtUtc: data.created_at,
    oidcIssuerId: data.oidc_issuer_id,
  };
}

export async function getOidcIssuerDataById(
  issuerId: OidcIssuerId
): Promise<OidcIssuer | null> {
  const [res] = await pool
    .promise()
    .query<RowDataPacket[]>(
      "SELECT oidc_issuer_id, issuer_name, oidc_well_known_url, oauth_client_id, oauth_client_secret, metadata FROM oidc_issuer WHERE oidc_issuer_id = ? LIMIT 1;",
      [issuerId]
    );
  if (res.length < 1) {
    return null;
  }
  const data = res[0];
  return {
    databaseId: data.oidc_issuer_id,
    name: data.issuer_name,
    wellKnownDomain: data.oidc_well_known_url,
    clientId: data.oauth_client_id,
    clientSecret: data.oauth_client_secret,
    metadata: JSON.parse(data.metadata) ?? {}, // Empty object in case of `NULL`
  };
}

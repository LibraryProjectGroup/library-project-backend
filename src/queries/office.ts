import { HomeOffice } from "../interfaces/HomeOffice";
import { pool } from "../index";
import { OkPacket, RowDataPacket } from "mysql2";

export async function getHomeOfficeById(
  homeOfficeId: number
): Promise<HomeOffice | null> {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<RowDataPacket[]>(
    "SELECT home_office_id, name, country_code FROM home_office WHERE home_office_id = ? LIMIT 1;",
    [homeOfficeId]
  );
  return rows.length ? convertDatabaseRowToOffice(rows[0]) : null;
}

export async function getAllHomeOffices(): Promise<HomeOffice[]> {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<RowDataPacket[]>(
    "SELECT home_office_id, name, country_code FROM home_office;"
  );
  return !rows.length
    ? []
    : rows.map((value) => convertDatabaseRowToOffice(value));
}

export async function deleteHomeOffice(homeOfficeId: number): Promise<Boolean> {
  const promisePool = pool.promise();
  const [ok] = await promisePool.query<OkPacket>(
    "DELETE FROM home_office WHERE home_office_id = ?;",
    [homeOfficeId]
  );
  return ok.affectedRows >= 1;
}

export async function updateHomeOffice(
  homeOffice: HomeOffice
): Promise<Boolean> {
  const { id, name, countryCode } = homeOffice;

  const promisePool = pool.promise();
  const [ok] = await promisePool.query<OkPacket>(
    "UPDATE home_office SET country_code = ?, name = ? WHERE home_office_id = ?;",
    [countryCode, name, id]
  );
  return ok.affectedRows >= 1;
}

export async function insertHomeOffice(name: string, countryCode: string): Promise<boolean> {
  const promisePool = pool.promise();
  const [result] = await promisePool.query<OkPacket>(
    "INSERT INTO home_office (name, country_code) VALUES (?, ?)",
    [name, countryCode]
  );
  return result.affectedRows === 1;
}

function convertDatabaseRowToOffice(sqlDataPacket: RowDataPacket): HomeOffice {
  return {
    id: sqlDataPacket.home_office_id,
    name: sqlDataPacket.name,
    countryCode: sqlDataPacket.country_code,
  };
}
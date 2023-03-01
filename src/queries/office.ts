import { HomeOffice } from "../interfaces/HomeOffice";
import { pool } from "../index";
import { OkPacket, RowDataPacket } from "mysql2";

export async function findHomeOffice(
  homeOfficeId: number
): Promise<HomeOffice | null> {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<RowDataPacket[]>(
    "SELECT home_office_id, name, country_code, location FROM home_office WHERE home_office_id = ? LIMIT 1;",
    [homeOfficeId]
  );
  return rows.length ? convertDatabaseRowToOffice(rows[0]) : null;
}

export async function findAllHomeOffices(): Promise<HomeOffice[]> {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query<RowDataPacket[]>(
    "SELECT home_office_id, name, country_code, location FROM home_office;"
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
  const { id, name, countryCode, officeLocation: location } = homeOffice;

  const promisePool = pool.promise();
  const [ok] = await promisePool.query<OkPacket>(
    "UPDATE home_office SET country_code = ?, name = ?, location = Point(?, ?) WHERE home_office_id = ?;",
    [countryCode, name, location.latitude, location.longitude, id]
  );
  return ok.affectedRows >= 1;
}

function convertDatabaseRowToOffice(sqlDataPacket: RowDataPacket): HomeOffice {
  return {
    id: sqlDataPacket.home_office_id,
    name: sqlDataPacket.name,
    countryCode: sqlDataPacket.country_code,
    officeLocation: {
      latitude: 0,
      longitude: 0,
    },
  };
}

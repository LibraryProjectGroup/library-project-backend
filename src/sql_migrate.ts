import { SequelizeStorage, Umzug } from "umzug";
import { RunnableMigration } from "umzug/lib/types";
import { readFileSync } from "fs";
import { basename, resolve } from "path";
import { Pool } from "mysql2";
import { glob, globSync } from "glob";
import { Sequelize } from "sequelize";

const migrations: Array<RunnableMigration<MigrationContext>> = globSync(
  "/*.sql",
  { root: "sql" }
)
  .sort()
  .map((sqlFile) => {
    const filename = basename(sqlFile);
    const migrationName = filename.substring(0, filename.length - 4);
    return createMigration(migrationName);
  });

interface MigrationContext {
  mysql: Sequelize;
}

function resolveSql(migrationName: string): string {
  return readFileSync(
    resolve(__dirname, "..", "sql", migrationName + ".sql")
  ).toString("utf8");
}

function createMigration(
  migrationName: string
): RunnableMigration<MigrationContext> {
  return {
    name: migrationName,
    async up({ context }) {
      const sql = resolveSql(migrationName).replace(/\r\n/g, "\n");
      return context.mysql.query(sql);
    },
    async down() {
      // Not implemented
    },
  };
}

export async function migrate(sequelize: Sequelize) {
  console.log(
    "Running migrations: ",
    migrations.map((migration) => migration.name)
  );
  const context: MigrationContext = {
    mysql: sequelize,
  };
  const umzug = new Umzug<MigrationContext>({
    migrations: migrations,
    context: context,
    logger: console,
    storage: new SequelizeStorage({ sequelize }),
  });
  await umzug.up();
  console.log("Finished running migrations");
}

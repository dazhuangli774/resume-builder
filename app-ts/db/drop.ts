import { getDb } from "../api/queries/connection";

async function dropTables() {
  const db = getDb();
  await db.execute("SET FOREIGN_KEY_CHECKS = 0");
  await db.execute("DROP TABLE IF EXISTS resumes");
  await db.execute("DROP TABLE IF EXISTS templates");
  await db.execute("DROP TABLE IF EXISTS users");
  await db.execute("SET FOREIGN_KEY_CHECKS = 1");
  console.log("Dropped all tables");
}

dropTables().catch(console.error);

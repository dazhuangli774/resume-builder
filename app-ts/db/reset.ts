import { getDb } from "../api/queries/connection";

async function reset() {
  const db = getDb();
  await db.execute("SET FOREIGN_KEY_CHECKS = 0");
  await db.execute("TRUNCATE TABLE templates");
  await db.execute("SET FOREIGN_KEY_CHECKS = 1");
  console.log("Cleared templates table");
}

reset().catch(console.error);

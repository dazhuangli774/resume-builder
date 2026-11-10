import { getDb } from "../api/queries/connection";
import { templates } from "./schema";

async function main() {
  const db = getDb();
  const rows = await db.select().from(templates);
  console.log(JSON.stringify(rows, null, 2));
}

main().catch(console.error);

import { getDb } from "../api/queries/connection";

async function createPeots() {
  const db = getDb();

  // Check if table exists
  const tables = await db.execute(`
    SHOW TABLES LIKE 'peots'
  `);

  if (Array.isArray(tables) && tables.length > 0) {
    console.log("peots table already exists, skipping.");
    return;
  }

  await db.execute(`
    CREATE TABLE peots (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      gender ENUM('男', '女') DEFAULT '男' NOT NULL,
      dynasty VARCHAR(50) NOT NULL,
      title VARCHAR(255),
      style VARCHAR(500),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);

  console.log("Created peots table.");
}

createPeots().catch(console.error);

import { createPool } from "mysql2/promise";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const pool = createPool({
  host: "localhost",
  user:  "root",
  password: "root",
  port:  8889,
  database: "assignment-2",
  multipleStatements: true,
});

async function runMigration() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id CHAR(36) PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL,
        checksum CHAR(64) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const migrationsFolder = path.join(process.cwd(), "migrations");
    const migrationDirs = fs.readdirSync(migrationsFolder).sort();

    for (const dir of migrationDirs) {
      const migrationPath = path.join(migrationsFolder, dir, "migration.sql");
      if (!fs.existsSync(migrationPath)) continue;

      const sql = fs.readFileSync(migrationPath, "utf8");
      const checksum = crypto.createHash("sha256").update(sql).digest("hex");

      const [rows]: any = await pool.query(
        "SELECT * FROM migrations WHERE migration_name = ? AND checksum = ?",
        [dir, checksum]
      );
      if (rows.length > 0) {
        console.log(` Migration already applied: ${dir}`);
        continue;
      }

      await pool.query(sql);

      const id = crypto.randomUUID();
      await pool.query(
        "INSERT INTO migrations (id, migration_name, checksum) VALUES (?, ?, ?)",
        [id, dir, checksum]
      );

      console.log(`Applied migration: ${dir}`);
    }

    console.log(" All migrations applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    pool.end();
  }
}

runMigration();

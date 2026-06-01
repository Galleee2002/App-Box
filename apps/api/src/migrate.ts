import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getPool } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationPath = join(__dirname, "..", "migrations", "001_capsules.sql");

async function main() {
  const pool = getPool();
  const migration = readFileSync(migrationPath, "utf8");
  const statements = migration
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }

  await pool.end();
  console.log("Neon migration applied: 001_capsules.sql");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

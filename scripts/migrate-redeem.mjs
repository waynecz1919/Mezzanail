import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const migration = await readFile(
  new URL("../db/migrations/001_create_redeem_codes.sql", import.meta.url),
  "utf8",
);
const sql = neon(connectionString);
const statements = migration
  .split(/;\s*(?:\r?\n|$)/)
  .map((statement) => statement.trim())
  .filter(Boolean);
for (const statement of statements) {
  await sql.query(statement);
}

const rows = await sql.query(`
  SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
   WHERE table_schema = 'public'
     AND table_name = 'redeem_codes'
   ORDER BY ordinal_position
`);

if (rows.length !== 15) {
  throw new Error(`Migration verification failed: expected 15 columns, found ${rows.length}.`);
}

console.log("Redeem migration complete: public.redeem_codes (15 columns).");

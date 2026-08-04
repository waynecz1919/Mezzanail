import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const migration = await readFile(
  new URL("../db/migrations/003_create_anniversary_jackpot.sql", import.meta.url),
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
  SELECT table_name
    FROM information_schema.tables
   WHERE table_schema = 'public'
     AND table_name IN (
       'jackpot_campaigns',
       'jackpot_participants',
       'jackpot_prizes',
       'jackpot_draws',
       'jackpot_audit_log'
     )
   ORDER BY table_name
`);

if (rows.length !== 5) {
  throw new Error(`Migration verification failed: expected 5 tables, found ${rows.length}.`);
}

console.log("Jackpot migration complete: 5 tables and default campaign ready.");

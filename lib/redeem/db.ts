import "server-only";

import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon> | null = null;

export function getRedeemDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("REDEEM_DATABASE_NOT_CONFIGURED");
  }
  client ??= neon(connectionString);
  return client;
}

export async function refreshExpiredCodes() {
  const sql = getRedeemDb();
  await sql.query(
    `UPDATE redeem_codes
       SET status = 'expired'
     WHERE status IN ('pending', 'sent')
       AND expiry_date < CURRENT_DATE`,
  );
}

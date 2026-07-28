import "server-only";

import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon> | null = null;

export const JACKPOT_CAMPAIGN_SLUG = "mezzanail-7th-anniversary-final";

export function getJackpotDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("JACKPOT_DATABASE_NOT_CONFIGURED");
  client ??= neon(connectionString);
  return client;
}

import { redirect } from "next/navigation";
import { JackpotConsole } from "@/components/jackpot/jackpot-console";
import { loadJackpotState } from "@/lib/jackpot/service";
import type { JackpotState } from "@/lib/jackpot/types";
import { getStaffSession } from "@/lib/redeem/auth";

export const dynamic = "force-dynamic";

export default async function AnniversaryJackpotPage() {
  const session = await getStaffSession();
  if (!session) redirect("/anniversary-jackpot/login");

  let state: JackpotState | null = null;
  let setupError = "";
  try {
    state = await loadJackpotState(session);
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    setupError = code === "JACKPOT_DATABASE_NOT_CONFIGURED"
      ? "Jackpot database is not configured."
      : code === "JACKPOT_CAMPAIGN_NOT_INITIALIZED"
        ? "Run the Jackpot database migration first."
        : "Unable to initialize the Jackpot system.";
  }

  if (state) return <JackpotConsole initialState={state} />;
  return (
    <main className="jackpot-setup-error">
      <section>
        <p>MEZZANAIL · INTERNAL SYSTEM</p>
        <h1>Jackpot setup required</h1>
        <span>{setupError}</span>
        <code>pnpm db:migrate:jackpot</code>
      </section>
    </main>
  );
}

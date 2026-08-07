import { CalendarDays, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

import { ManagerShell } from "@/components/winnie/manager-shell";
import { requireWinniePermission } from "@/lib/auth/guards";
import { roleLabel } from "@/lib/auth/permissions";

export default async function ManagerDashboardPage() {
  const session = await requireWinniePermission("dashboard.view");

  return (
    <ManagerShell user={session.user}>
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e5b9a9]">Winnie AI Manager</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Good to see you, {session.user.name}.</h1><p className="mt-3 max-w-2xl leading-7 text-slate-300">This identity and permission layer is ready for future module connections. Existing business systems remain independent.</p></div><Sparkles aria-hidden="true" className="h-9 w-9 text-[#e5b9a9]" /></div>
        </section>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><div className="rounded-2xl border border-[#eadfd9] bg-white p-5"><div className="flex items-center gap-2 text-[#9d7166]"><ShieldCheck aria-hidden="true" className="h-5 w-5" /><span className="text-sm font-semibold">Role</span></div><p className="mt-4 text-2xl font-semibold">{roleLabel(session.user.role)}</p><p className="mt-2 text-sm text-slate-500">Identity and authorization are evaluated separately.</p></div><div className="rounded-2xl border border-[#eadfd9] bg-white p-5"><div className="flex items-center gap-2 text-[#9d7166]"><CheckCircle2 aria-hidden="true" className="h-5 w-5" /><span className="text-sm font-semibold">Permissions</span></div><p className="mt-4 text-2xl font-semibold">{session.user.permissions.length}</p><p className="mt-2 text-sm text-slate-500">Scoped permissions are used by the sidebar and server guards.</p></div><div className="rounded-2xl border border-[#eadfd9] bg-white p-5"><div className="flex items-center gap-2 text-[#9d7166]"><CalendarDays aria-hidden="true" className="h-5 w-5" /><span className="text-sm font-semibold">Module bridge</span></div><p className="mt-4 text-2xl font-semibold">Phase 2C</p><p className="mt-2 text-sm text-slate-500">Business connections remain intentionally deferred.</p></div></section>
      </div>
    </ManagerShell>
  );
}

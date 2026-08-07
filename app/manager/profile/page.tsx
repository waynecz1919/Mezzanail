import { redirect } from "next/navigation";

import { ManagerShell } from "@/components/winnie/manager-shell";
import { getWinnieSession } from "@/lib/auth/guards";
import { roleLabel } from "@/lib/auth/permissions";

export default async function ManagerProfilePage() {
  const session = await getWinnieSession();
  if (!session) redirect("/manager/login");
  return (
    <ManagerShell user={session.user}>
      <section className="mx-auto max-w-2xl rounded-3xl border border-[#eadfd9] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9d7166]">My Profile</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{session.user.name}</h1>
        <dl className="mt-8 divide-y divide-[#eadfd9] text-sm"><div className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr]"><dt className="font-semibold text-slate-500">Email</dt><dd className="break-all">{session.user.email}</dd></div><div className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr]"><dt className="font-semibold text-slate-500">Role</dt><dd>{roleLabel(session.user.role)}</dd></div><div className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr]"><dt className="font-semibold text-slate-500">Permissions</dt><dd>{session.user.permissions.length} scoped permissions</dd></div></dl>
      </section>
    </ManagerShell>
  );
}

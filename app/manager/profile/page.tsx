import { redirect } from "next/navigation";

import { ManagerShell } from "@/components/winnie/manager-shell";
import { getWinnieSession } from "@/lib/auth/guards";
import { roleLabel } from "@/lib/auth/permissions";

export default async function ManagerProfilePage() {
  const session = await getWinnieSession();
  if (!session) redirect("/manager/login");
  return (
    <ManagerShell user={session.user}>
      <section className="winnie-page-card">
        <p className="winnie-page-eyebrow">My Profile</p>
        <h1>{session.user.name}</h1>
        <dl className="mt-8 divide-y divide-[#e5e8f1] text-sm"><div className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr]"><dt className="font-semibold text-[#69748b]">Email</dt><dd className="break-all">{session.user.email}</dd></div><div className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr]"><dt className="font-semibold text-[#69748b]">Role</dt><dd>{roleLabel(session.user.role)}</dd></div><div className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr]"><dt className="font-semibold text-[#69748b]">Permissions</dt><dd>{session.user.permissions.length} scoped permissions</dd></div></dl>
      </section>
    </ManagerShell>
  );
}

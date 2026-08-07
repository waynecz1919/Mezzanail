import { SensitiveActionGuard } from "@/components/winnie/sensitive-action-guard";
import type { WinnieNavigationItem } from "@/config/winnie-navigation";
import { roleLabel } from "@/lib/auth/permissions";
import type { WinnieUser } from "@/lib/auth/session";

export function ModulePlaceholder({ item, user }: { item: WinnieNavigationItem; user: WinnieUser }) {
  return (
    <section className="rounded-3xl border border-[#eadfd9] bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9d7166]">Module access boundary</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{item.label}</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">{item.description}. The business connection is intentionally deferred to Phase 2C.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-[#fbf3f0] p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9d7166]">Signed-in role</p><p className="mt-2 font-semibold">{roleLabel(user.role)}</p></div><div className="rounded-2xl bg-[#fbf3f0] p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9d7166]">Required permission</p><p className="mt-2 font-semibold">{item.permission}</p></div></div>
      {item.sensitiveAction && <SensitiveActionGuard user={user} permission={item.sensitiveAction} action={item.sensitiveAction} target={item.id} />}
    </section>
  );
}

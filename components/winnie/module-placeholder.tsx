import { Sparkles } from "lucide-react";

import { SensitiveActionGuard } from "@/components/winnie/sensitive-action-guard";
import type { WinnieNavigationItem } from "@/config/winnie-navigation";
import { roleLabel } from "@/lib/auth/permissions";
import type { WinnieUser } from "@/lib/auth/session";

const bridgeFoundationModules = new Set(["appointments", "member-credit", "team-hub"]);

export function ModulePlaceholder({ item, user }: { item: WinnieNavigationItem; user: WinnieUser }) {
  const bridgeReady = bridgeFoundationModules.has(item.id);

  return (
    <section className="winnie-page-card">
      <p className="winnie-page-eyebrow"><Sparkles aria-hidden="true" className="mr-2 inline h-4 w-4" />Module access boundary</p>
      <h1>{item.label}</h1>
      <p>{item.description}. {bridgeReady ? "Bridge ready — source not connected." : "Business connection remains deferred."}</p>
      <div className="winnie-meta-grid">
        <div className="winnie-meta-card"><p className="winnie-meta-card-label">Signed-in role</p><p className="winnie-meta-card-value">{roleLabel(user.role)}</p></div>
        <div className="winnie-meta-card"><p className="winnie-meta-card-label">Required permission</p><p className="winnie-meta-card-value">{item.permission}</p></div>
        {bridgeReady && <div className="winnie-meta-card"><p className="winnie-meta-card-label">Bridge status</p><p className="winnie-meta-card-value">Read-only foundation</p></div>}
      </div>
      {item.sensitiveAction && <SensitiveActionGuard user={user} permission={item.sensitiveAction} action={item.sensitiveAction} target={item.id} />}
    </section>
  );
}

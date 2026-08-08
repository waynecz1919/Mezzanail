import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";

import { ManagerShell } from "@/components/winnie/manager-shell";
import { winnieNavigationItems } from "@/config/winnie-navigation";
import { requireWinniePermission } from "@/lib/auth/guards";
import { hasPermission, roleLabel } from "@/lib/auth/permissions";

const quickAccessIconById = {
  appointments: CalendarDays,
  "member-credit": WalletCards,
  whatsapp: MessageCircle,
  "team-hub": UsersRound,
  inventory: Package,
  finance: CircleDollarSign,
} as const;

export default async function ManagerDashboardPage() {
  const session = await requireWinniePermission("dashboard.view");
  const quickAccessItems = winnieNavigationItems
    .filter((item) => item.id !== "dashboard" && hasPermission(session.user.permissions, item.permission))
    .slice(0, 4);

  return (
    <ManagerShell user={session.user}>
      <div className="winnie-dashboard">
        <section className="winnie-hero">
          <div className="winnie-hero-copy">
            <p className="winnie-eyebrow"><Sparkles aria-hidden="true" />Winnie AI</p>
            <h1>Mezzanail Operating System</h1>
            <p className="winnie-hero-description">A calm command center for the people, tasks, and decisions that keep Mezzanail moving.</p>
            <div className="winnie-ask-bar" role="search">
              <input aria-label="Ask Winnie" readOnly placeholder="Ask Winnie about today&apos;s operations..." />
              <Link href="/manager/winnie-tools" className="winnie-ask-submit"><Sparkles aria-hidden="true" className="h-4 w-4" />Ask Winnie</Link>
            </div>
            <p className="winnie-hero-footnote">Suggestions stay within your approved access.</p>
          </div>
          <div className="winnie-hero-art" aria-hidden="true">
            <span className="winnie-orbit"><Sparkles /></span>
            <span className="winnie-spark winnie-spark--one"><BarChart3 /></span>
            <span className="winnie-spark winnie-spark--two"><CheckCircle2 /></span>
          </div>
        </section>

        <section>
          <div className="winnie-section-heading">
            <div>
              <h2>Today at a glance</h2>
              <p>Your identity, permissions, and current operating phase.</p>
            </div>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-[#8d98ad] sm:block">Live access view</span>
          </div>
          <div className="winnie-kpi-grid mt-4">
            <article className="winnie-kpi-card">
              <div className="winnie-kpi-header"><span className="winnie-kpi-icon winnie-kpi-icon--purple"><ShieldCheck aria-hidden="true" className="h-5 w-5" /></span><span className="winnie-kpi-label">Role</span></div>
              <p className="winnie-kpi-value">{roleLabel(session.user.role)}</p>
              <p className="winnie-kpi-copy">Identity and authorization are evaluated separately.</p>
            </article>
            <article className="winnie-kpi-card">
              <div className="winnie-kpi-header"><span className="winnie-kpi-icon winnie-kpi-icon--blue"><CheckCircle2 aria-hidden="true" className="h-5 w-5" /></span><span className="winnie-kpi-label">Permissions</span></div>
              <p className="winnie-kpi-value">{session.user.permissions.length}</p>
              <p className="winnie-kpi-copy">Scoped permissions drive the sidebar and server guards.</p>
            </article>
            <article className="winnie-kpi-card">
              <div className="winnie-kpi-header"><span className="winnie-kpi-icon winnie-kpi-icon--mint"><Sparkles aria-hidden="true" className="h-5 w-5" /></span><span className="winnie-kpi-label">Module bridge</span></div>
              <p className="winnie-kpi-value">Phase 2C</p>
              <p className="winnie-kpi-copy">Business connections remain intentionally deferred.</p>
            </article>
          </div>
        </section>

        <section className="winnie-insight">
          <span className="winnie-insight-icon"><Sparkles aria-hidden="true" className="h-5 w-5" /></span>
          <div>
            <p className="winnie-insight-label">Winnie AI insight</p>
            <h2>Your operating system is ready for its next conversation.</h2>
            <p>Use the AI tools workspace to prepare an operational note without changing connected business data.</p>
          </div>
          <Link href="/manager/winnie-tools" className="winnie-button-primary">Open AI tools<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
        </section>

        <section>
          <div className="winnie-section-heading">
            <div>
              <h2>Quick access</h2>
              <p>Permission-aware shortcuts for your daily workspace.</p>
            </div>
          </div>
          <div className="winnie-quick-grid mt-4">
            {quickAccessItems.map((item) => {
              const Icon = quickAccessIconById[item.id as keyof typeof quickAccessIconById] ?? Sparkles;
              return (
                <Link key={item.id} href={item.href} className="winnie-quick-link">
                  <span className="winnie-quick-icon"><Icon aria-hidden="true" className="h-4 w-4" /></span>
                  <span className="winnie-quick-label">{item.label}<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </ManagerShell>
  );
}

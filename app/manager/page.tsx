import {
  ArrowUpRight,
  BarChart3,
  BellRing,
  CalendarDays,
  CheckCircle2,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { ManagerShell } from "@/components/winnie/manager-shell";
import { requireWinniePermission } from "@/lib/auth/guards";
import { hasPermission, type Permission } from "@/lib/auth/permissions";

const operationalKpis = [
  { label: "Today’s Appointments", icon: CalendarDays, tone: "purple" },
  { label: "Unreplied WhatsApp", icon: MessageCircle, tone: "blue" },
  { label: "Pending Actions", icon: CheckCircle2, tone: "mint" },
] as const;

const quickActions: readonly {
  label: string;
  status: string;
  href?: string;
  permission: Permission;
  icon: typeof CalendarDays;
}[] = [
  { label: "New Appointment", status: "Available after system connection", permission: "appointments.manage", icon: CalendarDays },
  { label: "Find Member", status: "Available after system connection", permission: "customer_profile.view", icon: Search },
  { label: "Send Reminder", status: "Available after system connection", permission: "reminders.manage", icon: BellRing },
  { label: "Ask Winnie", status: "Open AI tools", href: "/manager/winnie-tools", permission: "winnie_ai.basic", icon: Sparkles },
];

export default async function ManagerDashboardPage() {
  const session = await requireWinniePermission("dashboard.view");
  const visibleQuickActions = quickActions.filter((action) => hasPermission(session.user.permissions, action.permission));

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
              <p>Operational updates will appear as approved systems are connected.</p>
            </div>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-[#8d98ad] sm:block">Data connections</span>
          </div>
          <div className="winnie-kpi-grid mt-4">
            {operationalKpis.map(({ label, icon: Icon, tone }) => (
              <article className="winnie-kpi-card" key={label}>
                <div className="winnie-kpi-header"><span className={`winnie-kpi-icon winnie-kpi-icon--${tone}`}><Icon aria-hidden="true" className="h-5 w-5" /></span><span className="winnie-kpi-label">{label}</span></div>
                <p className="winnie-kpi-value">--</p>
                <p className="winnie-kpi-copy">Not connected yet</p>
              </article>
            ))}
          </div>
        </section>

        <section className="winnie-insight">
          <span className="winnie-insight-icon"><Sparkles aria-hidden="true" className="h-5 w-5" /></span>
          <div>
            <p className="winnie-insight-label">Winnie AI insight</p>
            <h2>System connections are being prepared.</h2>
            <p>Operational summaries will appear here after approved read-only connections become available.</p>
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
            {visibleQuickActions.map(({ label, status, href, icon: Icon }) => href ? (
              <Link key={label} href={href} className="winnie-quick-link">
                <span className="winnie-quick-icon"><Icon aria-hidden="true" className="h-4 w-4" /></span>
                <span className="winnie-quick-label">{label}<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></span>
                <span className="winnie-quick-status">{status}</span>
              </Link>
            ) : (
              <div key={label} className="winnie-quick-link is-unavailable" role="link" aria-disabled="true">
                <span className="winnie-quick-icon"><Icon aria-hidden="true" className="h-4 w-4" /></span>
                <span className="winnie-quick-label">{label}</span>
                <span className="winnie-quick-status">{status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ManagerShell>
  );
}

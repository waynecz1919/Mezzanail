"use client";

import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  CircleDollarSign,
  ContactRound,
  Menu,
  MessageCircle,
  Package,
  Settings,
  ShieldCheck,
  Sparkles,
  UsersRound,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { winnieNavigationItems, type WinnieNavigationItem } from "@/config/winnie-navigation";
import { hasPermission, roleLabel } from "@/lib/auth/permissions";
import type { WinnieUser } from "@/lib/auth/session";

type ManagerShellProps = {
  user: WinnieUser;
  children: React.ReactNode;
};

const iconById = {
  dashboard: BarChart3,
  "winnie-tools": Sparkles,
  "voice-notes": MessageCircle,
  tasks: CheckSquare,
  "customer-tasks": ContactRound,
  "customer-profile": UserRound,
  appointments: CalendarDays,
  "member-credit": WalletCards,
  whatsapp: MessageCircle,
  "whatsapp-service": MessageCircle,
  "team-hub": UsersRound,
  reminders: Bell,
  inventory: Package,
  finance: CircleDollarSign,
  settings: Settings,
} as const;

function NavigationLink({ item, active, onNavigate }: { item: WinnieNavigationItem; active: boolean; onNavigate: () => void }) {
  const Icon = iconById[item.id as keyof typeof iconById] ?? BriefcaseBusiness;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`winnie-nav-link ${active ? "is-active" : ""}`}
    >
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

export function ManagerShell({ user, children }: ManagerShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const visibleItems = winnieNavigationItems.filter((item) => hasPermission(user.permissions, item.permission));

  const navigation = (
    <nav aria-label="Winnie AI modules" className="winnie-nav">
      {visibleItems.map((item) => (
        <NavigationLink key={item.id} item={item} active={pathname === item.href} onNavigate={() => setMobileOpen(false)} />
      ))}
    </nav>
  );

  return (
    <div className="winnie-manager">
      <header className="winnie-header sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation"
            className="winnie-header-menu inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
          <Link href="/manager" className="winnie-brand">
            <span className="winnie-brand-mark"><Sparkles aria-hidden="true" className="h-5 w-5" /></span>
            <span className="winnie-brand-copy">
              <span className="winnie-brand-title">Winnie AI</span>
              <span className="winnie-brand-subtitle">Mezzanail Operating System</span>
            </span>
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            className="winnie-header-profile flex min-h-12 items-center gap-3 rounded-xl px-2 text-left"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
          >
            {user.image ? (
              <span role="img" aria-label={`${user.name} profile photo`} className="h-9 w-9 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(user.image)})` }} />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eee9ff] font-semibold text-[#5e51b7]">{user.name.slice(0, 1).toUpperCase()}</span>
            )}
            <span className="hidden sm:block">
              <span className="block text-sm font-semibold text-[#182235]">{user.name}</span>
              <span className="block text-xs text-[#69748b]">{roleLabel(user.role)}</span>
            </span>
            <ChevronDown aria-hidden="true" className="h-4 w-4 text-[#8791a8]" />
          </button>

          {profileOpen && (
            <div className="winnie-profile-menu absolute right-0 top-14 z-40 w-64 rounded-2xl p-3">
              <p className="px-3 py-2 text-sm font-semibold text-[#182235]">{user.name}</p>
              <p className="break-all px-3 text-xs text-[#69748b]">{user.email}</p>
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7562e8]">{roleLabel(user.role)}</p>
              <Link href="/manager/profile" className="mt-2 block min-h-11 rounded-xl px-3 py-3 text-sm font-semibold" onClick={() => setProfileOpen(false)}>My Profile</Link>
              <button type="button" className="mt-1 min-h-11 w-full rounded-xl border border-[#e5e8f1] text-sm font-semibold" onClick={() => signOut({ callbackUrl: "/manager/login" })}>Sign Out</button>
            </div>
          )}
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" role="presentation" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-[min(86vw,22rem)] bg-white p-5 shadow-2xl" aria-label="Mobile navigation" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <span className="font-semibold text-[#182235]">Modules</span>
              <button type="button" aria-label="Close navigation" className="winnie-header-menu inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl" onClick={() => setMobileOpen(false)}>
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            {navigation}
          </aside>
        </div>
      )}

      <div className="winnie-layout">
        <aside className="winnie-sidebar hidden lg:block">
          <div className="winnie-access-card mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#182235]"><ShieldCheck aria-hidden="true" className="h-5 w-5" />Company access</div>
            <p className="mt-2 text-xs leading-5 text-[#69748b]">Your identity and role are checked independently for every module.</p>
          </div>
          {navigation}
        </aside>
        <main className="winnie-main">{children}</main>
      </div>
    </div>
  );
}

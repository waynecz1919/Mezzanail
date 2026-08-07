"use client";

import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
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
      className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${active ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-[#f8efeb]"}`}
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
    <nav aria-label="Winnie AI modules" className="space-y-1">
      {visibleItems.map((item) => (
        <NavigationLink key={item.id} item={item} active={pathname === item.href} onNavigate={() => setMobileOpen(false)} />
      ))}
    </nav>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fdf9f7] text-slate-900">
      <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-[#eadfd9] bg-white/95 px-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Open navigation" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-200 lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
          <Link href="/manager" className="flex items-center gap-2 font-semibold tracking-tight"><Sparkles aria-hidden="true" className="h-5 w-5 text-[#9d7166]" />Winnie AI Manager</Link>
        </div>
        <div className="relative">
          <button type="button" className="flex min-h-12 items-center gap-3 rounded-xl px-2 text-left hover:bg-[#fbf3f0]" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}>
            {user.image ? <span role="img" aria-label={`${user.name} profile photo`} className="h-9 w-9 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(user.image)})` }} /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eadfd9] font-semibold text-[#704b42]">{user.name.slice(0, 1).toUpperCase()}</span>}
            <span className="hidden sm:block"><span className="block text-sm font-semibold">{user.name}</span><span className="block text-xs text-slate-500">{roleLabel(user.role)}</span></span>
            <ChevronDown aria-hidden="true" className="h-4 w-4 text-slate-500" />
          </button>
          {profileOpen && <div className="absolute right-0 top-14 z-40 w-64 rounded-2xl border border-[#eadfd9] bg-white p-3 shadow-xl"><p className="px-3 py-2 text-sm font-semibold">{user.name}</p><p className="break-all px-3 text-xs text-slate-500">{user.email}</p><p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9d7166]">{roleLabel(user.role)}</p><Link href="/manager/profile" className="mt-2 block min-h-11 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-[#fbf3f0]" onClick={() => setProfileOpen(false)}>My Profile</Link><button type="button" className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 text-sm font-semibold" onClick={() => signOut({ callbackUrl: "/manager/login" })}>Sign Out</button></div>}
        </div>
      </header>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" role="presentation" onClick={() => setMobileOpen(false)}><aside className="h-full w-[min(86vw,22rem)] bg-white p-5 shadow-2xl" aria-label="Mobile navigation" onClick={(event) => event.stopPropagation()}><div className="mb-6 flex items-center justify-between"><span className="font-semibold">Modules</span><button type="button" aria-label="Close navigation" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-200" onClick={() => setMobileOpen(false)}><X aria-hidden="true" className="h-5 w-5" /></button></div>{navigation}</aside></div>}

      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside className="hidden w-72 shrink-0 border-r border-[#eadfd9] bg-white p-5 lg:block"><div className="mb-6 rounded-2xl bg-[#fbf3f0] p-4"><div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck aria-hidden="true" className="h-5 w-5 text-[#9d7166]" />Company access</div><p className="mt-2 text-xs leading-5 text-slate-600">Your identity and role are checked independently for every module.</p></div>{navigation}</aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

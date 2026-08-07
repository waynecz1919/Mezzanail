"use client";

import { useState } from "react";

import { hasPermission, type Permission } from "@/lib/auth/permissions";
import type { WinnieUser } from "@/lib/auth/session";

type SensitiveActionGuardProps = {
  user: WinnieUser;
  permission: Permission;
  action: string;
  target: string;
};

export function SensitiveActionGuard({ user, permission, action, target }: SensitiveActionGuardProps) {
  const [open, setOpen] = useState(false);
  const allowed = hasPermission(user.permissions, permission);
  const auditPreview = { actorUserId: user.id, action, target, timestamp: new Date().toISOString() };

  if (!allowed) return <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">This sensitive action requires additional permission.</p>;

  return (
    <div className="mt-6">
      <button type="button" className="min-h-12 rounded-xl border border-[#b78373] px-4 text-sm font-semibold text-[#704b42]" onClick={() => setOpen(true)}>Review sensitive action</button>
      {open && <div className="mt-4 rounded-2xl border border-[#eadfd9] bg-[#fffaf7] p-5" role="dialog" aria-label="Sensitive action confirmation"><h2 className="font-semibold">Additional confirmation required</h2><p className="mt-2 text-sm leading-6 text-slate-600">This is a permission and audit placeholder. It does not change any business data in Phase 2B.</p><dl className="mt-4 grid gap-2 text-xs text-slate-600"><div><dt className="font-semibold text-slate-800">Actor</dt><dd className="break-all">{auditPreview.actorUserId}</dd></div><div><dt className="font-semibold text-slate-800">Action</dt><dd>{auditPreview.action}</dd></div><div><dt className="font-semibold text-slate-800">Target</dt><dd>{auditPreview.target}</dd></div><div><dt className="font-semibold text-slate-800">Timestamp</dt><dd>{auditPreview.timestamp}</dd></div></dl><button type="button" className="mt-5 min-h-11 rounded-xl border border-slate-300 px-4 text-sm font-semibold" onClick={() => setOpen(false)}>Close</button></div>}
    </div>
  );
}

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

  if (!allowed) return <p className="winnie-sensitive-note">This sensitive action requires additional permission.</p>;

  return (
    <div className="mt-6">
      <button type="button" className="winnie-sensitive-button" onClick={() => setOpen(true)}>Review sensitive action</button>
      {open && <div className="winnie-sensitive-dialog" role="dialog" aria-label="Sensitive action confirmation"><h2 className="font-semibold text-[#182235]">Additional confirmation required</h2><p className="mt-2 text-sm leading-6 text-[#69748b]">This is a permission and audit placeholder. It does not change any business data in Phase 2B.</p><dl className="mt-4 grid gap-2 text-xs text-[#69748b]"><div><dt className="font-semibold text-[#182235]">Actor</dt><dd className="break-all">{auditPreview.actorUserId}</dd></div><div><dt className="font-semibold text-[#182235]">Action</dt><dd>{auditPreview.action}</dd></div><div><dt className="font-semibold text-[#182235]">Target</dt><dd>{auditPreview.target}</dd></div><div><dt className="font-semibold text-[#182235]">Timestamp</dt><dd>{auditPreview.timestamp}</dd></div></dl><button type="button" className="winnie-button-secondary mt-5" onClick={() => setOpen(false)}>Close</button></div>}
    </div>
  );
}

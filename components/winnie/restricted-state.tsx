"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";

export function RestrictedState() {
  return (
    <section className="winnie-page-card">
      <p className="winnie-page-eyebrow"><Sparkles aria-hidden="true" className="mr-2 inline h-4 w-4" />Access Restricted</p>
      <h1>This area is not available to your role.</h1>
      <p>Your Google account is recognized, but you do not currently have permission to access this area.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="winnie-button-primary" href="/manager">Back to Dashboard</Link>
        <button className="winnie-button-secondary" type="button" onClick={() => signOut({ callbackUrl: "/manager/login" })}>Sign Out</button>
      </div>
    </section>
  );
}

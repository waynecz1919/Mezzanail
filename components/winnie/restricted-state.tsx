"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export function RestrictedState() {
  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-[#eadfd9] bg-white p-8 shadow-sm sm:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9d7166]">Access Restricted</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">This area is not available to your role.</h1>
      <p className="mt-4 max-w-xl leading-7 text-slate-600">Your Google account is recognized, but you do not currently have permission to access this area.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="inline-flex min-h-12 items-center rounded-xl bg-slate-950 px-5 font-semibold text-white" href="/manager">Back to Dashboard</Link>
        <button className="inline-flex min-h-12 items-center rounded-xl border border-slate-300 px-5 font-semibold text-slate-800" type="button" onClick={() => signOut({ callbackUrl: "/manager/login" })}>Sign Out</button>
      </div>
    </section>
  );
}

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

type ManagerLoginProps = {
  googleConfigured: boolean;
  accessConfigured: boolean;
};

export function ManagerLogin({ googleConfigured, accessConfigured }: ManagerLoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSignIn = googleConfigured && accessConfigured;

  async function handleSignIn() {
    setError(null);
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/manager" });
    } catch {
      setError("Sign-in could not be started. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#fdf9f7] px-5 py-10 text-slate-900">
      <section className="w-full max-w-md rounded-3xl border border-[#eadfd9] bg-white p-8 shadow-[0_24px_70px_rgba(102,72,60,0.12)] sm:p-10">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#9d7166]">Winnie AI Manager</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Mezzanail Internal Management System</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">Authorized Mezzanail staff only.</p>
        </div>

        <button
          type="button"
          onClick={handleSignIn}
          disabled={!canSignIn || loading}
          className="min-h-14 w-full rounded-2xl bg-slate-950 px-5 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Connecting…" : "Continue with Google"}
        </button>

        {!canSignIn && (
          <p className="mt-4 rounded-xl bg-[#fff5ed] px-4 py-3 text-sm leading-5 text-[#87533e]">
            Google sign-in is not configured for this environment. An administrator must configure the company access placeholders before enabling the internal entry point.
          </p>
        )}
        {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
      </section>
    </main>
  );
}

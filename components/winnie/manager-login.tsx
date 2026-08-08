"use client";

import { Sparkles } from "lucide-react";
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
    <main className="winnie-login-page" aria-label="Winnie AI Manager">
      <section className="winnie-login-card">
        <div className="winnie-login-brand">
          <span className="winnie-brand-mark"><Sparkles aria-hidden="true" className="h-5 w-5" /></span>
          <div>
            <strong>Winnie AI</strong>
            <span>Mezzanail Operating System</span>
          </div>
        </div>

        <h1>Welcome back.</h1>
        <p>Mezzanail Internal Management System</p>
        <p>Authorized Mezzanail staff only.</p>

        <button type="button" onClick={handleSignIn} disabled={!canSignIn || loading} className="winnie-login-button">
          {loading ? "Connecting…" : "Continue with Google"}
        </button>

        {!canSignIn && (
          <p className="winnie-login-note">
            Google sign-in is not configured for this environment. An administrator must configure the company access placeholders before enabling the internal entry point.
          </p>
        )}
        {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
      </section>
    </main>
  );
}

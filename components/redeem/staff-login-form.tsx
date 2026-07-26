"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";

export function StaffLoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/redeem/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: form.get("staffId"),
          password: form.get("password"),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error || "Unable to sign in.");
        setLoading(false);
        return;
      }
      window.location.assign("/redeem");
    } catch {
      setError("Unable to connect. Check your internet connection and try again.");
      setLoading(false);
    }
  }

  return (
    <main className="redeem-root redeem-login-shell">
      <section className="redeem-login-card" aria-labelledby="login-title">
        <div className="redeem-mark" aria-hidden="true">M</div>
        <p className="redeem-kicker">MEZZANAIL</p>
        <h1 id="login-title">Redeem Center</h1>
        <p className="redeem-subtitle">Staff Internal Use Only</p>
        <div className="redeem-security-note">
          <LockKeyhole size={18} aria-hidden="true" />
          <span>Sign in with your staff credentials to continue.</span>
        </div>
        <form className="redeem-form" onSubmit={submit}>
          <label>
            <span>Staff ID</span>
            <input name="staffId" autoComplete="username" required maxLength={80} />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" autoComplete="current-password" required maxLength={256} />
          </label>
          {error && <p className="redeem-error" role="alert">{error}</p>}
          <button className="redeem-primary" type="submit" disabled={loading}>
            <LogIn size={19} aria-hidden="true" />
            {loading ? "Signing in…" : "Staff Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}

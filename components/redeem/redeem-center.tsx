"use client";

import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  LogOut,
  MessageCircle,
  PlusCircle,
  Search,
  Send,
  ShieldCheck,
  TicketCheck,
  XCircle,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { buildWhatsAppMessage, buildWhatsAppUrl, normalizeRedeemCode } from "@/lib/redeem/core";
import type { RedeemCodeRecord, RedeemStatus } from "@/lib/redeem/types";

type Tab = "send" | "verify" | "records";
type VerifyOutcome = "invalid" | "already_redeemed" | "expired" | "cancelled" | "valid" | "redeemed";
type VerifyResult = { outcome: VerifyOutcome; record: RedeemCodeRecord | null };

const filters: Array<"all" | RedeemStatus> = [
  "all", "pending", "sent", "redeemed", "expired", "cancelled",
];

function dateOnly(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(value.includes("T") ? value : `${value}T00:00:00+08:00`));
}

function dateTime(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(value));
}

function dateInputValue(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function StatusPill({ status }: { status: RedeemStatus }) {
  return <span className={`redeem-status is-${status}`}>{status}</span>;
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const result = await response.json().catch(() => ({}));
  if (response.status === 401) {
    window.location.assign("/redeem/login");
    throw new Error("Authentication required.");
  }
  if (!response.ok) throw new Error(result.error || "Something went wrong.");
  return result as T;
}

function RecordDetails({ record }: { record: RedeemCodeRecord }) {
  return (
    <div className="redeem-customer-card">
      <div className="redeem-customer-head">
        <div>
          <span>Customer</span>
          <h3>{record.customer_name}</h3>
          <p>{record.phone} · {record.customer_group}</p>
        </div>
        <StatusPill status={record.status} />
      </div>
      <div className="redeem-code-display compact">{record.redeem_code}</div>
      <dl className="redeem-detail-grid">
        <div><dt>Voucher</dt><dd>{record.voucher_description}</dd></div>
        <div><dt>Voucher Type</dt><dd>{record.voucher_type}</dd></div>
        <div><dt>Valid Until</dt><dd>{dateOnly(record.expiry_date)}</dd></div>
        {record.redeemed_at && <div><dt>Redeemed At</dt><dd>{dateTime(record.redeemed_at)}</dd></div>}
        {record.redeemed_by && <div><dt>Redeemed By</dt><dd>{record.redeemed_by}</dd></div>}
      </dl>
    </div>
  );
}

export function RedeemCenter({ staffId }: { staffId: string }) {
  const [tab, setTab] = useState<Tab>("send");

  async function logout() {
    await fetch("/api/redeem/auth/logout", { method: "POST" });
    window.location.assign("/redeem/login");
  }

  return (
    <main className="redeem-root">
      <header className="redeem-header">
        <div className="redeem-wrap redeem-header-inner">
          <div>
            <p className="redeem-kicker">MEZZANAIL</p>
            <h1>Redeem Center</h1>
            <p className="redeem-subtitle">Staff Internal Use Only</p>
          </div>
          <button className="redeem-logout" onClick={logout} type="button" aria-label={`Sign out ${staffId}`}>
            <span>{staffId}</span><LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="redeem-wrap">
        <nav className="redeem-tabs" aria-label="Redeem Center sections">
          <button className={tab === "send" ? "is-active" : ""} onClick={() => setTab("send")} type="button">
            <Send size={18} /> <span>Send Code</span>
          </button>
          <button className={tab === "verify" ? "is-active" : ""} onClick={() => setTab("verify")} type="button">
            <ShieldCheck size={18} /> <span>Verify Code</span>
          </button>
          <button className={tab === "records" ? "is-active" : ""} onClick={() => setTab("records")} type="button">
            <ClipboardCheck size={18} /> <span>Records</span>
          </button>
        </nav>

        <section className="redeem-panel">
          {tab === "send" && <SendCodePanel onOpenRecords={() => setTab("records")} />}
          {tab === "verify" && <VerifyCodePanel />}
          {tab === "records" && <RecordsPanel />}
        </section>
      </div>
    </main>
  );
}

function SendCodePanel({ onOpenRecords }: { onOpenRecords: () => void }) {
  const [record, setRecord] = useState<RedeemCodeRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sendError, setSendError] = useState("");
  const today = new Date();
  const defaultExpiry = dateInputValue(
    new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
  );

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await api<{ record: RedeemCodeRecord }>("/api/redeem/codes", {
        method: "POST",
        body: JSON.stringify({
          customerName: form.get("customerName"),
          phone: form.get("phone"),
          customerGroup: form.get("customerGroup"),
          voucherType: form.get("voucherType"),
          voucherDescription: form.get("voucherDescription"),
          expiryDate: form.get("expiryDate"),
          notes: form.get("notes"),
        }),
      });
      setRecord(result.record);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate code.");
    } finally {
      setLoading(false);
    }
  }

  const message = record ? buildWhatsAppMessage({
    customerName: record.customer_name,
    voucherDescription: record.voucher_description,
    redeemCode: record.redeem_code,
    expiryDate: dateOnly(record.expiry_date),
  }) : "";

  async function markSent() {
    if (!record || record.status !== "pending") return;
    setSendError("");
    try {
      const result = await api<{ record: RedeemCodeRecord }>(
        `/api/redeem/codes/${encodeURIComponent(record.redeem_code)}`,
        { method: "PATCH", body: JSON.stringify({ action: "sent" }), keepalive: true },
      );
      setRecord(result.record);
    } catch (caught) {
      setSendError(caught instanceof Error ? caught.message : "Unable to update sent status.");
    }
  }

  if (record) {
    const whatsAppUrl = buildWhatsAppUrl(record.phone, message);
    return (
      <div className="redeem-success-layout">
        <div className="redeem-section-heading">
          <div className="redeem-heading-icon success"><TicketCheck size={23} /></div>
          <div><p>Code ready</p><h2>Voucher generated</h2></div>
        </div>
        <RecordDetails record={record} />
        <div className="redeem-message-preview">
          <div className="redeem-preview-title"><MessageCircle size={18} /><strong>WhatsApp message preview</strong></div>
          <pre>{message}</pre>
        </div>
        {sendError && <p className="redeem-error" role="alert">{sendError}</p>}
        <div className="redeem-action-stack">
          <a className="redeem-whatsapp" href={whatsAppUrl} target="_blank" rel="noreferrer" onClick={() => void markSent()}>
            <MessageCircle size={20} /> Send via WhatsApp
          </a>
          <button className="redeem-secondary" type="button" onClick={() => setRecord(null)}>
            <PlusCircle size={19} /> Generate another
          </button>
          <button className="redeem-link-button" type="button" onClick={onOpenRecords}>View all records</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="redeem-section-heading">
        <div className="redeem-heading-icon"><Send size={22} /></div>
        <div><p>Create voucher</p><h2>Send a redeem code</h2></div>
      </div>
      <form className="redeem-form redeem-form-grid" onSubmit={generate}>
        <label><span>Customer Name *</span><input name="customerName" required maxLength={120} autoComplete="name" placeholder="Customer name" /></label>
        <label><span>Phone Number *</span><input name="phone" required maxLength={32} inputMode="tel" autoComplete="tel" placeholder="e.g. 60123456789" /></label>
        <label><span>Customer Group *</span><input name="customerGroup" required maxLength={80} list="customer-groups" placeholder="Select or type group" />
          <datalist id="customer-groups"><option value="Member" /><option value="VIP" /><option value="Inactive Member" /><option value="New Customer" /></datalist>
        </label>
        <label><span>Voucher Type *</span><select name="voucherType" required defaultValue="Wake Up">
          <option>Wake Up</option><option>Birthday</option><option>Loyalty</option><option>Service Recovery</option><option>Gift</option><option>Other</option>
        </select></label>
        <label className="is-wide"><span>Voucher Description *</span><textarea name="voucherDescription" required maxLength={500} rows={3} placeholder="Describe the exact voucher benefit" /></label>
        <label><span>Expiry Date *</span><input name="expiryDate" type="date" required min={dateInputValue(today)} defaultValue={defaultExpiry} /></label>
        <label className="is-wide"><span>Notes</span><textarea name="notes" maxLength={1000} rows={3} placeholder="Internal notes (optional)" /></label>
        {error && <p className="redeem-error is-wide" role="alert">{error}</p>}
        <button className="redeem-primary is-wide" type="submit" disabled={loading}>
          <TicketCheck size={20} /> {loading ? "Generating…" : "Generate Redeem Code"}
        </button>
      </form>
    </>
  );
}

function VerifyCodePanel() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function check(event: FormEvent) {
    event.preventDefault();
    const normalized = normalizeRedeemCode(code);
    setCode(normalized);
    setLoading(true);
    setError("");
    try {
      const response = await api<VerifyResult>(`/api/redeem/codes/${encodeURIComponent(normalized)}`);
      setResult(response);
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Unable to check code.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmRedeem() {
    if (!result?.record || !window.confirm(`Redeem ${result.record.redeem_code} now? This cannot be undone.`)) return;
    setLoading(true);
    setError("");
    try {
      const response = await api<VerifyResult>(
        `/api/redeem/codes/${encodeURIComponent(result.record.redeem_code)}`,
        { method: "PATCH", body: JSON.stringify({ action: "redeem" }) },
      );
      setResult(response);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to redeem code.";
      setError(message);
      try {
        setResult(await api<VerifyResult>(`/api/redeem/codes/${encodeURIComponent(result.record.redeem_code)}`));
      } catch {}
    } finally {
      setLoading(false);
    }
  }

  const states: Record<VerifyOutcome, { title: string; text: string; className: string }> = {
    invalid: { title: "Invalid code", text: "No matching redeem code was found.", className: "danger" },
    already_redeemed: { title: "Already redeemed", text: "This voucher has already been used.", className: "warning" },
    expired: { title: "Expired", text: "This voucher is past its expiry date.", className: "warning" },
    cancelled: { title: "Cancelled", text: "This voucher was cancelled and cannot be used.", className: "danger" },
    valid: { title: "Valid voucher", text: "Customer and voucher details match an active code.", className: "success" },
    redeemed: { title: "Redeemed successfully", text: "The redemption has been recorded.", className: "success" },
  };

  return (
    <>
      <div className="redeem-section-heading">
        <div className="redeem-heading-icon"><ShieldCheck size={22} /></div>
        <div><p>In-store validation</p><h2>Verify a redeem code</h2></div>
      </div>
      <form className="redeem-verify-form" onSubmit={check}>
        <label><span>Redeem Code</span><input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required autoCapitalize="characters" autoCorrect="off" spellCheck={false} placeholder="MN-WAKE-XXXX" /></label>
        <button className="redeem-primary" disabled={loading} type="submit"><Search size={20} /> {loading ? "Checking…" : "Check Code"}</button>
      </form>
      {error && <p className="redeem-error" role="alert">{error}</p>}
      {result && (
        <div className={`redeem-result is-${states[result.outcome].className}`} aria-live="polite">
          <div className="redeem-result-title">
            {states[result.outcome].className === "success" ? <CheckCircle2 /> : <XCircle />}
            <div><h3>{states[result.outcome].title}</h3><p>{states[result.outcome].text}</p></div>
          </div>
          {result.record && <RecordDetails record={result.record} />}
          {result.outcome === "valid" && (
            <button className="redeem-confirm" type="button" onClick={confirmRedeem} disabled={loading}>
              <TicketCheck size={20} /> {loading ? "Confirming…" : "Confirm Redeem"}
            </button>
          )}
        </div>
      )}
    </>
  );
}

function RecordsPanel() {
  const [records, setRecords] = useState<RedeemCodeRecord[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | RedeemStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ q: query, status });
      const result = await api<{ records: RedeemCodeRecord[]; hasMore: boolean }>(
        `/api/redeem/codes?${params}`,
        { signal },
      );
      setRecords(result.records);
      setHasMore(result.hasMore);
    } catch (caught) {
      if ((caught as Error)?.name !== "AbortError") {
        setError(caught instanceof Error ? caught.message : "Unable to load records.");
      }
    } finally {
      setLoading(false);
    }
  }, [query, status]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => void load(controller.signal), 250);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [load]);

  const summary = useMemo(() => `${records.length}${hasMore ? "+" : ""} record${records.length === 1 ? "" : "s"}`, [records.length, hasMore]);

  return (
    <>
      <div className="redeem-section-heading records-heading">
        <div className="redeem-heading-icon"><ClipboardCheck size={22} /></div>
        <div><p>Voucher history</p><h2>Redeem records</h2><span>{summary}</span></div>
      </div>
      <div className="redeem-record-tools">
        <label className="redeem-search"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, phone or code" /></label>
        <div className="redeem-filters" aria-label="Filter by status">
          {filters.map((item) => <button key={item} type="button" className={status === item ? "is-active" : ""} onClick={() => setStatus(item)}>{item}</button>)}
        </div>
      </div>
      {error && <p className="redeem-error" role="alert">{error}</p>}
      {loading ? (
        <div className="redeem-empty"><Clock3 className="spin" /><p>Loading records…</p></div>
      ) : records.length === 0 ? (
        <div className="redeem-empty"><ClipboardCheck /><p>No matching records.</p></div>
      ) : (
        <div className="redeem-record-list">
          {records.map((record) => (
            <article className="redeem-record" key={record.id}>
              <div className="redeem-record-main">
                <div><h3>{record.customer_name}</h3><p>{record.phone}</p></div>
                <StatusPill status={record.status} />
              </div>
              <div className="redeem-record-code">{record.redeem_code}</div>
              <dl>
                <div><dt>Voucher Type</dt><dd>{record.voucher_type}</dd></div>
                <div><dt>Created Date</dt><dd>{dateTime(record.created_at)}</dd></div>
                <div><dt>Sent Date</dt><dd>{dateTime(record.sent_at)}</dd></div>
                <div><dt>Redeemed Date</dt><dd>{dateTime(record.redeemed_at)}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      )}
      {hasMore && <p className="redeem-limit-note">Showing the latest 100 records. Refine your search to find older records.</p>}
    </>
  );
}

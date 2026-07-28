"use client";

import {
  Check,
  ChevronRight,
  CircleAlert,
  Download,
  Expand,
  FileDown,
  FileSpreadsheet,
  Gift,
  History,
  Import,
  ListChecks,
  Lock,
  LogOut,
  Maximize2,
  Medal,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trophy,
  Unlock,
  Users,
  X,
} from "lucide-react";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ImportSummary,
  JackpotDraw,
  JackpotPrize,
  JackpotState,
  WinnerResult,
} from "@/lib/jackpot/types";

type Tab = "draw" | "participants" | "prizes" | "winners" | "audit";
type DrawResponse = { winner: WinnerResult; idempotent: boolean };

const redrawReasons = [
  "Winner Not Present",
  "Winner Unreachable",
  "Eligibility Error",
  "Duplicate Entry",
  "Declined Prize",
  "Technical Issue",
  "Other",
];

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const result = await response.json().catch(() => ({}));
  if (response.status === 401) {
    window.location.assign("/anniversary-jackpot/login");
    throw new Error("Authentication required.");
  }
  if (!response.ok) throw new Error(result.error || "Unable to complete this request.");
  return result as T;
}

function dateTime(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(value));
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "MN";
}

function winnerAngle(participantId: string) {
  let hash = 0;
  for (const character of participantId) hash = (hash * 31 + character.charCodeAt(0)) % 360;
  return 7200 + hash;
}

function StatusBadge({ status }: { status: JackpotDraw["status"] }) {
  return <span className={`jackpot-status is-${status}`}>{status}</span>;
}

export function JackpotConsole({
  initialState,
  previewMode = false,
}: {
  initialState: JackpotState;
  previewMode?: boolean;
}) {
  const [state, setState] = useState(initialState);
  const [tab, setTab] = useState<Tab>("draw");
  const [liveMode, setLiveMode] = useState(false);
  const [winner, setWinner] = useState<WinnerResult | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [redrawOpen, setRedrawOpen] = useState(false);
  const [redrawReason, setRedrawReason] = useState(redrawReasons[0]);
  const [otherReason, setOtherReason] = useState("");
  const animationTimer = useRef<number | null>(null);
  const isAdmin = state.role === "owner" || state.role === "admin";

  const loadState = useCallback(async () => {
    const next = await api<JackpotState>("/api/anniversary-jackpot/state");
    setState(next);
    return next;
  }, []);

  useEffect(() => {
    const fullscreenChange = () => {
      if (!document.fullscreenElement) setLiveMode(false);
    };
    document.addEventListener("fullscreenchange", fullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChange);
      if (animationTimer.current) window.clearTimeout(animationTimer.current);
    };
  }, [state.role]);

  const currentPrize = useMemo(
    () => state.prizes.find((prize) => prize.status === "active" && prize.remaining_quantity > 0)
      || state.prizes.find((prize) => prize.remaining_quantity > 0)
      || null,
    [state.prizes],
  );
  const openDraw = useMemo(
    () => state.draws.find((draw) => draw.status === "pending" || draw.status === "unreachable") || null,
    [state.draws],
  );
  const wheelNames = useMemo(
    () => state.participants.filter((participant) => participant.eligible).slice(0, 8),
    [state.participants],
  );
  const completedUnits = state.prizes.reduce(
    (total, prize) => total + (prize.quantity - prize.remaining_quantity),
    0,
  );
  const totalUnits = state.prizes.reduce((total, prize) => total + prize.quantity, 0);

  const activeWinner = useMemo(() => winner || (openDraw ? {
      drawId: openDraw.id,
      prizeId: openDraw.prize_id,
      winnerParticipantId: openDraw.participant_id,
      displayName: openDraw.customer_name,
      memberIdMasked: openDraw.member_id_masked,
      phoneLast4: openDraw.phone_last4,
      prizeName: openDraw.prize_name,
      isJackpot: openDraw.is_jackpot,
      resultToken: openDraw.request_id,
      drawnAt: openDraw.drawn_at,
      status: openDraw.status,
    } : null), [openDraw, winner]);

  async function logout() {
    if (previewMode) {
      window.location.assign("/");
      return;
    }
    await fetch("/api/redeem/auth/logout", { method: "POST" });
    window.location.assign("/anniversary-jackpot/login");
  }

  async function enterLiveMode() {
    setLiveMode(true);
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen may require browser permission; live layout still activates.
    }
  }

  function showWinnerAfterAnimation(nextWinner: WinnerResult) {
    setWinner(nextWinner);
    setSpinning(true);
    if (animationTimer.current) window.clearTimeout(animationTimer.current);
    animationTimer.current = window.setTimeout(() => {
      setSpinning(false);
      setWinner(nextWinner);
    }, 12800);
  }

  async function spin() {
    if (!currentPrize || spinning || busy || openDraw) return;
    setBusy(true);
    setError("");
    try {
      if (previewMode) {
        const eligible = state.participants.filter((participant) => participant.eligible);
        const participant = eligible[state.draws.length % eligible.length];
        if (!participant) throw new Error("No eligible preview participant.");
        showWinnerAfterAnimation({
          drawId: crypto.randomUUID(),
          prizeId: currentPrize.id,
          winnerParticipantId: participant.id,
          displayName: participant.customer_name,
          memberIdMasked: participant.member_id
            ? `${participant.member_id.slice(0, 2)}***${participant.member_id.slice(-2)}`
            : "—",
          phoneLast4: participant.phone_last4,
          prizeName: currentPrize.prize_name,
          isJackpot: currentPrize.is_jackpot,
          resultToken: crypto.randomUUID(),
          drawnAt: new Date().toISOString(),
          status: "pending",
        });
        return;
      }
      const result = await api<DrawResponse>("/api/anniversary-jackpot/draw", {
        method: "POST",
        body: JSON.stringify({
          prizeId: currentPrize.id,
          requestId: crypto.randomUUID(),
        }),
      });
      showWinnerAfterAnimation(result.winner);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to draw a winner.");
    } finally {
      setBusy(false);
    }
  }

  async function updateWinner(action: "confirm" | "unreachable") {
    if (!activeWinner) return;
    setBusy(true);
    setError("");
    try {
      if (previewMode) {
        setWinner(action === "unreachable" ? { ...activeWinner, status: "unreachable" } : null);
        return;
      }
      await api(`/api/anniversary-jackpot/draws/${activeWinner.drawId}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      setWinner(action === "unreachable" ? { ...activeWinner, status: "unreachable" } : null);
      await loadState();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update this winner.");
    } finally {
      setBusy(false);
    }
  }

  async function redraw() {
    if (!activeWinner) return;
    const reason = redrawReason === "Other" ? `Other: ${otherReason.trim()}` : redrawReason;
    if (redrawReason === "Other" && !otherReason.trim()) {
      setError("Enter the redraw reason.");
      return;
    }
    const confirmJackpot = activeWinner.isJackpot
      ? window.confirm("This will void the Jackpot winner and create a new draw. Continue?")
      : true;
    if (!confirmJackpot) return;

    setBusy(true);
    setError("");
    try {
      if (previewMode) {
        const eligible = state.participants.filter(
          (participant) => participant.eligible && participant.id !== activeWinner.winnerParticipantId,
        );
        const participant = eligible[(state.draws.length + 1) % eligible.length];
        if (!participant) throw new Error("No eligible preview participant.");
        setRedrawOpen(false);
        showWinnerAfterAnimation({
          ...activeWinner,
          drawId: crypto.randomUUID(),
          winnerParticipantId: participant.id,
          displayName: participant.customer_name,
          memberIdMasked: participant.member_id
            ? `${participant.member_id.slice(0, 2)}***${participant.member_id.slice(-2)}`
            : "—",
          phoneLast4: participant.phone_last4,
          resultToken: crypto.randomUUID(),
          drawnAt: new Date().toISOString(),
          status: "pending",
        });
        return;
      }
      const result = await api<DrawResponse>(
        `/api/anniversary-jackpot/draws/${activeWinner.drawId}/redraw`,
        {
          method: "POST",
          body: JSON.stringify({
            requestId: crypto.randomUUID(),
            reason,
            confirmJackpot,
          }),
        },
      );
      setRedrawOpen(false);
      await loadState();
      showWinnerAfterAnimation(result.winner);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to redraw.");
    } finally {
      setBusy(false);
    }
  }

  const wheelStyle = {
    "--jackpot-stop": `${activeWinner ? winnerAngle(activeWinner.winnerParticipantId) : 1800}deg`,
  } as React.CSSProperties;

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode; admin?: boolean }> = [
    { id: "draw", label: "Live Draw", icon: <Sparkles size={17} /> },
    { id: "participants", label: "Participants", icon: <Users size={17} />, admin: true },
    { id: "prizes", label: "Prizes", icon: <Gift size={17} />, admin: true },
    { id: "winners", label: "Winners", icon: <Trophy size={17} /> },
    { id: "audit", label: "Audit Log", icon: <History size={17} />, admin: true },
  ];

  return (
    <main className={`jackpot-root ${liveMode ? "is-live" : ""} ${previewMode ? "is-preview" : ""}`}>
      {!liveMode && (
        <header className="jackpot-header">
          <div className="jackpot-shell jackpot-header-inner">
            <div className="jackpot-brand">
              <span className="jackpot-monogram">M</span>
              <div>
                <p>MEZZANAIL · 7TH ANNIVERSARY</p>
                <h1>Jackpot Control Room</h1>
              </div>
            </div>
            <div className="jackpot-session">
              {previewMode && <strong className="jackpot-preview-badge">DEMO PREVIEW</strong>}
              <span>{state.staffId} · {state.role}</span>
              <button type="button" onClick={logout} aria-label="Sign out"><LogOut size={18} /></button>
            </div>
          </div>
        </header>
      )}

      {!liveMode && (
        <nav className="jackpot-shell jackpot-tabs" aria-label="Jackpot sections">
          {tabs.filter((item) => !item.admin || isAdmin).map((item) => (
            <button
              type="button"
              key={item.id}
              className={tab === item.id ? "is-active" : ""}
              onClick={() => setTab(item.id)}
            >
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      <div className={liveMode ? "jackpot-live-shell" : "jackpot-shell jackpot-content"}>
        {(tab === "draw" || liveMode) && (
          <section className="jackpot-stage" aria-labelledby="jackpot-title">
            <header className="jackpot-stage-header">
              <div>
                <p>MEZZANAIL 7TH ANNIVERSARY</p>
                <h2 id="jackpot-title">{currentPrize?.is_jackpot ? "Final Jackpot Draw" : "Final Celebration Lucky Wheel"}</h2>
              </div>
              {!liveMode && (
                <button className="jackpot-outline-button" type="button" onClick={enterLiveMode}>
                  <Maximize2 size={17} /> Full Screen
                </button>
              )}
            </header>

            <div className="jackpot-draw-grid">
              <div className="jackpot-wheel-panel">
                <div className="jackpot-pointer" aria-hidden="true" />
                <div
                  key={spinning ? activeWinner?.resultToken || "spinning" : "idle"}
                  className={`jackpot-wheel ${spinning ? "is-spinning" : ""}`}
                  style={wheelStyle}
                >
                  <div className="jackpot-wheel-rim" />
                  {wheelNames.map((participant, index) => (
                    <span
                      className="jackpot-wheel-name"
                      key={participant.id}
                      style={{ "--name-angle": `${index * 45}deg` } as React.CSSProperties}
                    >
                      {initials(participant.customer_name)}
                    </span>
                  ))}
                  <div className="jackpot-wheel-center">
                    <span>7</span><small>YEARS</small>
                  </div>
                </div>
                <div className="jackpot-drawing-state" aria-live="polite">
                  {spinning ? "DRAWING · SECURE RESULT RECEIVED" : openDraw ? "WINNER AWAITING CONFIRMATION" : "READY FOR THE NEXT DRAW"}
                </div>
              </div>

              <aside className="jackpot-prize-card">
                <p>CURRENT PRIZE</p>
                <div className="jackpot-prize-icon"><Gift size={30} /></div>
                <h3>{currentPrize?.prize_name || "Set up prizes to begin"}</h3>
                <span>{currentPrize?.is_jackpot ? "JACKPOT GRAND PRIZE" : currentPrize?.prize_description || "Anniversary draw prize"}</span>
                <dl>
                  <div><dt>Remaining</dt><dd>{currentPrize?.remaining_quantity ?? 0}</dd></div>
                  <div><dt>Participants</dt><dd>{state.summary.eligibleParticipants}</dd></div>
                  <div><dt>Eligible Tickets</dt><dd>{state.summary.remainingTickets}</dd></div>
                  <div><dt>Progress</dt><dd>{completedUnits}/{totalUnits}</dd></div>
                </dl>
                {isAdmin && (
                  <button
                    className="jackpot-spin-button"
                    type="button"
                    onClick={spin}
                    disabled={
                      spinning
                      || busy
                      || Boolean(openDraw)
                      || !state.campaign.participant_list_locked
                      || !currentPrize
                    }
                  >
                    {spinning || busy ? <RefreshCw className="jackpot-spin-icon" size={24} /> : <Sparkles size={23} />}
                    {spinning ? "DRAWING" : busy ? "PLEASE WAIT" : "SPIN"}
                  </button>
                )}
                {!isAdmin && <p className="jackpot-view-only"><ShieldCheck size={16} /> Staff live view · controls locked</p>}
              </aside>
            </div>

            <div className="jackpot-progress">
              <span style={{ width: `${totalUnits ? (completedUnits / totalUnits) * 100 : 0}%` }} />
            </div>
            <p className="jackpot-fairness">
              Each eligible ticket has an equal chance of being selected. Winners are generated securely by the system and recorded for audit.<br />
              每一张合资格抽奖票都拥有同等中奖机会。中奖结果由系统安全随机产生，并保留完整记录。
            </p>
          </section>
        )}

        {!liveMode && tab === "participants" && isAdmin && (
          <ParticipantsPanel
            state={state}
            summary={importSummary}
            busy={busy}
            setBusy={setBusy}
            setError={setError}
            setSummary={setImportSummary}
            loadState={loadState}
            previewMode={previewMode}
          />
        )}
        {!liveMode && tab === "prizes" && isAdmin && (
          <PrizesPanel
            prizes={state.prizes}
            busy={busy}
            setBusy={setBusy}
            setError={setError}
            loadState={loadState}
            previewMode={previewMode}
          />
        )}
        {!liveMode && tab === "winners" && <WinnersPanel draws={state.draws} isAdmin={isAdmin} previewMode={previewMode} />}
        {!liveMode && tab === "audit" && isAdmin && <AuditPanel state={state} />}
      </div>

      {error && (
        <div className="jackpot-toast" role="alert">
          <CircleAlert size={19} /><span>{error}</span>
          <button type="button" onClick={() => setError("")} aria-label="Dismiss"><X size={17} /></button>
        </div>
      )}

      {activeWinner && !spinning && (
        <div className="jackpot-winner-overlay" role="dialog" aria-modal="true" aria-labelledby="winner-title">
          <div className={`jackpot-winner-card ${activeWinner.isJackpot ? "is-grand" : ""}`}>
            <div className="jackpot-winner-medal"><Medal size={34} /></div>
            <p>CONGRATULATIONS</p>
            <h2 id="winner-title">{activeWinner.displayName}</h2>
            <dl>
              <div><dt>Member ID</dt><dd>{activeWinner.memberIdMasked}</dd></div>
              <div><dt>Phone</dt><dd>****{activeWinner.phoneLast4}</dd></div>
              <div><dt>Prize</dt><dd>{activeWinner.prizeName}</dd></div>
            </dl>
            {isAdmin ? (
              <div className="jackpot-winner-actions">
                <button type="button" className="is-confirm" onClick={() => updateWinner("confirm")} disabled={busy}>
                  <Check size={18} /> Confirm Winner
                </button>
                <button type="button" onClick={() => updateWinner("unreachable")} disabled={busy}>
                  <CircleAlert size={18} /> Unable to Reach
                </button>
                <button type="button" className="is-redraw" onClick={() => setRedrawOpen(true)} disabled={busy}>
                  <RotateCcw size={18} /> Redraw with Reason
                </button>
              </div>
            ) : (
              <p className="jackpot-view-only">Awaiting Owner/Admin confirmation</p>
            )}
          </div>
        </div>
      )}

      {redrawOpen && activeWinner && (
        <div className="jackpot-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="redraw-title">
          <form className="jackpot-modal" onSubmit={(event) => { event.preventDefault(); void redraw(); }}>
            <button type="button" className="jackpot-modal-close" onClick={() => setRedrawOpen(false)} aria-label="Close"><X /></button>
            <p>OWNER / ADMIN CONTROL</p>
            <h2 id="redraw-title">Void and redraw</h2>
            <span>The original result remains in the audit history.</span>
            <label>
              <strong>Reason</strong>
              <select value={redrawReason} onChange={(event) => setRedrawReason(event.target.value)}>
                {redrawReasons.map((reason) => <option key={reason}>{reason}</option>)}
              </select>
            </label>
            {redrawReason === "Other" && (
              <label><strong>Other reason</strong><textarea value={otherReason} onChange={(event) => setOtherReason(event.target.value)} maxLength={220} required /></label>
            )}
            {activeWinner.isJackpot && <div className="jackpot-danger-note">This will void the Jackpot winner and create a new draw.</div>}
            <button type="submit" className="jackpot-danger-button" disabled={busy}><RotateCcw size={18} /> Void Result & Redraw</button>
          </form>
        </div>
      )}
    </main>
  );
}

function ParticipantsPanel({
  state,
  summary,
  busy,
  setBusy,
  setError,
  setSummary,
  loadState,
  previewMode,
}: {
  state: JackpotState;
  summary: ImportSummary | null;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setError: (value: string) => void;
  setSummary: (value: ImportSummary | null) => void;
  loadState: () => Promise<JackpotState>;
  previewMode: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function importCsv(file: File) {
    setBusy(true);
    setError("");
    try {
      const result = await api<{ summary: ImportSummary }>("/api/anniversary-jackpot/participants/import", {
        method: "POST",
        body: JSON.stringify({ source: "csv", csvText: await file.text() }),
      });
      setSummary(result.summary);
      await loadState();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to import participants.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function importDatabase() {
    setBusy(true);
    setError("");
    try {
      const result = await api<{ summary: ImportSummary }>("/api/anniversary-jackpot/participants/import", {
        method: "POST",
        body: JSON.stringify({ source: "promotion" }),
      });
      setSummary(result.summary);
      await loadState();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to import campaign entries.");
    } finally {
      setBusy(false);
    }
  }

  async function changeLock(action: "lock" | "unlock") {
    const reason = action === "unlock"
      ? window.prompt("Owner unlock reason (required):")?.trim() || ""
      : "";
    if (action === "unlock" && !reason) return;
    if (action === "lock" && !window.confirm("Lock the final participant list? Ticket counts cannot be changed while locked.")) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/anniversary-jackpot/participants/lock", {
        method: "POST",
        body: JSON.stringify({ action, reason }),
      });
      await loadState();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to change list lock.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="jackpot-admin-panel">
      <header className="jackpot-section-heading">
        <div><p>FINAL ELIGIBLE POOL</p><h2>Participant List</h2></div>
        <span className={state.campaign.participant_list_locked ? "is-locked" : ""}>
          {state.campaign.participant_list_locked ? <Lock size={15} /> : <Unlock size={15} />}
          {state.campaign.participant_list_locked ? "Locked" : "Unlocked"}
        </span>
      </header>
      <div className="jackpot-summary-grid">
        <SummaryCard icon={<Users />} label="Customers" value={state.summary.totalParticipants} />
        <SummaryCard icon={<Ticket />} label="Draw Tickets" value={state.summary.totalTickets} />
        <SummaryCard icon={<ListChecks />} label="Eligible" value={state.summary.eligibleParticipants} />
        <SummaryCard icon={<CircleAlert />} label="Ineligible" value={state.summary.invalidRecords} />
      </div>
      <div className="jackpot-admin-actions">
        <label className="jackpot-file-button">
          <Import size={17} /> Import CSV
          <input ref={fileRef} type="file" accept=".csv,text/csv" disabled={previewMode || busy || state.campaign.participant_list_locked} onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importCsv(file);
          }} />
        </label>
        <button type="button" onClick={importDatabase} disabled={previewMode || busy || state.campaign.participant_list_locked}><FileSpreadsheet size={17} /> Import Campaign DB</button>
        {state.campaign.participant_list_locked ? (
          state.role === "owner" && <button type="button" className="is-warning" onClick={() => changeLock("unlock")} disabled={previewMode || busy}><Unlock size={17} /> Unlock with Reason</button>
        ) : (
          <button type="button" className="is-primary" onClick={() => changeLock("lock")} disabled={previewMode || busy || !state.participants.length}><Lock size={17} /> Lock Participant List</button>
        )}
      </div>
      <label className="jackpot-rule-toggle">
        <span>
          <strong>Allow Multiple Wins</strong>
          <small>Default is off. When off, a confirmed winner is excluded from later prizes unless that prize explicitly allows previous winners.</small>
        </span>
        <input
          type="checkbox"
          checked={state.campaign.allow_multiple_wins}
          disabled={previewMode || busy || state.draws.length > 0}
          onChange={async (event) => {
            setBusy(true);
            setError("");
            try {
              await api("/api/anniversary-jackpot/settings", {
                method: "PATCH",
                body: JSON.stringify({ allowMultipleWins: event.target.checked }),
              });
              await loadState();
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : "Unable to update draw rules.");
            } finally {
              setBusy(false);
            }
          }}
        />
      </label>
      {summary && (
        <div className="jackpot-import-report">
          <strong>Import complete</strong>
          <span>{summary.importedParticipants} customers · {summary.totalTickets} tickets · {summary.duplicateMembers} duplicate members · {summary.invalidNumbers} invalid phones</span>
          {summary.errors.length > 0 && <details><summary>{summary.errors.length} import warning(s)</summary>{summary.errors.map((item) => <p key={item}>{item}</p>)}</details>}
        </div>
      )}
      <div className="jackpot-table-scroll">
        <table className="jackpot-table">
          <thead><tr><th>Customer</th><th>Member ID</th><th>Phone</th><th>Tickets</th><th>Eligibility</th><th>Source</th></tr></thead>
          <tbody>
            {state.participants.map((participant) => (
              <tr key={participant.id}>
                <td>{participant.customer_name}</td>
                <td>{participant.member_id || "—"}</td>
                <td>****{participant.phone_last4}</td>
                <td><strong>{participant.ticket_count}</strong></td>
                <td><span className={`jackpot-eligibility ${participant.eligible ? "is-valid" : "is-invalid"}`}>{participant.eligibility_status}</span></td>
                <td>{participant.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <article className="jackpot-summary-card"><span>{icon}</span><div><small>{label}</small><strong>{value.toLocaleString("en-MY")}</strong></div></article>;
}

function PrizesPanel({
  prizes,
  busy,
  setBusy,
  setError,
  loadState,
  previewMode,
}: {
  prizes: JackpotPrize[];
  busy: boolean;
  setBusy: (value: boolean) => void;
  setError: (value: string) => void;
  loadState: () => Promise<JackpotState>;
  previewMode: boolean;
}) {
  const [editing, setEditing] = useState<JackpotPrize | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  async function savePrize(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await api("/api/anniversary-jackpot/prizes", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify({
          prizeId: editing?.id,
          prizeName: form.get("prizeName"),
          prizeDescription: form.get("prizeDescription"),
          prizeImageUrl: form.get("prizeImageUrl"),
          quantity: Number(form.get("quantity")),
          drawOrder: Number(form.get("drawOrder")),
          isJackpot: form.get("isJackpot") === "on",
          allowPreviousWinner: form.get("allowPreviousWinner") === "on",
          status: form.get("status"),
        }),
      });
      setFormOpen(false);
      setEditing(null);
      await loadState();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save prize.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="jackpot-admin-panel">
      <header className="jackpot-section-heading">
        <div><p>DRAW ORDER & INVENTORY</p><h2>Prize Management</h2></div>
        <button type="button" className="jackpot-add-button" disabled={previewMode} onClick={() => { setEditing(null); setFormOpen(true); }}><Plus size={17} /> Add Prize</button>
      </header>
      <div className="jackpot-prize-list">
        {prizes.map((prize) => (
          <article className={prize.is_jackpot ? "is-jackpot" : ""} key={prize.id}>
            <span className="jackpot-prize-order">{String(prize.draw_order).padStart(2, "0")}</span>
            <div className="jackpot-prize-list-icon">{prize.is_jackpot ? <Trophy /> : <Gift />}</div>
            <div className="jackpot-prize-list-copy">
              <small>{prize.is_jackpot ? "FINAL JACKPOT" : "ANNIVERSARY PRIZE"}</small>
              <h3>{prize.prize_name}</h3>
              <p>{prize.prize_description || "No description"}</p>
            </div>
            <dl><div><dt>Quantity</dt><dd>{prize.quantity}</dd></div><div><dt>Remaining</dt><dd>{prize.remaining_quantity}</dd></div></dl>
            <button type="button" disabled={previewMode} onClick={() => { setEditing(prize); setFormOpen(true); }} aria-label={`Edit ${prize.prize_name}`}><Pencil size={17} /></button>
          </article>
        ))}
        {!prizes.length && <div className="jackpot-empty"><Gift /><p>No prizes configured. Add ordinary prizes first and the Jackpot last.</p></div>}
      </div>
      {formOpen && (
        <div className="jackpot-modal-backdrop">
          <form className="jackpot-modal jackpot-prize-form" onSubmit={savePrize}>
            <button type="button" className="jackpot-modal-close" onClick={() => setFormOpen(false)} aria-label="Close"><X /></button>
            <p>PRIZE MANAGEMENT</p><h2>{editing ? "Edit prize" : "Add prize"}</h2>
            <label><strong>Prize Name</strong><input name="prizeName" required maxLength={160} defaultValue={editing?.prize_name || ""} /></label>
            <label><strong>Description</strong><textarea name="prizeDescription" maxLength={1000} defaultValue={editing?.prize_description || ""} /></label>
            <label><strong>Image URL</strong><input name="prizeImageUrl" placeholder="/images/prize.png or https://…" defaultValue={editing?.prize_image_url || ""} /></label>
            <div className="jackpot-form-row">
              <label><strong>Quantity</strong><input name="quantity" type="number" min="1" max="1000" required defaultValue={editing?.quantity || 1} /></label>
              <label><strong>Draw Order</strong><input name="drawOrder" type="number" min="1" max="1000" required defaultValue={editing?.draw_order || prizes.length + 1} /></label>
            </div>
            <label><strong>Status</strong><select name="status" defaultValue={editing?.status || "active"}><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
            <label className="jackpot-check"><input name="allowPreviousWinner" type="checkbox" defaultChecked={editing?.allow_previous_winner} /><span>Allow previous winner for this prize</span></label>
            <label className="jackpot-check"><input name="isJackpot" type="checkbox" defaultChecked={editing?.is_jackpot} /><span>Jackpot Grand Prize (quantity 1, final draw only)</span></label>
            <button className="jackpot-primary-button" type="submit" disabled={busy}><Check size={18} /> Save Prize</button>
          </form>
        </div>
      )}
    </section>
  );
}

function WinnersPanel({ draws, isAdmin, previewMode }: { draws: JackpotDraw[]; isAdmin: boolean; previewMode: boolean }) {
  return (
    <section className="jackpot-admin-panel jackpot-winners-panel">
      <header className="jackpot-section-heading">
        <div><p>PERMANENT DRAW HISTORY</p><h2>Winner Records</h2></div>
        {isAdmin && !previewMode && <div className="jackpot-export-actions">
          <a href="/api/anniversary-jackpot/winners/export"><Download size={16} /> CSV</a>
          <a href="/api/anniversary-jackpot/winners/pdf"><FileDown size={16} /> PDF</a>
          <button type="button" onClick={() => window.print()}><Printer size={16} /> Print</button>
        </div>}
      </header>
      <div className="jackpot-table-scroll">
        <table className="jackpot-table">
          <thead><tr><th>Order</th><th>Prize</th><th>Winner</th><th>Member ID</th><th>Phone</th><th>Drawn</th><th>Confirmed</th><th>Status</th><th>Operator</th></tr></thead>
          <tbody>
            {draws.map((draw) => (
              <tr key={draw.id}>
                <td>{draw.draw_sequence}</td><td>{draw.prize_name}</td><td>{draw.customer_name}</td>
                <td>{draw.member_id_masked}</td><td>****{draw.phone_last4}</td>
                <td>{dateTime(draw.drawn_at)}</td><td>{dateTime(draw.confirmed_at)}</td>
                <td><StatusBadge status={draw.status} />{draw.void_reason && <small className="jackpot-void-reason">{draw.void_reason}</small>}</td>
                <td>{draw.confirmed_by || draw.drawn_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!draws.length && <div className="jackpot-empty"><Trophy /><p>No draw results yet.</p></div>}
      </div>
    </section>
  );
}

function AuditPanel({ state }: { state: JackpotState }) {
  return (
    <section className="jackpot-admin-panel">
      <header className="jackpot-section-heading"><div><p>IMMUTABLE OPERATION HISTORY</p><h2>Audit Log</h2></div><ShieldCheck size={26} /></header>
      <div className="jackpot-audit-list">
        {state.audit.map((log) => (
          <article key={log.id}>
            <span><History size={16} /></span>
            <div><strong>{log.action.replaceAll("_", " ")}</strong><p>{log.entity_type} · {log.entity_id || "campaign"}</p>{log.reason && <em>{log.reason}</em>}</div>
            <aside><b>{log.performed_by}</b><small>{dateTime(log.created_at)}</small></aside>
          </article>
        ))}
        {!state.audit.length && <div className="jackpot-empty"><History /><p>No audit events yet.</p></div>}
      </div>
    </section>
  );
}

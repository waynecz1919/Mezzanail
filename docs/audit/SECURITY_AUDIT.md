# Security audit

## Scope and evidence

This is a source-level and local-build audit of the `main` branch at `178ed50e`. It covers API authentication, origin/CSRF checks, cookies, secrets, rate limits, database query construction, error responses, indexing headers, and shared staff authorization. It does not replace a penetration test, provider review, or production log review.

## Endpoint coverage observed

| Surface | Observed control | Result |
|---|---|---|
| Redeem APIs | `requireApiStaff()` plus `hasValidOrigin()` on mutations (`app/api/redeem/*`) | No missing authentication was confirmed. |
| Jackpot APIs | `requireJackpotStaff()` on state/export/PDF and origin + admin checks on mutations (`app/api/anniversary-jackpot/*`) | No missing authentication was confirmed. |
| Job submission/PDF | `hasJobCsrfHeaders()`, idempotency key, size limit, DB-backed abuse check (`app/api/job/applications/*`) | Controls present; public form is intentionally unauthenticated. |
| Promotion share | Public endpoint, validates campaign/channel/language, logs only a hashed anonymous key (`app/api/promotion/share/route.ts`) | Public by design; rate-limit design is weak (`SEC-002`). |
| SQL | Neon parameterized query calls in `lib/redeem/db.ts`, `lib/job/db.ts`, `lib/jackpot/db.ts` and route modules | No obvious string-concatenated SQL was found. |

## Issue records

### SEC-001 — Redeem login rate limiting is process-local

- **Issue ID:** SEC-001
- **Title:** Login attempt limiter is an in-memory `Map`
- **Risk:** Medium
- **Status:** Confirmed
- **File path / location:** `app/api/redeem/auth/login/route.ts:9-28` (`attempts` Map keyed by the first `x-forwarded-for` value).
- **Problem:** The eight-attempt/15-minute limit exists only in one Node process. A multi-instance/serverless deployment can reset it between invocations; the first forwarded IP is also dependent on the hosting proxy being trusted.
- **Current impact:** Distributed brute-force attempts can bypass the intended aggregate limit. Password verification still uses scrypt and a delay for invalid credentials, so this is a rate-limit boundary weakness rather than a confirmed account takeover.
- **Recommendation:** Use a shared, expiring rate-limit store or provider edge limit keyed by a privacy-preserving client/network identifier, with proxy header validation and monitoring.
- **Safe to delete?:** No; this is a security hardening change.
- **Delete-before verification:** Model the actual Vercel/runtime topology, test concurrent instances, verify forwarded-header provenance, and run a controlled login-abuse test.

### SEC-002 — Promotion share limiter is keyed only by User-Agent

- **Issue ID:** SEC-002
- **Title:** Public share rate limiting can be bypassed or shared across users
- **Risk:** Low
- **Status:** Confirmed
- **File path / location:** `app/api/promotion/share/route.ts:12-18,35-42`.
- **Problem:** The key is a hash of campaign ID plus raw User-Agent. Users sharing the same browser User-Agent consume one another's ten-request window, while an attacker can rotate User-Agent values to create unlimited buckets. The endpoint has no origin check, although it only writes a Vercel log record and does not mutate a database or account.
- **Current impact:** Log spam and unnecessary request volume are possible; no direct privilege or customer-data impact was found.
- **Recommendation:** Use a platform rate limiter with bounded, privacy-safe IP/cookie signals and optionally same-origin validation. Keep the endpoint's current strict payload validation and avoid storing raw User-Agent/IP values.
- **Safe to delete?:** No.
- **Delete-before verification:** Define abuse/cost objectives, load-test rotated/shared User-Agents, and confirm the replacement does not collect unnecessary identifiers.

### SEC-003 — Origin validation trusts forwarded host headers

- **Issue ID:** SEC-003
- **Title:** Same-origin checks depend on hosting proxy header integrity
- **Risk:** Medium
- **Status:** Needs Manual Confirmation
- **File path / location:** `lib/redeem/http.ts:17-25` and `lib/job/http.ts:23-33` compare `Origin` to `x-forwarded-host || host`.
- **Problem:** The comparison is correct only if the production edge overwrites/removes untrusted `x-forwarded-host` and supplies a trustworthy `host`. The code permits missing `Origin` outside production (`NODE_ENV !== "production"`).
- **Current impact:** If an attacker can inject a forwarded host through the deployment path, origin checks could be weakened. No such production misconfiguration was proven from the repository.
- **Recommendation:** Verify Vercel/edge header behavior and document the trust boundary. Prefer an allowlisted canonical origin when the deployment has multiple hostnames, and fail closed for production requests with missing origin where compatible with clients.
- **Safe to delete?:** No.
- **Delete-before verification:** Inspect platform request headers, test hostile `Origin`/`x-forwarded-host` combinations in staging, and confirm legitimate browser/form flows remain valid.

### SEC-004 — Public HTML does not receive a baseline CSP

- **Issue ID:** SEC-004
- **Title:** CSP is scoped to Job API responses, not the public HTML or other internal pages
- **Risk:** Medium
- **Status:** Confirmed (hardening gap)
- **File path / location:** `next.config.ts:32-86` defines internal/TV/job headers but no `Content-Security-Policy`; `lib/job/http.ts:4-10` defines CSP only for Job API responses.
- **Problem:** The application embeds structured JSON-LD and deferred analytics (`app/layout.tsx:65`) without a route-wide CSP policy. Absence of CSP is not itself an exploit and no unsafe user HTML sink was found.
- **Current impact:** Reduced browser-side defense-in-depth if a future XSS or supply-chain issue reaches public HTML; adding a policy could affect Next scripts, fonts, analytics, and inline JSON-LD.
- **Recommendation:** Design a nonce/hash-based CSP per route, including a report-only rollout and explicit third-party allowlists. Do not copy the Job API `default-src 'none'` policy to pages without testing.
- **Safe to delete?:** No.
- **Delete-before verification:** Collect CSP violation reports in staging, test all public/internal routes, analytics, fonts, service workers, and inline structured data, then promote gradually.

### SEC-005 — Redeem and Jackpot share the same staff session realm

- **Issue ID:** SEC-005
- **Title:** Internal systems share cookie/session verification and credential sources
- **Risk:** Medium
- **Status:** Confirmed
- **File path / location:** `lib/redeem/auth.ts:65-81,98-112` defines the session cookie and merges `JACKPOT_STAFF_USERS` with `REDEEM_STAFF_USERS`; `lib/jackpot/http.ts:2-4,36-45` imports Redeem auth; `app/anniversary-jackpot/page.tsx:5,9-16` reads the same session.
- **Problem:** Redeem and Jackpot have route-specific role checks, but authentication is shared. A valid Redeem staff cookie is the identity presented to Jackpot; Jackpot mutating routes then apply `isJackpotAdmin` (`lib/jackpot/http.ts:40-42` and API routes).
- **Current impact:** A shared cookie secret, credential parsing path, and staff identity realm increase blast radius and make least-privilege review harder. No direct admin bypass was confirmed because Jackpot mutation routes check owner/admin roles.
- **Recommendation:** Separate session cookies/secrets and credential scopes for systems with different operational risk, or document the intentional shared realm and prove every read/mutation authorization path.
- **Safe to delete?:** No.
- **Delete-before verification:** Build an authorization matrix for each endpoint, test staff/admin/owner combinations, rotate secrets in staging, and verify logout/isolation across both systems.

## Positive security findings

- `lib/redeem/auth.ts:70-95` sets `httpOnly`, `sameSite="strict"`, path `/`, and production `secure` on the staff cookie. Local non-secure behavior is expected for development and should not be copied to production.
- `app/api/redeem/*` and `app/api/anniversary-jackpot/*` have authenticated route checks. Jackpot admin mutations additionally require owner/admin, and owner-only unlock is enforced (`app/api/anniversary-jackpot/participants/lock/route.ts:26`).
- `app/api/job/applications/route.ts:33-80` uses same-origin plus a request marker, a bounded JSON body, idempotency, a honeypot, and a database-backed rate-limit hash. `lib/job/http.ts:4-10` returns private/no-store/noindex headers.
- `lib/jackpot/http.ts:28-33` maps unknown errors to a generic response and logs only a server-side code; Job and Redeem responses similarly avoid returning stack traces.
- No tracked `.env` or hardcoded secret/token/password/API-key value was found. `.env.example` contains placeholders only; `.gitignore:8-10` ignores local env files.
- SQL calls inspected in the Neon modules use parameter placeholders. No `dangerouslySetInnerHTML` occurrence contains request/user input; current uses serialize application-owned structured data.
- Internal route metadata and headers provide noindex/no-store protection: `app/redeem/layout.tsx:4-8`, `app/anniversary-jackpot/layout.tsx:5-9`, and `next.config.ts:65-86`.

No security fix, credential change, database change, or production configuration change was made.

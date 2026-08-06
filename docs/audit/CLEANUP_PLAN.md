# Mezzanail cleanup plan

This plan is intentionally not an implementation. It sequences future work after human review of the audit reports. No phase below was executed in this read-only audit.

## Phase 1 — Safe Cleanup

Only low-risk, directly verifiable work belongs here. Each item should be a small, separately reviewable change.

| Order | Action | Related issue | Gate / verification |
|---:|---|---|---|
| 1 | Confirm ownership of legacy Login/Rewards components, QA scripts, and tracked screenshots before touching them. | `UNUSED-001`–`UNUSED-005` | Owner approval, branch/tag search, docs/CI search; no deletion by assumption. |
| 2 | Remove `@next/third-parties` only if the zero-import result remains true. | `DEP-001`, `UNUSED-004` | `pnpm why`, clean frozen install, lint, typecheck, tests, build. |
| 3 | Decide a repository policy for generated visual captures. Add an ignore/output rule only after identifying canonical evidence; archive or remove files in a separate reviewed change. | `DEAD-003`, `UNUSED-005` | Every basename checked in Markdown/release history; docs preview and clean clone verified. |
| 4 | Document the supported Node/pnpm versions and decide the ESM/module contract. | `CFG-001` | Matrix run on selected Node LTS versions; all quality commands pass. |
| 5 | Correct stale documentation wording for `/slideshow` only if product owners confirm it is a real second display. | `DOMAIN-002` | Device inventory and screenshot comparison; display tests pass. |

Phase 1 must not remove `next-themes`, delete translations, alter member domains, or change redirects without the owner decisions listed in later gates.

## Phase 2 — Structure Cleanup

This phase changes organization and contracts but keeps the systems in the same repository/deployment until behavior is characterized.

| Order | Action | Related issue | Required verification |
|---:|---|---|---|
| 1 | Select one canonical redirect layer for `/rewards` and `/login`; keep a route/status regression test and delete the duplicate only after live host checks. | `ROUTE-001`, `DOMAIN-001` | `curl -I` on all supported hosts, query/trailing slash checks, test/build. |
| 2 | Centralize production URL construction through `lib/site.ts`; keep intentionally external service domains explicit and documented. | `DOMAIN-005` | `git grep` domain inventory, sitemap/robots/metadata/email/PDF snapshots, SEO checks. |
| 3 | Decide the canonical membership QR host and the gallery domain; update display JSON/labels atomically if approved. | `DOMAIN-003`, `DOMAIN-004` | Mobile QR scan, redirect chain, analytics/referrer review, content tests. |
| 4 | Split `app/globals.css` and internal CSS into scoped route/component layers; establish one token namespace and remove only proven-unused selectors. | `CSS-001`, `CSS-002`, `ARCH-003` | Visual regression for every route, focus/reduced-motion/a11y checks, build. |
| 5 | Extract UI/data/API boundaries from Jackpot, Job, Legal, TV, Promotion, Redeem, and PDF files. | `COMP-001`, architecture inventory | Add unit/route tests before each extraction; preserve API/error/audit behavior. |
| 6 | Standardize icon usage and decide whether a light-only app still needs `next-themes`. | `DEP-002`, `UNUSED-006` | Bundle comparison, hydration and light-mode tests, screenshot/a11y review. |
| 7 | Replace semicolon-splitting migration runners with a transactional/versioned migration process. | `DB-001` | Disposable-DB failure injection, rollback/retry test, schema verification. |
| 8 | Replace public/share and login process-local rate limits with a documented shared/edge policy. | `SEC-001`, `SEC-002` | Multi-instance load test, privacy review, abuse monitoring, staging verification. |
| 9 | Verify proxy header trust and design a report-only CSP for public/internal HTML. | `SEC-003`, `SEC-004` | Staging hostile-header tests, CSP reports, analytics/fonts/service-worker checks. |

## Phase 3 — System Separation

These are future architecture changes. They require an inventory and migration plan before any repository move.

| Order | Boundary | Related issue | Separation proposal and gate |
|---:|---|---|---|
| 1 | Redeem vs Anniversary Jackpot | `SEC-005`, `ARCH-001` | Separate cookies/secrets, staff credentials, environment scopes, and deployment ownership. First produce an endpoint authorization matrix and staging secret-rotation test. |
| 2 | TV Slide vs Slideshow | `DOMAIN-002`, `ARCH-004` | Choose one display contract or create a static display package/app. Migrate bookmarks/devices and service-worker caches before retiring a route. |
| 3 | Job application | `ARCH-002` | Consider an isolated PII/email/PDF service when volume/compliance justifies it. Preserve idempotency, audit hashes, retention, and private status behavior. |
| 4 | PDF generation | `ARCH-002` | Move asset-heavy PDF work to a shared internal package/worker only after output snapshots and failure/retry semantics are stable. |
| 5 | Shared database/client | `ARCH-002`, `DB-001` | Keep table ownership explicit; use separate credentials/roles or projects where operational risk requires it. Run migration and rollback rehearsals before moving tables. |
| 6 | Public website deployment | `ARCH-003`, `ARCH-002` | Keep public content/config independently deployable from staff/display systems while preserving canonical domains and shared typed contracts. |

## Release gates for every phase

1. Confirm the target checkout and branch are clean before editing.
2. Do not change production environment variables, database data, DNS, or hosting settings as part of cleanup.
3. Run `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
4. Exercise the affected route with a real browser/device where the report calls for it; include mobile, keyboard, focus, reduced-motion, and noindex checks where relevant.
5. Review `git diff --stat` and `git status --short`; unrelated business files must remain unchanged.
6. Use a separate commit/PR per phase or tightly bounded issue group. Do not remove a `Needs Manual Confirmation` candidate solely because it is not imported.

## Explicitly deferred

- No file deletion, dependency removal, refactor, CSS rewrite, migration change, auth change, domain change, deployment, commit, or push was performed.
- The next action is human review of the six audit reports, followed by an owner decision for the manual-confirmation candidates.

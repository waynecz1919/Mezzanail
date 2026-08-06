# Mezzanail main branch cleanup report

## Scope and method

- Repository: `waynecz1919/Mezzanail`
- Audited ref: `main` at `178ed50e15a90ac3352f674af62fe0f81beee32e` (2026-08-04)
- Audit checkout: `Mezzanail-main-audit` (an independent clean clone; the pre-existing dirty worktree was not modified)
- Audit date: 2026-08-06 (Asia/Kuala_Lumpur)
- Read-only work only. No business source, database, environment file, deployment setting, commit, push, or production action was changed.
- Evidence used: source inspection, `git grep`, import-graph tracing, route/build output, Git history, package-manager metadata, and read-only HTTP checks.

## Existing quality checks

| Command | Result | Evidence / note |
|---|---|---|
| `pnpm.cmd install --frozen-lockfile` | PASS | pnpm 11.16.0; lockfile remained unchanged; 409 packages installed. |
| `pnpm.cmd lint` | PASS | `eslint .`, exit 0. |
| `pnpm.cmd typecheck` | PASS | `tsc --noEmit`, exit 0. |
| `pnpm.cmd test` | PASS with warning | 66 passed, 0 failed. Node emitted `MODULE_TYPELESS_PACKAGE_JSON` while loading `lib/tv-slideshow.ts`; see `CFG-001`. |
| `pnpm.cmd build` | PASS | PDF/TV preparation and Next 16.2.10 Turbopack build completed; 34 routes generated. |

The passing checks do not prove production configuration, database migrations, provider credentials, or real staff authorization. Those remain outside a read-only local audit.

## Project baseline

- `package.json:5-16` contains the application, quality, migration, and asset scripts. The build runs both asset-preparation scripts before `next build` (`BUILD-001`).
- `pnpm-lock.yaml` is the only package-manager lockfile. There is no `package-lock.json`, `yarn.lock`, or `bun.lock`; no package-manager mixing was found.
- `pnpm-workspace.yaml` only configures build approvals for `sharp` and `unrs-resolver`; it does not declare multiple application packages.
- `tsconfig.json` is strict and uses bundler resolution. ESLint is a small Next core-web-vitals configuration. Node is `v24.18.0` in the audit shell, but the project does not declare a supported Node range.

## Summary table

Counts are issue records in this report set; a shared issue can be referenced by more than one report.

| Category | Confirmed Issues | Probable Issues | Risk |
|---|---:|---:|---|
| Configuration and dependencies | 2 | 1 | Low–Medium |
| Dead code and generated artifacts | 2 | 1 | Low–Medium |
| Routes and domains | 4 | 0 | Low–Medium |
| CSS and component structure | 3 | 0 | Medium |
| Security and authorization boundaries | 4 | 0 | Medium |
| Database/build deployment | 2 | 0 | Medium |
| Architecture boundary | 1 | 0 | Medium |
| **Unique issue records** | **18** | **2** | **Medium overall** |

Three additional records are deliberately marked **Needs Manual Confirmation** (`DEAD-002`, `DOMAIN-003`, `SEC-003`) and are excluded from the confirmed/probable totals.

## Issue records

### CFG-001 — Runtime/module contract is not declared

- **Risk:** Low
- **Status:** Probable
- **File path / location:** `package.json:1-4` (no `engines` or `type` field); warning observed when importing `lib/tv-slideshow.ts` during `pnpm test`.
- **Problem:** The codebase uses ESM syntax but does not state a Node version or package module mode. Node reparsed `lib/tv-slideshow.ts` as ESM and reported a performance warning.
- **Current impact:** A new Node/pnpm upgrade can change build or test behavior; the current test suite still passes.
- **Recommendation:** Choose and document the supported Node LTS range, then decide whether the package should explicitly declare ESM. Validate Next, migration scripts, and test runners before changing either field.
- **Safe to delete?:** Not applicable.
- **Delete-before verification:** Run install, lint, typecheck, test, build, and all migration dry-runs in CI on the selected Node versions.

### DEP-001 — `@next/third-parties` is declared but not imported

- **Risk:** Low
- **Status:** Confirmed
- **File path / location:** `package.json:21`; `git grep` found zero source imports outside the manifest/lockfile.
- **Problem:** The dependency has no current code consumer.
- **Current impact:** Extra install/lockfile surface and maintenance noise; no runtime impact was observed.
- **Recommendation:** Confirm no generated code, future branch, or deployment plugin expects it, then remove it in a separate dependency-only change.
- **Safe to delete?:** Yes, after verification.
- **Delete-before verification:** `git grep -n '@next/third-parties' -- ':!pnpm-lock.yaml'`, `pnpm why @next/third-parties`, full quality checks, and a production build.

### DEAD-001 — Legacy Login/Rewards UI remains after route migration

- **Risk:** Medium
- **Status:** Confirmed (orphaned in the current import graph; deletion needs manual confirmation)
- **File path / location:** `components/login-page.tsx:1-29`, `components/login-tools.tsx:1-13`, `components/rewards-site.tsx:1-139`; routes `app/login/page.tsx:1-6` and `app/rewards/page.tsx:1-6` now redirect.
- **Problem:** No app route imports `LoginPage` or `RewardsSite`; `LoginTools` is only imported by the orphan Login page. The files predate commit `1815568` (Redirect rewards to Member Center), while tests still read them in `tests/light-mode.test.mjs:25-31`.
- **Current impact:** Dead UI, stale Rewards/Login copy, and a test dependency make future cleanup ambiguous. Deleting the files without updating tests could fail CI, and an external deep link may still be relied on.
- **Recommendation:** Ask the owner whether the legacy UI is intentionally retained for rollback/reference. If not, remove the components, remove only obsolete light-mode assertions, and keep redirect regression coverage.
- **Safe to delete?:** No, not before manual confirmation and test/reference review.
- **Delete-before verification:** `git grep -n 'LoginPage\|RewardsSite\|login-tools\|rewards-site'`, review Git history and external links, update tests, then run all five quality commands.

### DEAD-002 — Standalone visual-QA scripts have no project entry point

- **Risk:** Low
- **Status:** Needs Manual Confirmation
- **File path / location:** `scripts/capture-homepage-visuals.mjs:20,234-315` writes `test-results`; `scripts/verify-light-mode.mjs:27-222` launches Chrome and checks forced-light behavior. Neither is referenced by `package.json` or current docs; both have historical commits (`77c82ae`, `fd36844`).
- **Problem:** These are useful ad-hoc QA tools, but they are not exposed through a script command and are not part of CI. They may be intentionally kept for local visual regression work.
- **Current impact:** Unclear ownership and a larger maintenance surface; no production runtime impact.
- **Recommendation:** Either document and expose them as explicit QA commands, or archive them after confirming the team no longer uses them.
- **Safe to delete?:** No; manual confirmation required.
- **Delete-before verification:** Search CI, issue/PR history, and design-QA documentation; run each script once against a local server if retained.

### DEAD-003 — Generated visual captures are tracked source artifacts

- **Risk:** Low
- **Status:** Confirmed
- **File path / location:** `scripts/capture-homepage-visuals.mjs:20,247-315` writes `test-results`; tracked examples include `test-results/homepage-desktop.png` (3,581,363 bytes), `homepage-tablet.png` (3,789,555 bytes), `homepage-mobile.png` (1,081,703 bytes), and `homepage-visual-metrics.json`. Root-level visual QA files such as `official-preview-desktop.png` (2,408,907 bytes) and `final-home-desktop.png` (1,933,754 bytes) have no source import references.
- **Problem:** `.gitignore:1-12` does not exclude `test-results`, so browser captures and design snapshots remain in the repository. Several root images are not imported by application code.
- **Current impact:** Repository clone size, review noise, and accidental distribution of obsolete visual references increase. These files are not part of the Next public asset contract when kept at repository root.
- **Recommendation:** Decide which images are canonical documentation assets. Move remaining QA output to CI artifacts or a dedicated docs location, add an appropriate ignore rule, and retain only referenced evidence.
- **Safe to delete?:** No, until design/documentation owners confirm they are not needed.
- **Delete-before verification:** `git grep -n` each basename, inspect Markdown links and release notes, then verify a clean build and docs preview.

### ROUTE-001 — Membership redirects are defined at two framework layers

- **Risk:** Medium
- **Status:** Confirmed
- **File path / location:** `next.config.ts:8-19` declares permanent `/rewards` and `/login` redirects; `app/rewards/page.tsx:1-6` and `app/login/page.tsx:1-6` call `permanentRedirect(MEMBER_CENTER_URL)`. `tests/membership-redirect.test.mjs:16-26` currently requires both.
- **Problem:** The same routes have both Next config and App Router redirect implementations.
- **Current impact:** Behavior is redundant and future destination changes can update one layer but not the other. It is not currently a loop, and the redirect tests pass.
- **Recommendation:** Pick one canonical redirect layer (prefer framework-level redirects for legacy URLs), retain a route-level regression test, and remove the duplicate after verifying deployed status codes.
- **Safe to delete?:** No, until the chosen layer is validated on the production host.
- **Delete-before verification:** Test `/rewards`, `/login`, query strings, trailing slashes, and both `www` and non-`www` hosts with `curl -I`; run the redirect test.

### ROUTE-002 — Slideshow documentation contradicts the shipped route

- **Risk:** Medium
- **Status:** Confirmed
- **File path / location:** `docs/tv-slideshow.md:3` says `/slideshow` is a permanent redirect; `app/slideshow/page.tsx:1-13` is a real independent component route. `tests/slideshow-display.test.mjs:44-48` explicitly asserts that no `/slideshow` → `/tv-slide` redirect exists.
- **Problem:** Documentation describes an earlier architecture that the current code and tests intentionally do not implement.
- **Current impact:** Operators may open the wrong display path or assume both routes share the same content, while both are publicly reachable (with noindex headers).
- **Recommendation:** Either update the docs to describe two display products or intentionally consolidate the routes and update tests/config together.
- **Safe to delete?:** No; the route may be used by existing displays.
- **Delete-before verification:** Inventory display devices/bookmarks, compare `/slideshow` and `/tv-slide` screenshots, then update docs and run display tests.

### CSS-001 — Global stylesheet is a high-density cross-system file

- **Risk:** Medium
- **Status:** Confirmed
- **File path / location:** `app/globals.css` (323 physical lines; PostCSS parse 324 including terminal blank line, 647 rules, 2,060 declarations, 23 media queries, 14 `!important`, 30 custom-property declarations).
- **Problem:** One global file contains public marketing, services, job-form, consent, membership, and shared layout rules. It mixes `--mn-*` tokens with aliases such as `--bg`, `--surface`, `--gold`, and many literal colors.
- **Current impact:** Selector ordering and global changes can affect unrelated systems; unused legacy Rewards selectors (`.rewards-footer` at lines 292-303) remain plausible after route migration.
- **Recommendation:** Inventory selectors by route, establish one token namespace, and move internal-system rules into route/component scopes before removing any selector.
- **Safe to delete?:** No.
- **Delete-before verification:** CSS usage search, route screenshot comparison, keyboard/focus checks, reduced-motion checks, and a full build.

### CSS-002 — Internal CSS relies on `body:has()` and duplicated override rules

- **Risk:** Medium
- **Status:** Confirmed
- **File path / location:** `app/anniversary-jackpot/jackpot.css:16-17,60` contains six `:has()` selectors and six `!important` declarations; `app/redeem/redeem.css:2` contains one `body:has()` selector and three `!important` declarations. `app/globals.css:13,52,143,162,228` contains the remaining 14 global `!important` uses.
- **Problem:** Page state is selected through global body ancestry rather than component scope, and Jackpot imports Redeem CSS through `app/anniversary-jackpot/layout.tsx:2`.
- **Current impact:** Shared layout/class changes can leak between Redeem and Jackpot; override order is harder to reason about in split-screen, embedded, or future streaming layouts.
- **Recommendation:** Replace body-state selectors with route-root classes or CSS Modules, then reduce `!important` to accessibility and deliberate override cases only.
- **Safe to delete?:** No.
- **Delete-before verification:** Compare authenticated/unauthenticated Redeem and Jackpot pages at mobile/desktop widths, test login error states, and run visual regression.

### COMP-001 — Several UI components exceed practical single-responsibility size

- **Risk:** Medium
- **Status:** Confirmed
- **File path / location:** `components/jackpot/jackpot-console.tsx:1-930`; `components/job/job-application-experience.tsx:1-905`; `components/legal-document.tsx:1-812`; `components/tv/tv-slideshow.tsx:1-605`; `components/promotion/promotion-experience.tsx:1-481`; `components/redeem/redeem-center.tsx:1-416`.
- **Problem:** These files combine state, API calls, validation/feedback, presentation, translations/content, and interaction orchestration. For example, Jackpot console owns participant import, draw/prize management, CSV handling, and UI; the job experience owns draft persistence, validation, submission, PDF retry, and analytics.
- **Current impact:** High change risk and limited test isolation; a visual change can accidentally alter data flow or security-sensitive actions.
- **Recommendation:** Split by feature boundary: hooks/API clients, typed view models, form/preview panels, and presentation components. Preserve current route-level contracts first.
- **Safe to delete?:** No; split only after behavior characterization.
- **Delete-before verification:** Add component/route tests around each extracted boundary, then run lint, typecheck, test, build, and authenticated manual flows.

### DEP-002 — Two icon libraries remain in active use

- **Risk:** Low
- **Status:** Confirmed
- **File path / location:** `@tabler/icons-react` is used in `components/home/GoogleReviewsPreview.tsx:4` and `components/slideshow/mezzanail-slideshow.tsx:12`; `lucide-react` is used in 21 source files, including `app/not-found.tsx:2` and `components/home/GoogleReviewsPreview.tsx:3`.
- **Problem:** The repository carries two overlapping icon systems.
- **Current impact:** More bundle/install surface and inconsistent icon sizing/stroke conventions; not a current correctness issue.
- **Recommendation:** Standardize new work on one library, then migrate the small Tabler surface only if visual parity is acceptable.
- **Safe to delete?:** No, not until all Tabler imports and snapshots are gone.
- **Delete-before verification:** `git grep -n '@tabler/icons-react'`, compare rendered icons at target breakpoints, then run the full checks and bundle review.

### DB-001 — Migration runners execute statements without an explicit transaction

- **Risk:** Medium
- **Status:** Confirmed
- **File path / location:** `scripts/migrate-redeem.mjs:15-21`, `scripts/migrate-job.mjs:15-21`, and `scripts/migrate-jackpot.mjs:15-22` split SQL on semicolons and execute each statement sequentially.
- **Problem:** A network or SQL failure after an earlier statement can leave a partially applied migration. Current SQL uses idempotent `IF NOT EXISTS` constructs, but the runner itself does not provide atomicity.
- **Current impact:** Manual recovery may be needed during deployment, especially for Jackpot's multi-table schema.
- **Recommendation:** Use a migration tool or an explicit transaction where Neon supports it, and add a migration version/lock protocol. Do not change the live database as part of this audit.
- **Safe to delete?:** Not applicable.
- **Delete-before verification:** Test a failure injection against a disposable database, rerun the migration, and verify schema plus rollback semantics.

### BUILD-001 — Every production build mutates generated assets

- **Risk:** Low–Medium
- **Status:** Confirmed
- **File path / location:** `package.json:7` runs `scripts/prepare-pdf-assets.mjs` and `scripts/prepare-tv-assets.mjs` before `next build`; outputs are written under `public/pdf-assets` and `public/tv`.
- **Problem:** Build is not purely compile-only; it depends on source asset presence, font-copy paths, and Sharp image conversion.
- **Current impact:** CI/deployment can fail or produce a changed artifact when preparation inputs or dependency layout change. The audit build succeeded and left no tracked diff.
- **Recommendation:** Make preparation an explicit, cacheable asset step or verify its outputs before build. Keep the current order until deployment behavior is characterized.
- **Safe to delete?:** No.
- **Delete-before verification:** Run a clean checkout build with an empty output directory, inspect generated asset checksums, and test the deployment cache path.

## Positive findings / not confirmed

- No `.env`, `.env.local`, or tracked secret/token/password was found; only `.env.example` is tracked and local env files are ignored (`.gitignore:8-10`).
- API route inspection found staff/session checks on Redeem and Jackpot endpoints and same-origin/CSRF checks on job mutation routes. SQL calls use parameter placeholders in inspected database modules.
- Cookies in `lib/redeem/auth.ts:70-95` use `httpOnly`, `sameSite="strict"`, and production `secure`; internal pages and APIs emit no-store/noindex headers.
- No `dangerouslySetInnerHTML` with user-controlled content was found. The four uses serialize structured JSON-LD (`app/layout.tsx:65`, `app/job/page.tsx:81`, `app/promotion/page.tsx:66`, `app/services/page.tsx:45`).
- No package-manager mixing, redirect loop, or failing local quality command was observed.

## Recommended review order

1. Confirm legacy UI/scripts/artifact ownership (`DEAD-001`–`DEAD-003`).
2. Decide the canonical redirect and display-route contracts (`ROUTE-001`, `ROUTE-002`).
3. Handle the low-risk dependency and package/runtime hygiene (`DEP-001`, `CFG-001`, `DEP-002`).
4. Plan, but do not casually implement, CSS/component decomposition and auth/database boundary work (`CSS-001`, `CSS-002`, `COMP-001`, `DB-001`).

All recommendations are deferred pending human review. No cleanup was performed by this audit.

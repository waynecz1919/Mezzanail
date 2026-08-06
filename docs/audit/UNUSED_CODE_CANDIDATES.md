# Unused-code and obsolete-asset candidates

This is a candidate list, not a deletion list. A file is called orphaned only when route imports, source imports, package scripts, tests, and Git history were checked. A candidate still requires an owner decision before removal.

## Evidence method

1. Enumerated App Router pages and API routes from `app/`.
2. Ran `git grep` for direct imports, symbol names, class names, script names, and asset basenames.
3. Checked `package.json`, documentation, tests, and `git log` for non-code entry points.
4. Distinguished a dead application import from a test fixture, a generated artifact, or a manually invoked QA tool.

## Candidate matrix

| Candidate | Evidence | Status | Risk | Safe deletion now? |
|---|---|---|---|---|
| `components/login-page.tsx` | No app import; route redirects | Confirmed orphan / manual deletion decision | Medium | No |
| `components/login-tools.tsx` | Only imported by orphan Login page; read by light-mode test | Confirmed orphan / manual deletion decision | Medium | No |
| `components/rewards-site.tsx` | No app import; route redirects; read by light-mode test | Confirmed orphan / manual deletion decision | Medium | No |
| `lib/i18n.ts` Login/Rewards message branches | Provider is live, but `dict.login` and most Rewards-only copy is consumed only by orphan UI | Probable stale content | Low–Medium | No |
| `scripts/capture-homepage-visuals.mjs` | No package script/CI entry; writes QA captures | Needs Manual Confirmation | Low | No |
| `scripts/verify-light-mode.mjs` | No package script/CI entry; historical QA tool | Needs Manual Confirmation | Low | No |
| `@next/third-parties` | Zero source imports outside manifest/lockfile | Confirmed unused dependency | Low | Yes after checks |
| Root visual QA PNGs | No source imports for most `final-*`, `preview-*`, `official-preview-*`, and `qa-*` files | Needs Manual Confirmation | Low | No |
| `test-results/*` captures | Written by capture script and tracked; no runtime import | Confirmed generated artifact | Low | No |
| `next-themes` | Imported by the live global Provider | Not unused | Medium if removed incorrectly | No |

## Detailed records

### UNUSED-001 — Legacy Login/Rewards component cluster

- **Issue ID:** UNUSED-001
- **Title:** Redirected member pages retain an unreferenced UI cluster
- **Risk:** Medium
- **Status:** Confirmed (orphaned in current source graph; Needs Manual Confirmation before deletion)
- **File path:** `components/login-page.tsx:1-29`, `components/login-tools.tsx:1-13`, `components/rewards-site.tsx:1-139`; redirect routes `app/login/page.tsx:1-6` and `app/rewards/page.tsx:1-6`.
- **Related code / history:** `tests/light-mode.test.mjs:25-31` reads the two component files as text. Git history shows these files in the pre-redirect UI commits, while commit `1815568` introduced the Member Center redirect.
- **Problem:** No active page imports the components. The route names remain for legacy redirect compatibility, not for rendering these components.
- **Current impact:** Dead JSX, obsolete login/rewards copy, and a misleading impression that a local member experience still exists.
- **Recommendation:** Confirm no rollback branch, design reference, or external deep link depends on the components. If unused, update the light-mode test to cover only live controls, then remove the cluster in a dedicated cleanup PR.
- **Safe to delete?:** No.
- **Delete-before verification:** Search all branches/tags and docs, inspect deployment history after `1815568`, update tests, run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

### UNUSED-002 — Login/Rewards translation branches may be stale

- **Issue ID:** UNUSED-002
- **Title:** `lib/i18n.ts` retains copy for the removed local member UI
- **Risk:** Low–Medium
- **Status:** Probable
- **File path:** `lib/i18n.ts:9-62` (Login and Rewards sections); consumer `components/providers.tsx:3-5,16-52`; active consumers also use the shared locale context for the official site and analytics.
- **Problem:** The provider and locale storage are live, so `lib/i18n.ts` cannot be removed wholesale. However, `dict.login` and much of the Rewards-only copy are referenced only from the orphan components.
- **Current impact:** Translation maintenance can update strings that no route displays; deleting the entire module would break live language selection.
- **Recommendation:** Trace individual keys after the legacy component decision. Keep shared locale primitives and remove only proven-unreachable message branches.
- **Safe to delete?:** No.
- **Delete-before verification:** `git grep -n 'dict\.login\|dict\.rewards\|dict\.nav'`, run route-level language checks, and confirm analytics language behavior.

### UNUSED-003 — Standalone visual-QA scripts

- **Issue ID:** UNUSED-003
- **Title:** Manual browser capture scripts are not wired into project scripts
- **Risk:** Low
- **Status:** Needs Manual Confirmation
- **File path:** `scripts/capture-homepage-visuals.mjs:20,234-315`; `scripts/verify-light-mode.mjs:27-222`.
- **Problem:** Both scripts are executable utilities but have no `package.json` command, CI reference, or current documentation entry. Their Git history (`77c82ae`, `fd36844`) indicates they were used during visual/light-mode work.
- **Current impact:** They may be useful locally but are invisible to new maintainers; `capture-homepage-visuals` writes a repository-level `test-results` directory.
- **Recommendation:** Either add documented QA commands and ignore/output policy, or archive after owner confirmation.
- **Safe to delete?:** No.
- **Delete-before verification:** Search workflow files, issue/PR descriptions, and design-QA notes; run each against a local server if retained.

### UNUSED-004 — `@next/third-parties`

- **Issue ID:** UNUSED-004
- **Title:** Dependency has no source consumer
- **Risk:** Low
- **Status:** Confirmed
- **File path:** `package.json:21`; no non-lockfile source match.
- **Problem:** The package is installed but does not participate in the current app.
- **Current impact:** Extra dependency graph and lockfile maintenance.
- **Recommendation:** Remove only in a dependency-only change after checking `pnpm why` and CI/build plugins.
- **Safe to delete?:** Yes, after verification.
- **Delete-before verification:** `git grep`, `pnpm why`, clean install, full quality checks, and production build.

### UNUSED-005 — Tracked generated screenshots and metrics

- **Issue ID:** UNUSED-005
- **Title:** QA output is committed alongside application source
- **Risk:** Low
- **Status:** Confirmed (generated files); retention is Needs Manual Confirmation
- **File path:** `test-results/homepage-desktop.png`, `homepage-tablet.png`, `homepage-mobile.png`, `homepage-studio-comparison.png`, `homepage-studio-section.png`, `homepage-mobile-bottom-check.png`, and `homepage-visual-metrics.json`; generator `scripts/capture-homepage-visuals.mjs:20,247-315`.
- **Problem:** These are produced by a browser capture utility and are tracked because `.gitignore:1-12` has no `test-results` rule. Root-level visual files such as `official-preview-desktop.png`, `final-home-desktop.png`, and `qa-home-full-desktop.png` also have no source import matches.
- **Current impact:** Large clones and diffs, unclear canonical evidence, and a risk that a historical screenshot is mistaken for production artwork.
- **Recommendation:** Keep only explicitly referenced design evidence; move generated captures to CI artifacts or a versioned docs evidence directory and add an ignore policy.
- **Safe to delete?:** No.
- **Delete-before verification:** Search Markdown and release records for every basename, confirm design-owner retention, then verify docs links after relocation.

### UNUSED-006 — `next-themes` is a false positive

- **Issue ID:** UNUSED-006
- **Title:** Forced-light theme dependency is active but structurally simplifiable
- **Risk:** Medium if removed without replacement
- **Status:** Confirmed not unused
- **File path:** `components/providers.tsx:3,42-49`; `README.md:10` documents forced light mode; `tests/light-mode.test.mjs:7-23` protects it.
- **Problem:** `next-themes` is used only to force light mode (`defaultTheme`, `enableSystem={false}`, `forcedTheme="light"`). It is not dead, but its capability is broader than the current policy.
- **Current impact:** One global provider dependency and theme-storage cleanup are carried by every route.
- **Recommendation:** Treat removal as a Phase 2 design decision, not cleanup. A native light-only provider could replace it only after hydration and accessibility checks.
- **Safe to delete?:** No.
- **Delete-before verification:** Decide whether dark mode will ever return, replace the provider in a branch, then run light-mode, hydration, screenshot, and full quality checks.

## Dependency notes

- `lucide-react` is active in about 21 source files; `@tabler/icons-react` is active in two. This is duplication, not an unused-library finding.
- `framer-motion` remains active in `components/hyperframe/motion.tsx` and `components/official-site.tsx`; the orphan Rewards component is not its only consumer.
- `@expo-google-fonts/noto-sans-sc` is used by `scripts/prepare-pdf-assets.mjs:9`, `@neondatabase/serverless` by Jackpot/Job/Redeem DB modules and migration scripts, `pdfkit` by Job/Jackpot PDFs, `qrcode` by TV, and `sharp` by TV asset preparation. These are not deletion candidates.

No candidate in this document was removed or modified.

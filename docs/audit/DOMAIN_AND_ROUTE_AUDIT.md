# Domain and route audit

## Scope

This audit compares the shipped `main` route tree, redirect/header configuration, source-domain strings, robots/sitemap metadata, and read-only HTTP responses observed on 2026-08-06. No DNS, hosting, or redirect setting was changed.

## Route inventory

### Public website

`/`, `/about`, `/services`, `/contact`, `/promotion`, `/job`, `/privacy`, `/privacy/job-applicants`, `/terms`, `/membership/terms`, `/promotion/terms`, and `/cookies` are public pages. `app/layout.tsx:13-22` sets public index/follow metadata; `app/sitemap.ts:5-19` lists the intended public pages.

### Compatibility and member routes

`/rewards`, `/login`, `/vacancy`, and `/career` are compatibility routes. `next.config.ts:8-29` redirects them, while `/rewards` and `/login` also contain App Router redirects. The sitemap intentionally excludes `/rewards` and `/login` (`tests/membership-redirect.test.mjs:36-40`).

### Internal systems

- Redeem: `/redeem`, `/redeem/login`, `/api/redeem/*`
- Anniversary Jackpot: `/anniversary-jackpot`, `/anniversary-jackpot/login`, `/anniversary-jackpot/preview`, `/api/anniversary-jackpot/*`
- Job private success: `/job/application-received`, `/api/job/*`

`next.config.ts:65-86`, route layouts, and API response helpers apply private/no-store/noindex headers to these surfaces.

### Display systems

`/tv-slide` and `/slideshow` are both real routes. Both have noindex metadata/headers and are disallowed by `app/robots.ts:9-17`. They are separate implementations, not a current redirect pair.

## Domain inventory

| Domain/string | Code evidence | Read-only observation / assessment |
|---|---|---|
| `www.mezzanail.com` | `lib/site.ts:3`, `app/sitemap.ts:3`, Job/Promotion metadata and email templates | Canonical public site responds 200. Repeated literals remain outside shared config. |
| `member.mezzanail.com` | `public/data/slideshow.json:228,231` | Redirects to `/member-credits` on the member host; still live, but is not the configured canonical destination. |
| `credits.mezzanail.com` | `config/member-center.ts:1` | Current application redirect destination; responds 200 at `/member-credits`. |
| `redeem.mezzanail.com` | `proxy.ts:20`, `README.md:61` | Root responds with a noindex internal surface. |
| `appointment.mezzanail.com` | No source occurrence | External system only; read-only check responded with noindex. |
| `team.mezzanail.com` | No source occurrence | External system only; read-only check responded with noindex. |
| `winnie.mezzanail.com` | No source occurrence | External system only; read-only check redirected to login/noindex. |
| `nstudio.mezzanail.com` | `public/data/slideshow.json:9,249`, `docs/tv-slideshow.md:17` | Documentation explicitly says it did not resolve when prepared; currently a placeholder/intended gallery target. |

## Redirect and domain issue records

### DOMAIN-001 — Membership redirect logic is duplicated

- **Issue ID:** DOMAIN-001
- **Title:** `/rewards` and `/login` have two permanent redirect implementations
- **Risk:** Medium
- **Status:** Confirmed
- **File path:** `next.config.ts:8-19`; `app/rewards/page.tsx:1-6`; `app/login/page.tsx:1-6`; destination `config/member-center.ts:1`.
- **Related code / history:** Commit `1815568` introduced the Member Center redirect; `tests/membership-redirect.test.mjs:16-26` asserts both layers.
- **Problem:** A request may be handled at framework configuration or by rendering the route module, depending on runtime/path handling. Updating only one layer can produce inconsistent status codes or destinations.
- **Current impact:** Maintenance drift; no redirect loop was found in local build or read-only live checks.
- **Recommendation:** Choose the framework-level redirect as the single contract, retain one regression test for status/location, and remove the duplicate only in a reviewed change.
- **Safe to delete?:** No, until deployed responses and query/trailing-slash behavior are verified.
- **Delete-before verification:** `curl -I` both routes on `www` and apex hosts, with query strings and trailing slash, then run membership redirect tests.

### DOMAIN-002 — `/slideshow` documentation is stale relative to runtime

- **Issue ID:** DOMAIN-002
- **Title:** Docs call `/slideshow` a redirect while the code ships a second slideshow
- **Risk:** Medium
- **Status:** Confirmed
- **File path:** `docs/tv-slideshow.md:1-4`; `app/slideshow/page.tsx:1-13`; `components/slideshow/mezzanail-slideshow.tsx:1-170`; `app/tv-slide/page.tsx:1-27`.
- **Problem:** The docs say `/tv-slide` is production and `/slideshow` is a compatibility redirect, but the App Router renders a separate `MezzanailSlideshow`. Tests explicitly assert no redirect (`tests/slideshow-display.test.mjs:44-48`).
- **Current impact:** Operators can select different content/layouts without realizing it; fixes to one display do not automatically reach the other.
- **Recommendation:** Document two intentional display products, or consolidate them with an explicit redirect and a migration plan for display devices.
- **Safe to delete?:** No.
- **Delete-before verification:** Inventory bookmarks/devices, compare both rendered outputs, check service-worker behavior (`public/sw-tv-slide.js:108-113`), and obtain display-owner approval.

### DOMAIN-003 — Member QR target may be an old domain

- **Issue ID:** DOMAIN-003
- **Title:** TV content still points at `member.mezzanail.com` while app config points at Credits
- **Risk:** Medium
- **Status:** Needs Manual Confirmation
- **File path:** `config/member-center.ts:1` uses `https://credits.mezzanail.com/member-credits`; `public/data/slideshow.json:228,231` uses `https://member.mezzanail.com` and labels it `member.mezzanail.com`.
- **Problem:** The member host currently redirects to its own `/member-credits` path rather than the configured Credits host. Both can be live intentionally, but they are not one canonical URL.
- **Current impact:** QR scans incur an extra redirect and campaign analytics/referrer attribution can split across hosts.
- **Recommendation:** Ask the membership owner which host is canonical, then update the JSON and QR label together if needed. Do not infer that the old host is safe to remove from a single source occurrence.
- **Safe to delete?:** No.
- **Delete-before verification:** Verify live redirect chains, mobile QR scans, UTM/referrer behavior, and member-host ownership before changing the display data.

### DOMAIN-004 — `nstudio.mezzanail.com` is an unresolved gallery placeholder

- **Issue ID:** DOMAIN-004
- **Title:** TV configuration carries a not-yet-live gallery domain
- **Risk:** Low
- **Status:** Confirmed
- **File path:** `public/data/slideshow.json:9,249`; `docs/tv-slideshow.md:17`.
- **Problem:** The JSON preserves `galleryTargetUrl`/`intendedQrUrl` for `nstudio.mezzanail.com`, while the documentation says the domain did not resolve and the live slide falls back to Instagram.
- **Current impact:** A future content edit could accidentally publish a QR code to an unavailable host; the current fallback remains usable.
- **Recommendation:** Keep the intended value only if it is an approved future domain; otherwise remove it from shipped configuration and retain the fallback URL.
- **Safe to delete?:** No, until the gallery owner confirms the intended domain.
- **Delete-before verification:** Resolve the intended host, check HTTPS/canonical redirects, scan the QR on a real device, and update the content test.

### DOMAIN-005 — Production URL is not fully centralized

- **Issue ID:** DOMAIN-005
- **Title:** `www.mezzanail.com` is repeated in metadata, analytics, email, PDF, and sitemap code
- **Risk:** Low–Medium
- **Status:** Confirmed
- **File path:** `lib/site.ts:3` defines `siteUrl`, but literals remain in `app/sitemap.ts:3`, `app/job/page.tsx:12,16,50-51,73`, `app/privacy/job-applicants/page.tsx:8`, `app/promotion/page.tsx:56`, `components/job/job-application-experience.tsx:133`, `components/job/job-application-received.tsx:24`, `lib/job/pdf.ts:52`, `lib/promotion/campaign-config.ts:12`, `lib/promotion/share-message.ts:3`, and `lib/email/templates/job-application-email.ts:40,59`.
- **Problem:** `README.md:81-94` says external destinations live in `lib/site.ts`, but canonical URLs and telemetry labels bypass that config.
- **Current impact:** Domain migrations, preview environments, or canonical fixes require a multi-file search and can leave mixed links behind.
- **Recommendation:** Import `siteUrl` or derive route URLs from one config module; keep email/PDF output explicit only when a separate origin is intentional.
- **Safe to delete?:** Not applicable; this is a refactor candidate.
- **Delete-before verification:** `git grep` all production domains, snapshot generated metadata/email/PDF URLs, run SEO tests, and compare sitemap/robots output.

## Robots, indexing, and loops

- `app/robots.ts:4-21` allows the public site, disallows `/api/`, `/redeem/`, `/anniversary-jackpot/`, `/job/application-received`, `/login`, `/slideshow`, and `/tv-slide`, and points to `${siteUrl}/sitemap.xml`.
- `app/sitemap.ts:5-19` contains only public content routes and no internal/display routes. The sitemap base is hardcoded, which is covered by `DOMAIN-005`.
- Internal layouts (`app/redeem/layout.tsx:4-8`, `app/anniversary-jackpot/layout.tsx:5-9`) and API/private headers add noindex/no-store. Live read-only checks returned noindex for Redeem, TV, and Slideshow.
- No redirect cycle was observed among `/rewards`, `/login`, `/vacancy`, `/career`, or the `proxy.ts` host rewrites. The duplicate membership definitions are still a maintenance issue.

No domain, DNS, redirect, robots, or production configuration was changed during this audit.

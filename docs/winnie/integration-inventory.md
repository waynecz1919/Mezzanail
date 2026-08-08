# Winnie Integration Inventory

This inventory was prepared without calling or changing any production system.
Secret names are noted only where they explain an authentication boundary;
secret values are not included.

## Current repository

The Mezzanail website repository contains Winnie identity, RBAC, navigation,
placeholder module routes, and public links. It does not contain an internal
Appointment, Member Center, or Team Hub read client.

| Existing reference | Current purpose | Not a bridge interface |
| --- | --- | --- |
| `config/member-center.ts` | Canonical customer-facing Member Center URL | Yes; it is a browser destination only |
| `lib/site.ts` booking URL | Public Tunai booking link | Yes; it does not expose appointment records |
| `app/api/manager/modules/[module]` | Authenticated Winnie module metadata | Yes; it returns identity/permission metadata only |

## External system inventory

| System | Existing source of truth | Available interface observed | Current authentication boundary | Recommended future adapter |
| --- | --- | --- | --- | --- |
| Appointment System | Google Sheets through Google Apps Script | External Next.js `POST /api/gas` supports read actions including `getTodayAppointmentsFast`, `getTomorrowAppointmentsFast`, `getAppointmentById`, and appointment history. The same gateway also permits writes. | Staff session cookie plus a server-only Apps Script shared secret. Requests are `no-store`. | Phase 2C.1 should use a dedicated server-to-server, read-only interface or strict read-action adapter. Do not proxy the gateway's write actions and do not expose its staff session or shared secret to the browser. |
| Member / CRM | Member Center Cloudflare D1 data | Staff `GET /api/customers?q=...` returns customer and recent transaction data; customer `GET /api/member/me` returns the signed-in member dashboard. The old `/api/lookup` flow is retired. | Separate staff and member sessions. Staff reads require the Member Center session; customer reads require a member device session. | Phase 2C.2 should add a dedicated server-side member-summary endpoint with a read-only service scope. Winnie must not connect directly to Member Center D1 or reuse a customer's browser session. |
| Team Hub | Cloudflare Pages Functions with existing D1 snapshots and schedule data | Authenticated reads exist at `GET /api/appointments/today`, `GET /api/appointments/tomorrow`, and `GET /api/staff-schedule?start=...`. Internal appointment sync is a write-ingestion endpoint and is not a read adapter. | Signed Team Hub session derived from Google identity plus an explicit staff allowlist. Read responses are private and `no-store`. | Phase 2C.3 should use a dedicated server-to-server Team Hub read scope. Preserve Team Hub's D1 ownership and do not reuse its internal sync credential. |

## Google Sheets and derived data

- Google Sheets remains the Appointment System's authoritative source through
  its Apps Script layer.
- Team Hub already consumes derived appointment and staff-schedule data. Winnie
  must not create another writable schedule or appointment store.
- Member Center remains authoritative for member and credit data. Existing
  Team Hub member lookups do not transfer that ownership to Team Hub or Winnie.

## Adapter readiness

No upstream currently exposes the dedicated service-to-service read contract
needed by Winnie. Phase 2C.0 therefore registers only unconfigured adapters.
Creating or approving upstream read scopes belongs to the relevant future phase
and requires a separate review before any endpoint or secret is configured.

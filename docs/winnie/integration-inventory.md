# Winnie Integration Inventory

This inventory was prepared without calling or changing any production system.
Secret names are noted only where they explain an authentication boundary;
secret values are not included.

## Current repository

The Mezzanail website repository contains Winnie identity, RBAC, navigation,
the reviewed Appointment and Member Center read clients, placeholder module
routes, and public links. Team Hub remains a disconnected placeholder.

| Existing reference | Current purpose | Not a bridge interface |
| --- | --- | --- |
| `config/member-center.ts` | Canonical customer-facing Member Center URL | Yes; it is a browser destination only |
| `lib/site.ts` booking URL | Public Tunai booking link | Yes; it does not expose appointment records |
| `app/api/manager/modules/[module]` | Authenticated Winnie module metadata | Yes; it returns identity/permission metadata only |
| `app/api/manager/members/*` | Server-authorized Member Center read routes | No; these expose only the normalized read envelope to authorized Winnie users |

## External system inventory

| System | Existing source of truth | Available interface observed | Current authentication boundary | Recommended future adapter |
| --- | --- | --- | --- | --- |
| Appointment System | Google Sheets through Google Apps Script | Production exposes dedicated read-only `GET /api/integrations/winnie/appointments/today` and `GET /api/integrations/winnie/appointments/:id` routes. | Dedicated server-only Bearer credential. Staff sessions and the broad Apps Script secret remain inside the Appointment system. Responses are private and `no-store`. | Phase 2C.1B connects the server-only Winnie `AppointmentBridge` to these two fixed reads. No write route or arbitrary Apps Script action is exposed. |
| Member / CRM | Member Center Cloudflare D1 data | Production exposes four dedicated read-only routes under `https://member.mezzanail.com/api/integrations/winnie/members`: bounded search, customer ID, member number, and normalized phone lookup. | Winnie uses a server-only `WINNIE_MEMBER_READ_TOKEN`; Member Center sessions, staff cookies, member device sessions and D1 credentials never cross the boundary. | Phase 2C.2B connects the server-only Winnie `MemberBridge` with `customer_profile.view`. Credit, Family Sharing, discount tiers and mutation paths remain deferred. |
| Team Hub | Cloudflare Pages Functions with existing D1 snapshots and schedule data | Authenticated reads exist at `GET /api/appointments/today`, `GET /api/appointments/tomorrow`, and `GET /api/staff-schedule?start=...`. Internal appointment sync is a write-ingestion endpoint and is not a read adapter. | Signed Team Hub session derived from Google identity plus an explicit staff allowlist. Read responses are private and `no-store`. | Phase 2C.3 should use a dedicated server-to-server Team Hub read scope. Preserve Team Hub's D1 ownership and do not reuse its internal sync credential. |

## Google Sheets and derived data

- Google Sheets remains the Appointment System's authoritative source through
  its Apps Script layer.
- Team Hub already consumes derived appointment and staff-schedule data. Winnie
  must not create another writable schedule or appointment store.
- Member Center remains authoritative for member and credit data. Existing
  Team Hub member lookups do not transfer that ownership to Team Hub or Winnie.

## Adapter readiness

The Appointment source now exposes its approved service-to-service read contract.
Winnie selects the Production Appointment adapter only through server-side
configuration and returns `configuration_missing` when either value is absent.
The Member Center source now exposes its approved four-route read contract.
Winnie selects the Production Member adapter only through server-side
configuration and returns `configuration_missing` when either value is absent.
The Customer Profiles module is read-only and requires `customer_profile.view`.
Team Hub remains an unconfigured adapter until its own reviewed read scope is
available.

Appointment Production `/today` has returned HTTP 200 with a valid service
credential, including a legitimate empty day. Valid-ID runtime verification is
still pending because that response contained no appointment IDs. The by-ID
adapter contract is therefore mock-tested without inventing Production data.

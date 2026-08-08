# Winnie Member / CRM Read Bridge

## Purpose and ownership

Winnie reads authoritative member profile data from the Member Center through
the dedicated Production read service. Member Center remains the owner of its
customers and D1 data. Winnie does not connect directly to D1, reuse a browser
session, store a member copy, or expose any write operation.

```text
Winnie server
  -> MEMBER_READ_API_URL
  -> Authorization: Bearer WINNIE_MEMBER_READ_TOKEN
Member Center read service
  -> Member Center D1 customers.id
```

Both configuration values are server-only. The token must not appear in a
client component, browser bundle, HTML, log, or response.

## Fixed read contract

The adapter exposes exactly these methods:

- `searchMembers(query, limit?)` -> `GET {MEMBER_READ_API_URL}/search?q=...&limit=...`
- `getMemberSummary(customerId)` -> `GET {MEMBER_READ_API_URL}/{customerId}`
- `getMemberByMemberNo(memberNo)` -> `GET {MEMBER_READ_API_URL}/by-member-no/{memberNo}`
- `getMemberByPhone(normalizedPhone)` -> `GET {MEMBER_READ_API_URL}/by-phone/{normalizedPhone}`

All requests are GET-only, use a bounded 10-second timeout, reject redirects,
use `cache: no-store`, and make one request without retries. The caller cannot
choose an upstream URL or action name.

## Authorization boundary

The Winnie route and bridge query both require `customer_profile.view`.
Permission denial returns `permission_denied` before any upstream request is
made. ADMIN, MANAGER and COUNTER retain their existing permission mapping;
STAFF is not granted access automatically. Winnie session cookies and all
Member Center staff/member cookies remain separate.

## Field mapping

| Member Center field | Winnie field | Rule |
| --- | --- | --- |
| `customers.id` | `customerId` | Canonical numeric identity; never replaced by name or phone |
| `memberNo` | `memberNo` | Preserved when present |
| `name` | `name` | Source value only |
| `phone` | `phone` | Preserved when present; only visible behind `customer_profile.view` |
| `normalizedPhone` | `normalizedPhone` | Validated source value |
| `status` | `status` | Restricted to the controlled Winnie status set |
| `tier` | `sourceTier` | Reference-only source metadata; never a discount label |
| `birthMonth` | `birthMonth` | Month only; no day, year or age is inferred |
| `sourceSystem` | `sourceSystem` | Source metadata |
| `syncedAt` | `syncedAt` | Source record freshness metadata |

`memberDiscountRate` is always `null` in this phase. The current D1 `tier` is
not proven to mean Gold, Platinum, Royal VIP, 15%, 20% or 25%, so no discount
is calculated or shown. Legacy CSV and 907-member enrichment belong to a
separate Phase 2C.2C review.

## Search and phone handling

Search is explicit and bounded to 20 results. The UI does not call the
upstream on every keystroke and never offers a download-all operation. Search
supports name, member number, customer ID and phone-like input.

Malaysian phone input is normalized only for lookup. Common forms such as
`0123456789`, `60123456789` and `+60123456789` become the normalized lookup
value; the authoritative stored phone is never changed. Ambiguous input is
not guessed.

## Freshness and result states

Every bridge result includes `source`, `fetchedAt` (Winnie fetch time) and
`isStale`. A source `syncedAt` older than 15 minutes marks the result as
`stale_data`. Missing `syncedAt` is retained as unavailable metadata rather
than guessed.

The adapter maps failures without leaking upstream details:

- missing URL/token -> `configuration_missing`
- upstream 401/403 -> `configuration_missing`
- upstream 400/404 -> `no_data`
- upstream 429, 5xx, timeout or malformed JSON -> `upstream_unavailable`

## UI boundary

Customer Profiles provides search and a read-only profile view for approved
users. It shows identity, status, phone, supported birth month and source
metadata. ADMIN may see `customerId` and the explicit source tier reference;
COUNTER sees Member No as the primary operational identifier.

The UI does not show or call Credit balances, transactions, Family Sharing,
discount assignment, edit/delete controls, tier changes, refunds, top-ups or
member writes. Appointment-to-CRM identity linking remains deferred because
Appointment currently does not provide a reliable customer identity.

# Winnie Module Bridge Foundation

Phase 2C.0 establishes a read-only integration boundary. It does not connect
live data, add credentials, move business logic, or create a second source of
truth.

```text
Appointment System   Member / CRM   Team Hub
          \               |               /
                 Module bridges
                       |
          Normalized Winnie contracts
                       |
              Winnie AI Manager
```

## Ownership boundary

- Appointment records remain authoritative in the Appointment System.
- Member and credit records remain authoritative in Member Center.
- Team and schedule records remain authoritative in Team Hub and its existing
  upstream schedule source.
- Winnie may request and normalize read data in future phases. It does not own
  or mutate those records.
- Business credentials and upstream endpoints must stay in server-only modules
  and deployment secret stores.

## Foundation layout

`lib/winnie/bridges/` contains:

- common result, freshness, and safe error contracts;
- normalized Appointment, Member, and Team Hub data contracts;
- read-only bridge interfaces;
- reviewed adapters with safe `configuration_missing` fallbacks;
- a server-only registry;
- permission-gated server query functions.

The registry keeps upstream URLs and service credentials in server-only
deployment configuration. The Appointment and Member bridges now use their
reviewed read-only service contracts; Team Hub remains unconfigured until its
own read scope is approved. Missing configuration fails closed without
exposing upstream details.

## Access boundary

Every bridge read goes through `runAuthorizedBridgeRead`. It evaluates the
existing Winnie session permissions before invoking an adapter and converts an
unexpected adapter exception into a safe `upstream_unavailable` result.

| Bridge read | Required permission |
| --- | --- |
| Appointment reads | `appointments.view` |
| Member / CRM reads | `customer_profile.view` |
| Team status | `team_hub.view` |

UI visibility is not an authorization control. Future API routes and server
components must call the permission-gated query functions rather than the
registry or an adapter directly.

## Result and freshness contract

Every result reports `source`, `fetchedAt`, and `isStale`, and uses one of these
statuses:

- `success`
- `no_data`
- `permission_denied`
- `upstream_unavailable`
- `stale_data`
- `configuration_missing`

Staff-facing results use fixed safe messages. Raw upstream exceptions and
credentials are never part of the result contract.

## Deferred phases

1. **Phase 2C.1 — Appointment Read Bridge**
2. **Phase 2C.2 — Member / CRM Read Bridge** (implemented as a read-only
   Member Center adapter)
3. **Phase 2C.3 — Team Hub Read Bridge**
4. **Phase 2C.4 — Cross-module Dashboard Aggregation**

Write operations remain explicitly deferred. This foundation does not expose
appointment creation or updates, credit changes, transaction deletion, schedule
changes, WhatsApp sending, or Family Sharing approval.

See [integration-inventory.md](./integration-inventory.md) for the audited
upstream interfaces and recommended future adapters.

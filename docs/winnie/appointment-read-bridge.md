# Winnie Appointment Read Bridge

## Purpose and ownership

Winnie reads current Appointment information from the Production Appointment Read Service at the server boundary. Google Sheets and Apps Script remain owned by the Appointment System; Winnie does not store, mutate, or become authoritative for appointments.

The Production source contract is:

```text
Winnie server
  -> APPOINTMENT_READ_API_URL
  -> Authorization: Bearer WINNIE_APPOINTMENT_READ_TOKEN
Appointment read service
  -> existing Appointment-owned Apps Script integration
```

Both Winnie configuration values are server-only. The token must never appear in a client component, browser response, log, document, or source file.

## Read-only methods

The `AppointmentBridge` exposes exactly:

- `getTodayAppointments()` -> `GET {APPOINTMENT_READ_API_URL}/today`
- `getAppointmentSummary(id)` -> `GET {APPOINTMENT_READ_API_URL}/{encoded id}`

There is no arbitrary route/action input and no method for create, edit, check-in, reschedule, cancel, delete, reminder sending, staff updates, or Sheet writes.

Every Winnie call passes through the existing server-side `appointments.view` guard before the adapter runs. UI visibility is not the authorization control. A denied read returns `permission_denied` without making an upstream request.

## Normalization

| Appointment source | Winnie field | Rule |
| --- | --- | --- |
| `appointmentId` | `id` | Required stable Appointment ID |
| `customerId` | `customerId` | Preserved only when supplied; otherwise `null` |
| `customerName` | `customerName` | Preserved; not used as identity |
| `date` + `time` | `startAt` | Parsed as salon-local time and emitted as an ISO instant |
| `endTime` | `endAt` | Parsed as salon-local time; valid `duration` is a fallback |
| `service` / `services` | `serviceName` | Source values only |
| `staffId` | `staffId` | Empty values become `null` |
| no approved mapping | `staffName` | Always `null` in this phase |
| `status` | status fields | Controlled mapping below |
| `reminderState` | `reminderStatus` | Controlled mapping below |

`phoneLast4` is not expanded or used to build a phone number. Winnie never constructs `customerId` from the customer name or phone last-four digits.

## Timezone and freshness

The salon timezone is `Asia/Kuala_Lumpur` (UTC+08:00). `date`, `time`, `endTime`, and upstream `generatedAt` are parsed explicitly as Kuala Lumpur local values. Browser timezone is never used for normalization.

The stale threshold is five minutes. A valid upstream `generatedAt` becomes `fetchedAt`; otherwise Winnie uses the server receipt time. Data older than five minutes returns `stale_data` with `isStale: true`. A current successful empty response returns `no_data`, which the Dashboard displays as `0`, not as an error or disconnected source.

## Status mapping

| Upstream | Winnie status | Confirmation |
| --- | --- | --- |
| `Pending` | `scheduled` | `pending` |
| `Reminder Due` | `scheduled` | `pending` |
| `Reminder Sent` | `scheduled` | `pending` |
| `Confirmed` | `confirmed` | `confirmed` |
| `Reschedule Requested` | `scheduled` | `pending` |
| `Completed` | `completed` | `not_required` |
| `Cancelled` | `cancelled` | `declined` |
| `No Show` | `no_show` | `not_required` |
| Any other value | `unknown` | `unknown` |

Known reminder states map only to `not_due`, `pending`, `sent`, `failed`, or `opted_out`; unfamiliar values map to `unknown`. Raw source strings do not drive UI behavior.

## Failure contract

- missing URL/token -> `configuration_missing`
- upstream 401/403 -> `configuration_missing` without credential details
- appointment 400/404 -> `no_data`
- timeout, 5xx, redirect, malformed/non-JSON, wrong timezone, or invalid payload -> `upstream_unavailable`

Requests use `GET`, `cache: no-store`, a 10-second timeout, no retry, and redirect rejection so the Bearer credential is not forwarded to another host. Staff UI receives only controlled bridge results.

## Production verification status

- Production `/today` has been verified with the valid service credential and returned HTTP 200.
- A successful empty array is a legitimate Production response.
- Valid-ID Production verification remains pending because the verified day had no appointment IDs.
- The by-ID contract is covered with mocked adapter tests; no Production ID is fabricated for testing.

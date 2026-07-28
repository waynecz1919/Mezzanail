# Mezzanail 7th Anniversary Jackpot Draw

Internal route: `/anniversary-jackpot`

This module reuses the existing Mezzanail staff credentials, signed session cookie,
Neon PostgreSQL database, Next.js application, brand system, and Vercel environment.
It is private, no-index, and never exposes a full phone number in the live or winner views.

## One-time setup

1. Back up the database.
2. Run `pnpm db:migrate:jackpot` against the intended Preview database first.
3. Generate or update staff credentials with a role:
   - `node scripts/generate-redeem-staff.mjs owner-name owner`
   - `node scripts/generate-redeem-staff.mjs admin-name admin`
   - `node scripts/generate-redeem-staff.mjs staff-name staff`
4. Merge the generated entry into `REDEEM_STAFF_USERS`.
5. Sign in at `/anniversary-jackpot/login`.

Existing credentials without a role remain valid as `staff` and have view-only access.

## Participant import

Use `docs/anniversary-jackpot-participants-template.csv`.

Required practical fields:

- Customer Name
- Phone Number
- Draw Tickets

Recommended fields:

- Entry ID
- Member ID
- Eligibility Status
- Source
- Created At

Local Malaysian numbers are normalized to the `60…` format. Invalid numbers and ticket
counts are rejected. Duplicate Member IDs are consolidated into one participant and their
ticket counts are added.

The “Import Campaign DB” action expects a compatible `promotion_entries` table containing:

`entry_id`, `member_id`, `customer_name`, `phone_number`, `draw_tickets`,
`eligibility_status`, `source`, and `created_at`.

If that table does not exist, export the approved final list as CSV and use CSV import.

## Live operating sequence

1. Import and review the final participant list.
2. Confirm customer, ticket, duplicate, invalid-phone and ineligible totals.
3. Configure ordinary prizes in draw order.
4. Add exactly one Jackpot prize with quantity `1` and the final draw order.
5. Confirm the global “Allow Multiple Wins” rule. It defaults to off.
6. Select **Lock Participant List**.
7. Open **Live Draw** and choose **Full Screen**.
8. Press **SPIN** once. The server creates and records the result before animation begins.
9. Locate the customer using only the masked information shown on screen.
10. Select **Confirm Winner**, **Unable to Reach**, or **Redraw with Reason**.
11. Do not proceed to the next draw until the current winner is confirmed or voided.
12. After the final Jackpot, export CSV and PDF and print the winner list.

## Security and fairness

- The browser never decides the winner.
- `crypto.randomInt` selects a ticket ordinal from the server-calculated eligible pool.
- A participant with three tickets occupies three equal ticket positions.
- A database advisory lock, idempotent request UUID, unique request constraint, unique
  draw sequence and one-open-draw constraint prevent duplicate results.
- Confirmation is a guarded atomic update that decrements prize quantity once.
- Redraw changes the original record to `voided`; it never deletes draw history.
- Jackpot is restricted to one unit, the final order, and cannot run while an earlier prize
  remains.
- Every administrative action is written to `jackpot_audit_log`.

## Final venue checklist

- Use the actual event laptop, TV/projector, browser and HDMI adapter.
- Confirm a stable network and a backup hotspot.
- Disable device sleep, notifications and browser password prompts.
- Test 100%, 125% and full-screen display scaling.
- Run a rehearsal using a Preview database and sample participants.
- Test simultaneous SPIN clicks from two admin sessions.
- Test Confirm, Unable to Reach, ordinary Redraw and Jackpot double confirmation.
- Export and open both CSV and PDF.
- Confirm the live screen shows only phone last four digits.
- Keep a printed eligible list and manual incident log as an operational fallback.

Do not run the migration on Production or deploy this module until the Preview rehearsal
and final prize list have been approved.

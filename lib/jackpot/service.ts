import "server-only";

import {
  createResultToken,
  maskMemberId,
  secureTicketOrdinal,
} from "@/lib/jackpot/core";
import {
  getJackpotDb,
  JACKPOT_CAMPAIGN_SLUG,
} from "@/lib/jackpot/db";
import type {
  JackpotAudit,
  JackpotCampaign,
  JackpotDraw,
  JackpotParticipant,
  JackpotPrize,
  JackpotState,
  WinnerResult,
} from "@/lib/jackpot/types";
import type { StaffSession } from "@/lib/redeem/auth";

type QueryRow = Record<string, unknown>;

export async function getCampaign() {
  const sql = getJackpotDb();
  const rows = await sql.query(
    "SELECT * FROM jackpot_campaigns WHERE slug = $1 LIMIT 1",
    [JACKPOT_CAMPAIGN_SLUG],
  ) as JackpotCampaign[];
  if (!rows[0]) throw new Error("JACKPOT_CAMPAIGN_NOT_INITIALIZED");
  return rows[0];
}

function mapDraw(row: QueryRow): JackpotDraw {
  return {
    id: String(row.id),
    prize_id: String(row.prize_id),
    participant_id: String(row.participant_id),
    request_id: String(row.request_id),
    draw_sequence: Number(row.draw_sequence),
    status: row.status as JackpotDraw["status"],
    drawn_at: String(row.drawn_at),
    drawn_by: String(row.drawn_by),
    confirmed_at: row.confirmed_at ? String(row.confirmed_at) : null,
    confirmed_by: row.confirmed_by ? String(row.confirmed_by) : null,
    void_reason: row.void_reason ? String(row.void_reason) : null,
    prize_name: String(row.prize_name),
    is_jackpot: Boolean(row.is_jackpot),
    customer_name: String(row.customer_name),
    member_id_masked: maskMemberId(row.member_id ? String(row.member_id) : null),
    phone_last4: String(row.phone_last4),
  };
}

export async function loadJackpotState(session: StaffSession): Promise<JackpotState> {
  const sql = getJackpotDb();
  const campaign = await getCampaign();
  const [participants, prizes, drawRows, audit, summaryRows] = await Promise.all([
    sql.query(
      `SELECT id, entry_id, member_id, customer_name, phone_last4, ticket_count,
              eligible, eligibility_status, source, created_at
         FROM jackpot_participants
        WHERE campaign_id = $1
        ORDER BY customer_name, id`,
      [campaign.id],
    ) as unknown as Promise<JackpotParticipant[]>,
    sql.query(
      `SELECT id, prize_name, prize_description, prize_image_url, quantity,
              remaining_quantity, draw_order, is_jackpot, allow_previous_winner, status
         FROM jackpot_prizes
        WHERE campaign_id = $1
        ORDER BY draw_order`,
      [campaign.id],
    ) as unknown as Promise<JackpotPrize[]>,
    sql.query(
      `SELECT d.*, pr.prize_name, pr.is_jackpot,
              pa.customer_name, pa.member_id, pa.phone_last4
         FROM jackpot_draws d
         JOIN jackpot_prizes pr ON pr.id = d.prize_id
         JOIN jackpot_participants pa ON pa.id = d.participant_id
        WHERE d.campaign_id = $1
        ORDER BY d.drawn_at DESC`,
      [campaign.id],
    ) as unknown as Promise<QueryRow[]>,
    session.role === "staff"
      ? Promise.resolve([] as JackpotAudit[])
      : sql.query(
        `SELECT id, action, entity_type, entity_id, performed_by, created_at, reason
           FROM jackpot_audit_log
          WHERE campaign_id = $1
          ORDER BY created_at DESC
          LIMIT 300`,
        [campaign.id],
      ) as unknown as Promise<JackpotAudit[]>,
    sql.query(
      `SELECT COUNT(*)::int AS total_participants,
              COUNT(*) FILTER (WHERE eligible)::int AS eligible_participants,
              COALESCE(SUM(ticket_count), 0)::int AS total_tickets,
              COALESCE(SUM(ticket_count) FILTER (
                WHERE eligible
                  AND (
                    $2::boolean = TRUE
                    OR NOT EXISTS (
                      SELECT 1 FROM jackpot_draws d
                       WHERE d.campaign_id = $1
                         AND d.participant_id = jackpot_participants.id
                         AND d.status = 'confirmed'
                    )
                  )
              ), 0)::int AS remaining_tickets,
              COUNT(*) FILTER (WHERE NOT eligible)::int AS invalid_records
         FROM jackpot_participants
        WHERE campaign_id = $1`,
      [campaign.id, campaign.allow_multiple_wins],
    ) as unknown as Promise<QueryRow[]>,
  ]);
  const summary = summaryRows[0] || {};

  return {
    role: session.role,
    staffId: session.staffId,
    campaign,
    participants,
    prizes,
    draws: drawRows.map(mapDraw),
    audit,
    summary: {
      totalParticipants: Number(summary.total_participants || 0),
      eligibleParticipants: Number(summary.eligible_participants || 0),
      totalTickets: Number(summary.total_tickets || 0),
      remainingTickets: Number(summary.remaining_tickets || 0),
      invalidRecords: Number(summary.invalid_records || 0),
    },
  };
}

function winnerFromRow(row: QueryRow): WinnerResult {
  return {
    drawId: String(row.draw_id || row.id),
    prizeId: String(row.prize_id),
    winnerParticipantId: String(row.participant_id),
    displayName: String(row.customer_name),
    memberIdMasked: maskMemberId(row.member_id ? String(row.member_id) : null),
    phoneLast4: String(row.phone_last4),
    prizeName: String(row.prize_name),
    isJackpot: Boolean(row.is_jackpot),
    resultToken: String(row.result_token),
    drawnAt: String(row.drawn_at),
    status: row.status as WinnerResult["status"],
  };
}

async function findDrawByRequest(campaignId: string, requestId: string) {
  const sql = getJackpotDb();
  const rows = await sql.query(
    `SELECT d.id AS draw_id, d.prize_id, d.participant_id, d.result_token,
            d.drawn_at, d.status, pr.prize_name, pr.is_jackpot,
            pa.customer_name, pa.member_id, pa.phone_last4
       FROM jackpot_draws d
       JOIN jackpot_prizes pr ON pr.id = d.prize_id
       JOIN jackpot_participants pa ON pa.id = d.participant_id
      WHERE d.campaign_id = $1 AND d.request_id = $2::uuid
      LIMIT 1`,
    [campaignId, requestId],
  ) as QueryRow[];
  return rows[0] ? winnerFromRow(rows[0]) : null;
}

async function eligibleTicketTotal(campaignId: string, prizeId: string) {
  const sql = getJackpotDb();
  const rows = await sql.query(
    `SELECT c.participant_list_locked, c.allow_multiple_wins,
            pr.remaining_quantity, pr.status AS prize_status,
            pr.is_jackpot, pr.allow_previous_winner, pr.draw_order,
            COALESCE(SUM(pa.ticket_count), 0)::int AS total_tickets
       FROM jackpot_campaigns c
       JOIN jackpot_prizes pr ON pr.campaign_id = c.id AND pr.id = $2
       LEFT JOIN jackpot_participants pa
         ON pa.campaign_id = c.id
        AND pa.eligible = TRUE
        AND pa.ticket_count > 0
        AND NOT EXISTS (
          SELECT 1 FROM jackpot_draws same_prize
           WHERE same_prize.prize_id = pr.id
             AND same_prize.participant_id = pa.id
        )
        AND (
          c.allow_multiple_wins = TRUE
          OR pr.allow_previous_winner = TRUE
          OR NOT EXISTS (
            SELECT 1 FROM jackpot_draws prior_win
             WHERE prior_win.campaign_id = c.id
               AND prior_win.participant_id = pa.id
               AND prior_win.status = 'confirmed'
          )
        )
      WHERE c.id = $1
      GROUP BY c.participant_list_locked, c.allow_multiple_wins,
               pr.remaining_quantity, pr.status, pr.is_jackpot,
               pr.allow_previous_winner, pr.draw_order`,
    [campaignId, prizeId],
  ) as QueryRow[];
  return rows[0];
}

export async function createSecureDraw(
  session: StaffSession,
  prizeId: string,
  requestId: string,
) {
  const sql = getJackpotDb();
  const campaign = await getCampaign();
  const existing = await findDrawByRequest(campaign.id, requestId);
  if (existing) return { winner: existing, idempotent: true };

  const pool = await eligibleTicketTotal(campaign.id, prizeId);
  if (!pool) throw new Error("PRIZE_NOT_FOUND");
  if (!pool.participant_list_locked) throw new Error("PARTICIPANT_LIST_NOT_LOCKED");
  if (pool.prize_status !== "active" || Number(pool.remaining_quantity) < 1) {
    throw new Error("PRIZE_NOT_AVAILABLE");
  }
  const ticketOrdinal = secureTicketOrdinal(Number(pool.total_tickets));
  const resultToken = createResultToken();

  const rows = await sql.query(
    `WITH draw_lock AS (
       SELECT pg_advisory_xact_lock(hashtextextended($1::text, 0))
     ),
     campaign AS (
       SELECT c.*
         FROM jackpot_campaigns c, draw_lock
        WHERE c.id = $1
          AND c.participant_list_locked = TRUE
     ),
     prize AS (
       SELECT pr.*
         FROM jackpot_prizes pr
         JOIN campaign c ON c.id = pr.campaign_id
        WHERE pr.id = $2
          AND pr.status = 'active'
          AND pr.remaining_quantity > 0
          AND NOT EXISTS (
            SELECT 1 FROM jackpot_prizes earlier
             WHERE earlier.campaign_id = pr.campaign_id
               AND earlier.status = 'active'
               AND earlier.remaining_quantity > 0
               AND earlier.draw_order < pr.draw_order
          )
          AND (
            pr.is_jackpot = FALSE
            OR (
              pr.quantity = 1
              AND pr.draw_order = (
                SELECT MAX(last_prize.draw_order)
                  FROM jackpot_prizes last_prize
                 WHERE last_prize.campaign_id = pr.campaign_id
              )
              AND NOT EXISTS (
                SELECT 1 FROM jackpot_prizes ordinary
                 WHERE ordinary.campaign_id = pr.campaign_id
                   AND ordinary.is_jackpot = FALSE
                   AND ordinary.remaining_quantity > 0
              )
            )
          )
     ),
     weighted_pool AS (
       SELECT pa.*,
              SUM(pa.ticket_count) OVER (ORDER BY pa.id) AS cumulative_tickets
         FROM jackpot_participants pa
         JOIN campaign c ON c.id = pa.campaign_id
         JOIN prize pr ON TRUE
        WHERE pa.eligible = TRUE
          AND pa.ticket_count > 0
          AND NOT EXISTS (
            SELECT 1 FROM jackpot_draws same_prize
             WHERE same_prize.prize_id = pr.id
               AND same_prize.participant_id = pa.id
          )
          AND (
            c.allow_multiple_wins = TRUE
            OR pr.allow_previous_winner = TRUE
            OR NOT EXISTS (
              SELECT 1 FROM jackpot_draws prior_win
               WHERE prior_win.campaign_id = c.id
                 AND prior_win.participant_id = pa.id
                 AND prior_win.status = 'confirmed'
            )
          )
     ),
     selected AS (
       SELECT * FROM weighted_pool
        WHERE cumulative_tickets >= $4
        ORDER BY cumulative_tickets
        LIMIT 1
     ),
     next_sequence AS (
       SELECT COALESCE(MAX(d.draw_sequence), 0) + 1 AS value
         FROM jackpot_draws d
        WHERE d.prize_id = $2
     ),
     inserted AS (
       INSERT INTO jackpot_draws (
         campaign_id, prize_id, participant_id, request_id, result_token,
         draw_sequence, status, drawn_by
       )
       SELECT c.id, pr.id, selected.id, $3::uuid, $5,
              next_sequence.value, 'pending', $6
         FROM campaign c
         JOIN prize pr ON TRUE
         JOIN selected ON TRUE
         JOIN next_sequence ON TRUE
        WHERE NOT EXISTS (
          SELECT 1 FROM jackpot_draws open_draw
           WHERE open_draw.campaign_id = c.id
             AND open_draw.status IN ('pending', 'unreachable')
        )
       ON CONFLICT (campaign_id, request_id) DO NOTHING
       RETURNING *
     ),
     draw_audit AS (
       INSERT INTO jackpot_audit_log (
         campaign_id, action, entity_type, entity_id, new_value, performed_by
       )
       SELECT inserted.campaign_id, 'draw_initiated', 'draw', inserted.id::text,
              jsonb_build_object(
                'prizeId', inserted.prize_id,
                'requestId', inserted.request_id
              ),
              $6
         FROM inserted
     ),
     winner_audit AS (
       INSERT INTO jackpot_audit_log (
         campaign_id, action, entity_type, entity_id, new_value, performed_by
       )
       SELECT inserted.campaign_id, 'winner_generated', 'draw', inserted.id::text,
              jsonb_build_object(
                'prizeId', inserted.prize_id,
                'drawSequence', inserted.draw_sequence,
                'requestId', inserted.request_id
              ),
              $6
         FROM inserted
     )
     SELECT inserted.id AS draw_id, inserted.prize_id, inserted.participant_id,
            inserted.result_token, inserted.drawn_at, inserted.status,
            pr.prize_name, pr.is_jackpot,
            pa.customer_name, pa.member_id, pa.phone_last4
       FROM inserted
       JOIN jackpot_prizes pr ON pr.id = inserted.prize_id
       JOIN jackpot_participants pa ON pa.id = inserted.participant_id`,
    [campaign.id, prizeId, requestId, ticketOrdinal, resultToken, session.staffId],
  ) as QueryRow[];

  const winner = rows[0]
    ? winnerFromRow(rows[0])
    : await findDrawByRequest(campaign.id, requestId);
  if (!winner) throw new Error("DRAW_CONFLICT");
  return { winner, idempotent: !rows[0] };
}

export async function updateDrawStatus(
  session: StaffSession,
  drawId: string,
  action: "confirm" | "unreachable",
) {
  const sql = getJackpotDb();
  const campaign = await getCampaign();

  if (action === "unreachable") {
    const rows = await sql.query(
      `WITH updated AS (
         UPDATE jackpot_draws
            SET status = 'unreachable'
          WHERE id = $1
            AND campaign_id = $2
            AND status = 'pending'
          RETURNING *
       ),
       audit AS (
         INSERT INTO jackpot_audit_log (
           campaign_id, action, entity_type, entity_id, previous_value, new_value, performed_by
         )
         SELECT campaign_id, 'winner_unreachable', 'draw', id::text,
                '{"status":"pending"}'::jsonb, '{"status":"unreachable"}'::jsonb, $3
           FROM updated
       )
       SELECT * FROM updated`,
      [drawId, campaign.id, session.staffId],
    ) as QueryRow[];
    if (!rows[0]) throw new Error("DRAW_NOT_PENDING");
    return;
  }

  const rows = await sql.query(
    `WITH draw_lock AS (
       SELECT pg_advisory_xact_lock(hashtextextended($2::text, 0))
     ),
     target AS (
       SELECT d.*
         FROM jackpot_draws d, draw_lock
        WHERE d.id = $1
          AND d.campaign_id = $2
          AND d.status IN ('pending', 'unreachable')
     ),
     prize_updated AS (
       UPDATE jackpot_prizes pr
          SET remaining_quantity = pr.remaining_quantity - 1,
              status = CASE WHEN pr.remaining_quantity - 1 = 0 THEN 'completed' ELSE pr.status END,
              updated_at = NOW()
         FROM target
        WHERE pr.id = target.prize_id
          AND pr.remaining_quantity > 0
       RETURNING pr.*
     ),
     draw_updated AS (
       UPDATE jackpot_draws d
          SET status = 'confirmed',
              confirmed_at = NOW(),
              confirmed_by = $3
         FROM target, prize_updated
        WHERE d.id = target.id
       RETURNING d.*
     ),
     audit AS (
       INSERT INTO jackpot_audit_log (
         campaign_id, action, entity_type, entity_id, previous_value, new_value, performed_by
       )
       SELECT campaign_id, 'winner_confirmed', 'draw', id::text,
              '{"status":"pending"}'::jsonb,
              jsonb_build_object('status', 'confirmed', 'prizeId', prize_id),
              $3
         FROM draw_updated
     )
     SELECT * FROM draw_updated`,
    [drawId, campaign.id, session.staffId],
  ) as QueryRow[];
  if (!rows[0]) throw new Error("DRAW_CONFIRM_CONFLICT");
}

export async function redrawWinner(
  session: StaffSession,
  drawId: string,
  requestId: string,
  reason: string,
  confirmJackpot: boolean,
) {
  const sql = getJackpotDb();
  const campaign = await getCampaign();
  const existing = await findDrawByRequest(campaign.id, requestId);
  if (existing) return { winner: existing, idempotent: true };

  const oldRows = await sql.query(
    `SELECT d.id, d.prize_id, d.status, pr.is_jackpot
       FROM jackpot_draws d
       JOIN jackpot_prizes pr ON pr.id = d.prize_id
      WHERE d.id = $1 AND d.campaign_id = $2
      LIMIT 1`,
    [drawId, campaign.id],
  ) as QueryRow[];
  const old = oldRows[0];
  if (!old || !["pending", "unreachable"].includes(String(old.status))) {
    throw new Error("DRAW_NOT_REDRAWABLE");
  }
  if (old.is_jackpot && !confirmJackpot) throw new Error("JACKPOT_REDRAW_CONFIRMATION_REQUIRED");

  const pool = await eligibleTicketTotal(campaign.id, String(old.prize_id));
  const ticketOrdinal = secureTicketOrdinal(Number(pool?.total_tickets || 0));
  const resultToken = createResultToken();

  const rows = await sql.query(
    `WITH draw_lock AS (
       SELECT pg_advisory_xact_lock(hashtextextended($2::text, 0))
     ),
     old_draw AS (
       SELECT d.*
         FROM jackpot_draws d, draw_lock
        WHERE d.id = $1
          AND d.campaign_id = $2
          AND d.status IN ('pending', 'unreachable')
     ),
     voided AS (
       UPDATE jackpot_draws d
          SET status = 'voided',
              voided_at = NOW(),
              voided_by = $7,
              void_reason = $4
         FROM old_draw
        WHERE d.id = old_draw.id
       RETURNING d.*
     ),
     weighted_pool AS (
       SELECT pa.*,
              SUM(pa.ticket_count) OVER (ORDER BY pa.id) AS cumulative_tickets
         FROM jackpot_participants pa
         JOIN jackpot_campaigns c ON c.id = pa.campaign_id
         JOIN jackpot_prizes pr ON pr.id = (SELECT prize_id FROM voided)
        WHERE pa.campaign_id = $2
          AND pa.eligible = TRUE
          AND pa.ticket_count > 0
          AND NOT EXISTS (
            SELECT 1 FROM jackpot_draws same_prize
             WHERE same_prize.prize_id = pr.id
               AND same_prize.participant_id = pa.id
          )
          AND (
            c.allow_multiple_wins = TRUE
            OR pr.allow_previous_winner = TRUE
            OR NOT EXISTS (
              SELECT 1 FROM jackpot_draws prior_win
               WHERE prior_win.campaign_id = c.id
                 AND prior_win.participant_id = pa.id
                 AND prior_win.status = 'confirmed'
            )
          )
     ),
     selected AS (
       SELECT * FROM weighted_pool
        WHERE cumulative_tickets >= $5
        ORDER BY cumulative_tickets
        LIMIT 1
     ),
     next_sequence AS (
       SELECT COALESCE(MAX(draw_sequence), 0) + 1 AS value
         FROM jackpot_draws
        WHERE prize_id = (SELECT prize_id FROM voided)
     ),
     inserted AS (
       INSERT INTO jackpot_draws (
         campaign_id, prize_id, participant_id, request_id, result_token,
         draw_sequence, status, drawn_by
       )
       SELECT $2, voided.prize_id, selected.id, $3::uuid, $6,
              next_sequence.value, 'pending', $7
         FROM voided, selected, next_sequence
       ON CONFLICT (campaign_id, request_id) DO NOTHING
       RETURNING *
     ),
     void_audit AS (
       INSERT INTO jackpot_audit_log (
         campaign_id, action, entity_type, entity_id, previous_value, new_value,
         performed_by, reason
       )
       SELECT campaign_id, 'draw_voided', 'draw', id::text,
              jsonb_build_object('status', (SELECT status FROM old_draw)),
              '{"status":"voided"}'::jsonb, $7, $4
         FROM voided
     ),
     redraw_audit AS (
       INSERT INTO jackpot_audit_log (
         campaign_id, action, entity_type, entity_id, new_value, performed_by, reason
       )
       SELECT campaign_id, 'redraw_performed', 'draw', id::text,
              jsonb_build_object('replacesDrawId', $1, 'requestId', request_id),
              $7, $4
         FROM inserted
     )
     SELECT inserted.id AS draw_id, inserted.prize_id, inserted.participant_id,
            inserted.result_token, inserted.drawn_at, inserted.status,
            pr.prize_name, pr.is_jackpot,
            pa.customer_name, pa.member_id, pa.phone_last4
       FROM inserted
       JOIN jackpot_prizes pr ON pr.id = inserted.prize_id
       JOIN jackpot_participants pa ON pa.id = inserted.participant_id`,
    [
      drawId,
      campaign.id,
      requestId,
      reason,
      ticketOrdinal,
      resultToken,
      session.staffId,
    ],
  ) as QueryRow[];

  const winner = rows[0]
    ? winnerFromRow(rows[0])
    : await findDrawByRequest(campaign.id, requestId);
  if (!winner) throw new Error("REDRAW_CONFLICT");
  return { winner, idempotent: !rows[0] };
}

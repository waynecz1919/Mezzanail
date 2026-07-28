CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS jackpot_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  event_date DATE NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'setup'
    CHECK (status IN ('setup', 'live', 'completed', 'archived')),
  participant_list_locked BOOLEAN NOT NULL DEFAULT FALSE,
  locked_at TIMESTAMPTZ,
  locked_by TEXT,
  allow_multiple_wins BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT jackpot_campaign_lock_audit CHECK (
    participant_list_locked = FALSE
    OR (locked_at IS NOT NULL AND NULLIF(BTRIM(locked_by), '') IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS jackpot_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES jackpot_campaigns(id) ON DELETE RESTRICT,
  entry_id TEXT,
  member_id TEXT,
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  phone_last4 CHAR(4) NOT NULL,
  ticket_count INTEGER NOT NULL CHECK (ticket_count > 0 AND ticket_count <= 10000),
  eligible BOOLEAN NOT NULL DEFAULT TRUE,
  eligibility_status TEXT NOT NULL DEFAULT 'eligible',
  source TEXT NOT NULL DEFAULT 'csv',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS jackpot_participant_member_unique
  ON jackpot_participants (campaign_id, LOWER(member_id))
  WHERE member_id IS NOT NULL AND BTRIM(member_id) <> '';

CREATE UNIQUE INDEX IF NOT EXISTS jackpot_participant_phone_unique
  ON jackpot_participants (campaign_id, phone_number);

CREATE INDEX IF NOT EXISTS jackpot_participant_pool_idx
  ON jackpot_participants (campaign_id, eligible, id)
  WHERE eligible = TRUE AND ticket_count > 0;

CREATE TABLE IF NOT EXISTS jackpot_prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES jackpot_campaigns(id) ON DELETE RESTRICT,
  prize_name TEXT NOT NULL,
  prize_description TEXT,
  prize_image_url TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 1000),
  remaining_quantity INTEGER NOT NULL
    CHECK (remaining_quantity >= 0 AND remaining_quantity <= quantity),
  draw_order INTEGER NOT NULL CHECK (draw_order > 0),
  is_jackpot BOOLEAN NOT NULL DEFAULT FALSE,
  allow_previous_winner BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(16) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campaign_id, draw_order),
  CONSTRAINT jackpot_single_quantity CHECK (is_jackpot = FALSE OR quantity = 1)
);

CREATE UNIQUE INDEX IF NOT EXISTS jackpot_one_grand_prize
  ON jackpot_prizes (campaign_id)
  WHERE is_jackpot = TRUE;

CREATE TABLE IF NOT EXISTS jackpot_draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES jackpot_campaigns(id) ON DELETE RESTRICT,
  prize_id UUID NOT NULL REFERENCES jackpot_prizes(id) ON DELETE RESTRICT,
  participant_id UUID NOT NULL REFERENCES jackpot_participants(id) ON DELETE RESTRICT,
  request_id UUID NOT NULL,
  result_token TEXT NOT NULL UNIQUE,
  draw_sequence INTEGER NOT NULL CHECK (draw_sequence > 0),
  status VARCHAR(16) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'unreachable', 'confirmed', 'voided')),
  drawn_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  drawn_by TEXT NOT NULL,
  confirmed_at TIMESTAMPTZ,
  confirmed_by TEXT,
  voided_at TIMESTAMPTZ,
  voided_by TEXT,
  void_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campaign_id, request_id),
  UNIQUE (prize_id, draw_sequence),
  CONSTRAINT jackpot_draw_confirm_audit CHECK (
    status <> 'confirmed'
    OR (confirmed_at IS NOT NULL AND NULLIF(BTRIM(confirmed_by), '') IS NOT NULL)
  ),
  CONSTRAINT jackpot_draw_void_audit CHECK (
    status <> 'voided'
    OR (
      voided_at IS NOT NULL
      AND NULLIF(BTRIM(voided_by), '') IS NOT NULL
      AND NULLIF(BTRIM(void_reason), '') IS NOT NULL
    )
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS jackpot_one_open_draw_per_campaign
  ON jackpot_draws (campaign_id)
  WHERE status IN ('pending', 'unreachable');

CREATE INDEX IF NOT EXISTS jackpot_draw_history_idx
  ON jackpot_draws (campaign_id, drawn_at DESC);

CREATE TABLE IF NOT EXISTS jackpot_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES jackpot_campaigns(id) ON DELETE RESTRICT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  previous_value JSONB,
  new_value JSONB,
  performed_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason TEXT
);

CREATE INDEX IF NOT EXISTS jackpot_audit_campaign_idx
  ON jackpot_audit_log (campaign_id, created_at DESC);

INSERT INTO jackpot_campaigns (slug, name, event_date)
VALUES (
  'mezzanail-7th-anniversary-final',
  'Mezzanail 7th Anniversary Jackpot Draw',
  DATE '2026-09-30'
)
ON CONFLICT (slug) DO NOTHING;

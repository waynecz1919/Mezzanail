CREATE TABLE IF NOT EXISTS redeem_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  customer_group TEXT NOT NULL,
  redeem_code VARCHAR(32) NOT NULL UNIQUE,
  voucher_type TEXT NOT NULL,
  voucher_description TEXT NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'redeemed', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  redeemed_at TIMESTAMPTZ,
  redeemed_by TEXT,
  expiry_date DATE NOT NULL,
  notes TEXT,
  CONSTRAINT redeem_code_format CHECK (
    redeem_code ~ '^MN-[A-Z0-9]{2,8}-[A-Z0-9]{4}$'
  ),
  CONSTRAINT redeemed_audit_required CHECK (
    status <> 'redeemed'
    OR (redeemed_at IS NOT NULL AND NULLIF(BTRIM(redeemed_by), '') IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS redeem_codes_status_created_idx
  ON redeem_codes (status, created_at DESC);

CREATE INDEX IF NOT EXISTS redeem_codes_expiry_idx
  ON redeem_codes (expiry_date)
  WHERE status IN ('pending', 'sent');

CREATE INDEX IF NOT EXISTS redeem_codes_customer_search_idx
  ON redeem_codes (LOWER(customer_name));

CREATE INDEX IF NOT EXISTS redeem_codes_phone_search_idx
  ON redeem_codes (phone);

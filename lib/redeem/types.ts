export const redeemStatuses = [
  "pending",
  "sent",
  "redeemed",
  "expired",
  "cancelled",
] as const;

export type RedeemStatus = (typeof redeemStatuses)[number];

export type RedeemCodeRecord = {
  id: string;
  customer_name: string;
  phone: string;
  customer_group: string;
  redeem_code: string;
  voucher_type: string;
  voucher_description: string;
  status: RedeemStatus;
  created_at: string;
  sent_at: string | null;
  redeemed_at: string | null;
  redeemed_by: string | null;
  expiry_date: string;
  notes: string | null;
};

export type GenerateRedeemCodeInput = {
  customerName: string;
  phone: string;
  customerGroup: string;
  voucherType: string;
  voucherDescription: string;
  expiryDate: string;
  notes?: string;
};

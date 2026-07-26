import type { PromotionSource } from "@/lib/promotion/campaign-config";

export const REFERRAL_STORAGE_KEY = "mezzanail_anniversary_referral";
export const REFERRAL_PATTERN = /^[A-Za-z0-9_-]{1,30}$/;
export const PROMOTION_SOURCES: readonly PromotionSource[] = [
  "nfc",
  "qr",
  "whatsapp",
  "website",
  "direct",
];

export function validateReferralCode(value: string | null | undefined) {
  if (!value) return null;
  const normalized = value.trim();
  return REFERRAL_PATTERN.test(normalized) ? normalized : null;
}

export function validatePromotionSource(
  value: string | null | undefined,
): PromotionSource {
  return PROMOTION_SOURCES.includes(value as PromotionSource)
    ? (value as PromotionSource)
    : "direct";
}

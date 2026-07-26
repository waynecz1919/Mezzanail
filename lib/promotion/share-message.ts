import { validateReferralCode } from "@/lib/promotion/referral";

const WHATSAPP_PROMOTION_URL = "https://www.mezzanail.com/promotion";

export function getPromotionShareLink(referralCode?: string | null) {
  const safeReferralCode = validateReferralCode(referralCode);
  const url = new URL(WHATSAPP_PROMOTION_URL);
  if (safeReferralCode) url.searchParams.set("ref", safeReferralCode);
  return url.toString().replace(/\/$/, "");
}

export function getWhatsAppShareMessage(
  referralCode?: string | null,
) {
  const shareLink = getPromotionShareLink(referralCode);

  return `🎉 MEZZANAIL 7th Anniversary Celebration!

Celebrate with Mezzanail from 26 July to 30 September 2026 and stand a chance to win exciting prizes, including:

⌚ Apple Watch SE 3
✨ Dyson Supersonic™ Travel Hair Dryer
🎁 Exclusive Member Rewards
💅 Anniversary Lucky Draw Prizes

Book your appointment and discover the celebration here:
${shareLink}

──────────

🎉 MEZZANAIL 七周年庆典！

Mezzanail 七周年庆祝活动将于 2026年7月26日至9月30日举行，参加活动即有机会赢取丰富奖品，包括：

⌚ Apple Watch SE 3
✨ Dyson Supersonic™ 旅行吹风机
🎁 会员专属奖励
💅 七周年幸运抽奖奖品

立即预约并查看周年庆典详情：
${shareLink}`;
}

export function getWhatsAppShareUrl(
  referralCode?: string | null,
) {
  return `https://wa.me/?text=${encodeURIComponent(
    getWhatsAppShareMessage(referralCode),
  )}`;
}

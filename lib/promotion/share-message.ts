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

💨 Dyson Supersonic™ Travel Hair Dryer
⌚ HUAWEI Watch Fit 5
✨ Xiaomi Robot Vacuum
🎁 Beauty Vouchers & Weekly Rewards

Join our membership, scan and share with 3 friends, then enter the lucky draw:
${shareLink}

把这份喜悦分享给朋友吧！

🎉 MEZZANAIL 七周年庆典！

Mezzanail 与你一起庆祝七周年！活动日期为 2026年7月26日至9月30日，参与活动即有机会赢取丰富奖品，包括：

💨 Dyson Supersonic™ 旅行吹风机
⌚ HUAWEI Watch Fit 5
✨ Xiaomi 扫地机器人
🎁 美容礼券与每周奖励

加入会员，扫码分享给3位朋友，再参加幸运抽奖：
${shareLink}`;
}

export function getWhatsAppShareUrl(
  referralCode?: string | null,
) {
  return `https://wa.me/?text=${encodeURIComponent(
    getWhatsAppShareMessage(referralCode),
  )}`;
}

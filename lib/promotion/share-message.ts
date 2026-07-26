import {
  anniversaryCampaign,
  type PromotionLanguage,
} from "@/lib/promotion/campaign-config";
import { validateReferralCode } from "@/lib/promotion/referral";

export function getPromotionShareLink(referralCode?: string | null) {
  const safeReferralCode = validateReferralCode(referralCode);
  const url = new URL(anniversaryCampaign.promotionUrl);
  if (safeReferralCode) url.searchParams.set("ref", safeReferralCode);
  return url.toString().replace(/\/$/, "");
}

export function getWhatsAppShareMessage(
  language: PromotionLanguage,
  referralCode?: string | null,
) {
  const shareLink = getPromotionShareLink(referralCode);

  const messages: Record<PromotionLanguage, string> = {
    en: `🎉 MEZZANAIL 7th Anniversary Celebration!

Celebrate with Mezzanail from 26 July to 30 September 2026 and stand a chance to win exciting prizes, including:

⌚ Apple Watch SE 3
✨ Dyson Supersonic™ Travel Hair Dryer
🎁 Exclusive Member Rewards
💅 Anniversary Lucky Draw Prizes

Book your appointment and discover the celebration here:
${shareLink}`,
    zh: `🎉 Mezzanail 七周年庆典开始啦！

活动日期：2026年7月26日至9月30日。

现在预约并参与周年活动，还有机会赢取：

⌚ Apple Watch SE 3
✨ Dyson Supersonic™ Travel Hair Dryer
🎁 会员专属奖励
💅 七周年幸运抽奖奖品

立即查看活动与预约：
${shareLink}`,
    ms: `🎉 Sambutan Ulang Tahun Ke-7 MEZZANAIL!

Sertai sambutan kami dari 26 Julai hingga 30 September 2026 dan rebut peluang memenangi hadiah menarik:

⌚ Apple Watch SE 3
✨ Dyson Supersonic™ Travel Hair Dryer
🎁 Ganjaran Eksklusif Ahli
💅 Hadiah Cabutan Bertuah Ulang Tahun

Lihat promosi dan buat tempahan di:
${shareLink}`,
  };

  return messages[language];
}

export function getWhatsAppShareUrl(
  language: PromotionLanguage,
  referralCode?: string | null,
) {
  return `https://wa.me/?text=${encodeURIComponent(
    getWhatsAppShareMessage(language, referralCode),
  )}`;
}

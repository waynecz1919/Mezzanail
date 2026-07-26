import {
  anniversaryCampaign,
  type PromotionLanguage,
  type PromotionSource,
} from "@/lib/promotion/campaign-config";

export type PromotionEventName =
  | "promotion_page_view"
  | "promotion_book_click"
  | "promotion_whatsapp_share"
  | "promotion_language_change"
  | "promotion_qr_view";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPromotionEvent(
  eventName: PromotionEventName,
  params: {
    language: PromotionLanguage;
    referralCode: string | null;
    source: PromotionSource;
  },
) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", eventName, {
    campaign_name: anniversaryCampaign.analyticsName,
    language: params.language,
    referral_code: params.referralCode ?? "",
    source: params.source,
  });
}

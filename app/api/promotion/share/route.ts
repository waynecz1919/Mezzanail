import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
  anniversaryCampaign,
  type PromotionLanguage,
} from "@/lib/promotion/campaign-config";
import { validateReferralCode } from "@/lib/promotion/referral";

const LANGUAGES: readonly PromotionLanguage[] = ["en", "zh", "ms"];
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;
const requestWindows = new Map<string, { count: number; expiresAt: number }>();

function rateLimitKey(userAgent: string) {
  return createHash("sha256")
    .update(`${anniversaryCampaign.id}:${userAgent}`)
    .digest("hex")
    .slice(0, 24);
}

function isRateLimited(key: string, now: number) {
  const current = requestWindows.get(key);
  if (!current || current.expiresAt <= now) {
    requestWindows.set(key, {
      count: 1,
      expiresAt: now + WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const userAgent = request.headers.get("user-agent") ?? "unknown";
    const now = Date.now();
    const anonymousClientKey = rateLimitKey(userAgent);

    if (isRateLimited(anonymousClientKey, now)) {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 },
      );
    }

    if (
      body.campaign !== anniversaryCampaign.id ||
      body.channel !== "whatsapp" ||
      !LANGUAGES.includes(body.language as PromotionLanguage)
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid_request" },
        { status: 400 },
      );
    }

    const referralCode =
      typeof body.referralCode === "string"
        ? validateReferralCode(body.referralCode)
        : null;
    const page =
      typeof body.page === "string" && body.page.startsWith("/")
        ? body.page.slice(0, 120)
        : "/";

    const shareRecord = {
      campaign: anniversaryCampaign.id,
      channel: "whatsapp",
      language: body.language,
      referralCode,
      timestamp: new Date(now).toISOString(),
      anonymousClientKey,
      page,
    };

    // Vercel runtime logs provide the lightweight server-side audit trail.
    // No IP address, phone number or raw user-agent value is stored.
    console.info("promotion_share", JSON.stringify(shareRecord));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("promotion_share_error", error);
    return NextResponse.json(
      { ok: false, error: "invalid_request" },
      { status: 400 },
    );
  }
}

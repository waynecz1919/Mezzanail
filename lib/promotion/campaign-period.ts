export const campaign = {
  start: "2026-07-26T00:00:00+08:00",
  end: "2026-09-30T23:59:59+08:00",
} as const;

export function isCampaignActive(now: Date = new Date()) {
  const timestamp = now.getTime();
  return timestamp >= Date.parse(campaign.start) && timestamp <= Date.parse(campaign.end);
}

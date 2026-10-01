"use client";

import { CampaignBanner } from "@/components/marketing/CampaignBanner";
import { currentCampaign } from "@/config/current-campaign";
import { useCampaignActive } from "@/lib/promotion/use-campaign-active";

export function CurrentCampaignBanner() {
  const active = useCampaignActive();

  return (
    <CampaignBanner
      desktopSrc={currentCampaign.desktopSrc}
      mobileSrc={currentCampaign.mobileSrc}
      alt={currentCampaign.alt}
      href={currentCampaign.href}
      openInNewTab={currentCampaign.openInNewTab}
      priority={currentCampaign.priority}
      width={currentCampaign.width}
      height={currentCampaign.height}
      mobileWidth={currentCampaign.mobileWidth}
      mobileHeight={currentCampaign.mobileHeight}
      campaignId={currentCampaign.id}
      campaignName={currentCampaign.name}
      heading={currentCampaign.heading}
      campaignTitle={currentCampaign.campaignTitle}
      dates={currentCampaign.dates}
      invitation={currentCampaign.invitation}
      promotionLabel={currentCampaign.promotionLabel}
      bookingLabel={currentCampaign.bookingLabel}
      active={active}
      inactiveSrc="/studio/mezzanail-studio-sign.jpg"
      inactiveAlt="Mezzanail Nail Studio in Melaka"
    />
  );
}

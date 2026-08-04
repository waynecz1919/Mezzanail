import { CampaignBanner } from "@/components/marketing/CampaignBanner";
import { currentCampaign } from "@/config/current-campaign";

export function CurrentCampaignBanner() {
  if (!currentCampaign.enabled) return null;

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
    />
  );
}

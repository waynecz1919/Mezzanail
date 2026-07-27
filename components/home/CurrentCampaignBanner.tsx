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
      campaignId={currentCampaign.id}
      campaignName={currentCampaign.name}
    />
  );
}

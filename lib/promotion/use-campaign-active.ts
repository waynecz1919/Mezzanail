"use client";

import { useEffect, useState } from "react";
import { isCampaignActive } from "@/lib/promotion/campaign-period";

export function useCampaignActive() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isCampaignActive(new Date()));
  }, []);

  return active;
}

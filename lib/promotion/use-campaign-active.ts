"use client";

import { useSyncExternalStore } from "react";
import { isCampaignActive } from "@/lib/promotion/campaign-period";

function subscribe(onStoreChange: () => void) {
  const timer = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(timer);
}

function getSnapshot() {
  return isCampaignActive(new Date());
}

function getServerSnapshot() {
  return false;
}

export function useCampaignActive() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

"use client";

import { useSyncExternalStore } from "react";
import { isOfferActive } from "@/config/current-offer";

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(timer);
}

const getClientSnapshot = () => isOfferActive(new Date());
// Static HTML is built while the offer runs; after hydration the visitor's
// clock decides, so the offer disappears once it ends with no hydration error.
const getServerSnapshot = () => true;

export function useOfferActive(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

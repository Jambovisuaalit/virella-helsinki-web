"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent, type AnalyticsEventName } from "@/lib/analytics/client";

type FunnelEventProps = {
  name: AnalyticsEventName;
  productId?: string;
  source?: string;
};

export function FunnelEvent({ name, productId, source }: FunnelEventProps) {
  useEffect(() => {
    trackAnalyticsEvent(name, { productId, source });
  }, [name, productId, source]);

  return null;
}

"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent, type AnalyticsEventName } from "@/lib/analytics/client";

type FunnelEventProps = {
  name: AnalyticsEventName;
  productId?: string;
  source?: string;
  value?: number;
  currency?: string;
  transactionId?: string;
  eventId?: string;
};

export function FunnelEvent({
  name,
  productId,
  source,
  value,
  currency,
  transactionId,
  eventId,
}: FunnelEventProps) {
  useEffect(() => {
    let recorded = false;
    const track = () => {
      if (!recorded) recorded = trackAnalyticsEvent(name, { productId, source, value, currency, transactionId }, eventId);
    };
    track();
    window.addEventListener("virella:analytics-consent", track);
    return () => window.removeEventListener("virella:analytics-consent", track);
  }, [name, productId, source, value, currency, transactionId, eventId]);

  return null;
}

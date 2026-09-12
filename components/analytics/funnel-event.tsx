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
};

export function FunnelEvent({
  name,
  productId,
  source,
  value,
  currency,
  transactionId,
}: FunnelEventProps) {
  useEffect(() => {
    trackAnalyticsEvent(name, { productId, source, value, currency, transactionId });
  }, [name, productId, source, value, currency, transactionId]);

  return null;
}

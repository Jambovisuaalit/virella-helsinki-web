import type { AnalyticsEventData, AnalyticsEventName } from "@/lib/analytics/events";

export type { AnalyticsEventName } from "@/lib/analytics/events";

export function trackAnalyticsEvent(name: AnalyticsEventName, data: AnalyticsEventData = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    eventName: name,
    productId: data.productId,
    source: data.source,
    path: window.location.pathname,
  };

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    keepalive: true,
    body: JSON.stringify(payload),
  }).catch(() => undefined);
}

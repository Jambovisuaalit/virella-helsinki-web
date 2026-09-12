import type { AnalyticsEventData, AnalyticsEventName } from "@/lib/analytics/events";

export type { AnalyticsEventName } from "@/lib/analytics/events";

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function getGtag() {
  const target = window as GtagWindow;
  target.dataLayer ||= [];
  target.gtag ||= (...args: unknown[]) => {
    target.dataLayer?.push(args);
  };
  return target.gtag;
}

function eventNameForGa4(name: AnalyticsEventName) {
  if (name === "checkout_started") return "begin_checkout";
  if (name === "checkout_success") return "purchase";
  return name;
}

export function trackAnalyticsEvent(name: AnalyticsEventName, data: AnalyticsEventData = {}) {
  if (typeof window === "undefined") return;

  const params: Record<string, unknown> = {
    page_path: window.location.pathname,
    page_location: window.location.href,
  };

  if (name === "page_view") params.page_title = document.title;
  if (data.productId) {
    params.product_id = data.productId;
    params.items = [{ item_id: data.productId }];
  }
  if (data.source) params.source = data.source;
  if (typeof data.value === "number" && Number.isFinite(data.value)) params.value = data.value;
  if (data.currency) params.currency = data.currency.toUpperCase();
  if (data.transactionId) params.transaction_id = data.transactionId;

  getGtag()("event", eventNameForGa4(name), params);
}

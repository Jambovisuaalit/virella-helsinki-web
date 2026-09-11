export type AnalyticsEventName =
  | "service_view"
  | "purchase_click"
  | "checkout_started"
  | "checkout_success"
  | "questionnaire_started"
  | "questionnaire_completed"
  | "contact_submit";

export type AnalyticsEventData = {
  productId?: string;
  source?: string;
};

declare global {
  interface Window {
    va?: (...args: unknown[]) => void;
    vaq?: unknown[][];
  }
}

export function trackAnalyticsEvent(name: AnalyticsEventName, data: AnalyticsEventData = {}) {
  if (typeof window === "undefined") return;

  window.va?.("event", {
    name,
    data,
  });
}

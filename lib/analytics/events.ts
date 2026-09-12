export const analyticsEventNames = [
  "page_view",
  "service_view",
  "purchase_click",
  "checkout_started",
  "checkout_success",
  "questionnaire_started",
  "questionnaire_completed",
  "contact_submit",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export type AnalyticsEventData = {
  productId?: string;
  source?: string;
  value?: number;
  currency?: string;
  transactionId?: string;
};

export function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
  return typeof value === "string" && analyticsEventNames.includes(value as AnalyticsEventName);
}

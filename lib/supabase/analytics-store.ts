import type { AnalyticsEventName } from "@/lib/analytics/events";

export type AnalyticsEventRecord = {
  eventName: AnalyticsEventName;
  productId?: string;
  source?: string;
  path?: string;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error("Supabase server configuration is missing");
  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

export async function saveAnalyticsEvent(event: AnalyticsEventRecord) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/analytics_events`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    cache: "no-store",
    body: JSON.stringify({
      event_name: event.eventName,
      product_id: event.productId ?? null,
      source: event.source ?? null,
      path: event.path ?? null,
    }),
  });

  if (!response.ok) {
    console.error("Analytics event store failed", response.status);
    throw new Error("Analytics event store failed");
  }
}

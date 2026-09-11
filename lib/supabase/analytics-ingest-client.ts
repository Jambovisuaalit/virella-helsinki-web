import type { AnalyticsEventName } from "@/lib/analytics/events";

export type AnalyticsIngestEvent = {
  eventName: AnalyticsEventName;
  productId?: string;
  source?: string;
  path?: string;
};

const ANALYTICS_FUNCTION = "virella-analytics-ingest";

function getAnalyticsIngestConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const oidcToken = process.env.VERCEL_OIDC_TOKEN?.trim();

  if (!supabaseUrl || !oidcToken) {
    throw new Error("Analytics ingest configuration is missing");
  }

  return { supabaseUrl, oidcToken };
}

export async function sendAnalyticsEvent(event: AnalyticsIngestEvent) {
  const { supabaseUrl, oidcToken } = getAnalyticsIngestConfig();
  const response = await fetch(`${supabaseUrl}/functions/v1/${ANALYTICS_FUNCTION}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${oidcToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    console.error("Analytics ingest request failed", response.status);
    throw new Error("Analytics ingest request failed");
  }
}

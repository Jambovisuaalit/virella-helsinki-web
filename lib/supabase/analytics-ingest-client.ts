import { getVercelOidcToken } from "@vercel/oidc";
import type { AnalyticsEventName } from "@/lib/analytics/events";

export type AnalyticsIngestEvent = {
  eventName: AnalyticsEventName;
  productId?: string;
  source?: string;
  path?: string;
};

const ANALYTICS_FUNCTION = "virella-analytics-ingest";
const VERCEL_PROJECT = "virella-helsinki-web";
const VERCEL_TEAM = "info-32533854s-projects";

function getSupabaseUrl() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  if (!supabaseUrl) throw new Error("Analytics ingest configuration is missing");
  return supabaseUrl;
}

export async function sendAnalyticsEvent(event: AnalyticsIngestEvent) {
  const supabaseUrl = getSupabaseUrl();
  const oidcToken = await getVercelOidcToken({
    project: VERCEL_PROJECT,
    team: VERCEL_TEAM,
  });

  if (!oidcToken) throw new Error("Vercel OIDC token is unavailable");

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

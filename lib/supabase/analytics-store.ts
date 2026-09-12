import { createHash } from "node:crypto";
import type { AnalyticsEventName } from "@/lib/analytics/events";

export type AnalyticsEventRecord = {
  eventName: AnalyticsEventName;
  productId?: string;
  source?: string;
  path?: string;
};

function getSupabaseConfig() {
  const rawUrl = process.env.SUPABASE_URL;
  const rawServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!rawUrl || !rawServiceRoleKey) throw new Error("Supabase server configuration is missing");

  const url = rawUrl.trim().replace(/\/$/, "");
  const serviceRoleKey = rawServiceRoleKey.trim();
  return { url, serviceRoleKey };
}

function getAuthHeaders(key: string): Record<string, string> {
  const headers: Record<string, string> = { apikey: key };
  if (!key.startsWith("sb_secret_")) {
    headers.Authorization = `Bearer ${key}`;
  }
  return headers;
}

function keyType(key: string) {
  if (key.startsWith("sb_secret_")) return "secret";
  if (key.startsWith("sb_publishable_")) return "publishable";
  if (key.startsWith("eyJ")) return "legacy_jwt";
  return "unknown";
}

function keyFingerprint(key: string) {
  return createHash("sha256").update(key).digest("hex").slice(0, 12);
}

function legacyJwtClaims(key: string) {
  if (!key.startsWith("eyJ")) return {};

  try {
    const [, payload] = key.split(".");
    if (!payload) return {};
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      role?: string;
      ref?: string;
    };
    return {
      jwtRole: claims.role ?? "unknown",
      jwtRef: claims.ref ?? "unknown",
    };
  } catch {
    return { jwtRole: "invalid", jwtRef: "invalid" };
  }
}

export async function saveAnalyticsEvent(event: AnalyticsEventRecord) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/analytics_events`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(serviceRoleKey),
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
    console.error("Analytics event store failed", {
      status: response.status,
      supabaseHost: new URL(url).host,
      keyType: keyType(serviceRoleKey),
      keyFingerprint: keyFingerprint(serviceRoleKey),
      ...legacyJwtClaims(serviceRoleKey),
    });
    throw new Error("Analytics event store failed");
  }
}

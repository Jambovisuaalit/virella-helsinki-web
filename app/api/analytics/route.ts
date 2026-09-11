import { NextResponse } from "next/server";
import { products } from "@/config/products";
import { isAnalyticsEventName } from "@/lib/analytics/events";
import { sendAnalyticsEvent } from "@/lib/supabase/analytics-ingest-client";

const productIds = new Set<string>(Object.values(products).map((product) => product.id));
const safeSourcePattern = /^[a-z0-9_-]{1,64}$/i;

function cleanOptionalString(value: unknown, maxLength: number) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > maxLength) return null;
  return cleaned;
}

function cleanPath(value: unknown) {
  const raw = cleanOptionalString(value, 160);
  if (raw === undefined || raw === null || !raw.startsWith("/")) return raw;
  return raw.split(/[?#]/, 1)[0];
}

export async function POST(request: Request) {
  if (process.env.VERCEL_ENV !== "production") {
    return new NextResponse(null, { status: 204 });
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
    }
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  if (!isAnalyticsEventName(body.eventName)) {
    return NextResponse.json({ error: "invalid_event" }, { status: 400 });
  }

  const productId = cleanOptionalString(body.productId, 64);
  const source = cleanOptionalString(body.source, 64);
  const path = cleanPath(body.path);

  if (
    productId === null ||
    (productId !== undefined && !productIds.has(productId)) ||
    source === null ||
    (source !== undefined && !safeSourcePattern.test(source)) ||
    path === null ||
    (path !== undefined && !path.startsWith("/"))
  ) {
    return NextResponse.json({ error: "invalid_event_data" }, { status: 400 });
  }

  try {
    await sendAnalyticsEvent({
      eventName: body.eventName,
      productId,
      source,
      path,
    });
  } catch {
    return NextResponse.json({ error: "analytics_unavailable" }, { status: 503 });
  }

  return new NextResponse(null, { status: 204 });
}

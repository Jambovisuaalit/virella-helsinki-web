import { NextResponse } from "next/server";

// Legacy first-party analytics endpoint retained as a no-op for cached clients.
// Production analytics is sent directly to GA4 from the browser.
export async function POST() {
  return new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}

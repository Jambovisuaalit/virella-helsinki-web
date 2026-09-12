import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe/stripe-api";

export const dynamic = "force-dynamic";

const QA_TOKEN = "qa_DY-IWDv6CABZA-WAw05QmPV9HPGAZo6_";

export async function GET(request: Request) {
  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.json({ error: "production_only" }, { status: 404 });
  }
  if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) {
    return NextResponse.json({ error: "stripe_test_mode_required" }, { status: 503 });
  }
  const url = new URL(request.url);
  if (url.searchParams.get("token") !== QA_TOKEN) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
  const session = await createCheckoutSession("websiteFix", origin);
  return NextResponse.json({
    id: session.id,
    url: session.url,
    amountTotal: session.amount_total,
    currency: session.currency,
    livemode: false,
  });
}
